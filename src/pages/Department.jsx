import React, { useContext, useState } from 'react';
import { AppContext } from '../Context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Department = () => {
  const { departments } = useContext(AppContext);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDepartment) {
      toast.error('Please select a department');
      return;
    }

    const selectedDept = departments.find(d => d.departmentname === selectedDepartment);
    if (!selectedDept) {
      toast.error('Invalid department selection');
      return;
    }

    // Navigate to /appointment page and optionally pass selected department
    navigate('/appointment', {
      state: {
        department: selectedDept.departmentname,
        icon: selectedDept.image,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">Choose Department</h2>

      {/* Department Selection */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Department</label>
        <div className="flex flex-wrap gap-4">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className={`border rounded-lg p-3 w-36 text-center cursor-pointer transition-all ${
                selectedDepartment === dept.departmentname ? 'border-blue-500 shadow-lg' : 'border-gray-300'
              }`}
              onClick={() => setSelectedDepartment(dept.departmentname)}
            >
              <img
                src={dept.image}
                alt={dept.departmentname}
                className="w-16 h-16 object-contain mx-auto mb-2"
              />
              <p className="text-sm">{dept.departmentname}</p>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="bg-primary text-white px-6 py-2 rounded-full w-full mt-4">
        Next
      </button>
    </form>
  );
};

export default Department;
