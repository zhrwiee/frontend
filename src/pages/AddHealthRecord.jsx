import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../Context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const HealthRecord = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    date: '',
    weight: '',
    height: '',
    bloodPressure: '',
    heartRate: '',
    diagnosis: '',
    notes: ''
  });

  const fetchRecords = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/health-records`, {
        headers: { token }
      });
      if (data.success) {
        setRecords(data.records.reverse());
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load health records');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/health-record`, form, {
        headers: { token }
      });
      if (data.success) {
        toast.success('Record added');
        setForm({
          date: '',
          weight: '',
          height: '',
          bloodPressure: '',
          heartRate: '',
          diagnosis: '',
          notes: ''
        });
        fetchRecords();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to add record');
    }
  };

  const deleteRecord = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/user/health-record/${id}`, {
        headers: { token }
      });
      if (data.success) {
        toast.success('Record deleted');
        fetchRecords();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete');
    }
  };

  useEffect(() => {
    if (token) fetchRecords();
  }, [token]);

  // Disable past date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className='max-w-2xl mx-auto mt-10'>
      <h2 className='text-2xl font-semibold mb-6'>Health Tracker</h2>

      {/* Add Form */}
      <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-4 mb-10 bg-white p-5 rounded shadow'>
        <h3 className='font-medium text-lg'>Add New Record</h3>

        <div>
          <label className='block text-sm font-medium mb-1'>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className='w-full border p-2 rounded'
            min={today}
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            className='w-full border p-2 rounded'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Height (cm)</label>
          <input
            type="number"
            name="height"
            value={form.height}
            onChange={handleChange}
            className='w-full border p-2 rounded'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Blood Pressure (e.g. 120/80)</label>
          <input
            type="text"
            name="bloodPressure"
            value={form.bloodPressure}
            onChange={handleChange}
            className='w-full border p-2 rounded'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Heart Rate (bpm)</label>
          <input
            type="number"
            name="heartRate"
            value={form.heartRate}
            onChange={handleChange}
            className='w-full border p-2 rounded'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Diagnosis</label>
          <input
            type="text"
            name="diagnosis"
            value={form.diagnosis}
            onChange={handleChange}
            className='w-full border p-2 rounded'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Notes</label>
          <textarea
            name="notes"
            rows="3"
            value={form.notes}
            onChange={handleChange}
            className='w-full border p-2 rounded'
          />
        </div>

        <button type="submit" className='bg-primary text-white py-2 px-4 rounded'>
          Add Record
        </button>
      </form>

      {/* Display Records */}
      <div className='space-y-4'>
        {records.length === 0 && <p className='text-gray-500'>No health records found.</p>}
        {records.map((rec) => (
          <div key={rec._id} className='border rounded p-4 shadow-sm flex justify-between items-start'>
            <div className='text-sm'>
              <p><strong>Date:</strong> {new Date(rec.date).toLocaleDateString()}</p>
              {rec.weight && <p><strong>Weight:</strong> {rec.weight} kg</p>}
              {rec.height && <p><strong>Height:</strong> {rec.height} cm</p>}
              {rec.bloodPressure && <p><strong>BP:</strong> {rec.bloodPressure}</p>}
              {rec.heartRate && <p><strong>Heart Rate:</strong> {rec.heartRate} bpm</p>}
              {rec.diagnosis && <p><strong>Diagnosis:</strong> {rec.diagnosis}</p>}
              {rec.notes && <p><strong>Notes:</strong> {rec.notes}</p>}
            </div>
            <button onClick={() => deleteRecord(rec._id)} className='text-red-500 hover:underline text-sm'>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthRecord;
