import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const { backendUrl, token, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { department, icon } = location.state || {};

  const [form, setForm] = useState({
    date: '',
    time: '',
    referral: null,
    symptoms: [],
    otherSymptom: '',
  });

  const [unavailableSlots, setUnavailableSlots] = useState([]);

  const timeSlots = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM',
    '03:30 PM', '04:00 PM'
  ];

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'date') {
      const selectedDate = new Date(value);
      const day = selectedDate.getDay();
      if (day === 0 || day === 6) {
        toast.error('Appointments are only available Monday to Friday');
        return;
      }
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm(prev => ({ ...prev, referral: e.target.files[0] }));
  };

  const handleTimeSelect = (slot) => {
    setForm(prev => ({ ...prev, time: slot }));
  };

  const checkSlotAvailability = async () => {
    if (!form.date || !department) return;

    const [year, month, day] = form.date.split('-');
    const slotDate = `${parseInt(day)}_${parseInt(month)}_${year}`;

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/check-slot?department=${department}&date=${slotDate}`
      );

      if (data.success) {
        setUnavailableSlots(data.unavailable || []);
      }
    } catch (error) {
      console.error('Slot availability error:', error);
    }
  };

  useEffect(() => {
    checkSlotAvailability();
  }, [form.date]);

  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Login to book appointment');
      return navigate('/login');
    }

    if (!department || !form.date || !form.time || !userData || !userData._id) {
      toast.error('Missing required information');
      return;
    }

    const [year, month, day] = form.date.split('-');
    const slotDate = `${parseInt(day)}_${parseInt(month)}_${year}`;
    const slotTime = form.time;

    const formData = new FormData();
    formData.append('userId', userData._id);
    formData.append('departmentname', department);
    formData.append('slotDate', slotDate);
    formData.append('slotTime', slotTime);
    formData.append('otherSymptom', form.otherSymptom.trim());

    // ✅ Append symptoms[]
    form.symptoms.forEach(s => {
      formData.append('symptoms[]', s);
    });

    if (form.referral) {
      formData.append('referralLetter', form.referral);
    }

    // 🔍 Debug output (optional)
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        formData,
        {
          headers: {
            token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        // ✅ Reset form
        setForm({
          date: '',
          time: '',
          referral: null,
          symptoms: [],
          otherSymptom: '',
        });
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to book appointment');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded relative">
      <button
        onClick={() => navigate('/department')}
        className="absolute top-4 left-4 text-sm bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90"
      >
        ← Back to Department
      </button>

      <h2 className="text-2xl font-semibold mb-6 text-center">Book Appointment</h2>

      <div className="text-center text-sm font-medium mb-4">
        <p><span className="text-gray-500">Department:</span> {department || 'Not selected'}</p>
        {icon && <img src={icon} alt="Department Icon" className="mx-auto mt-2 w-12 h-12" />}
      </div>

      {/* Date Picker */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-1">Appointment Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
          required
          min={today.toISOString().split('T')[0]}
          max={maxDate.toISOString().split('T')[0]}
        />
      </div>

      {/* Time Slots */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2">Select Time</label>
        <div className="flex flex-wrap gap-2">
          {timeSlots.map(slot => {
            const isUnavailable = unavailableSlots.includes(slot);
            return (
              <button
                key={slot}
                type="button"
                onClick={() => !isUnavailable && handleTimeSelect(slot)}
                disabled={isUnavailable}
                className={`px-4 py-2 text-sm rounded border ${
                  form.time === slot ? 'bg-blue-500 text-white' : isUnavailable ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300'
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* Referral Upload */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-1">Upload Referral Letter (Optional)</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full border px-3 py-2 rounded"
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </div>

      {/* Symptoms */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2">Select Symptoms</label>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {['Fever', 'Cough', 'Headache', 'Nausea', 'Body Pain', 'Others'].map(symptom => (
            <label key={symptom} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={symptom}
                checked={form.symptoms.includes(symptom)}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm(prev => ({
                    ...prev,
                    symptoms: prev.symptoms.includes(value)
                      ? prev.symptoms.filter(s => s !== value)
                      : [...prev.symptoms, value],
                  }));
                }}
              />
              {symptom}
            </label>
          ))}
        </div>
        {form.symptoms.includes('Others') && (
          <input
            type="text"
            name="otherSymptom"
            placeholder="Please specify"
            value={form.otherSymptom}
            onChange={handleInputChange}
            className="w-full mt-2 border px-3 py-2 rounded"
          />
        )}
      </div>

      {/* Submit */}
      <div className="text-center">
        <button
          type="button"
          onClick={bookAppointment}
          className="bg-primary text-white px-8 py-2 rounded-full"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default Appointment;
