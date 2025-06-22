import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../Context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const HealthRecord = () => {
  const { token, backendUrl } = useContext(AppContext);
  const [records, setRecords] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchRecords = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/health-records`, {
        headers: { token },
      });
      if (data.success) {
        setRecords(data.records.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch health records');
    }
  };

  const deleteRecord = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/user/health-record/${id}`, {
        headers: { token },
      });
      if (data.success) {
        toast.success('Record deleted');
        fetchRecords();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting record');
    }
  };

  useEffect(() => {
    if (token) {
      fetchRecords();
    }
  }, [token]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">My Health Track Records</h2>
      {records.length === 0 ? (
        <p className="text-gray-500 text-sm">No health records found.</p>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record._id}
              className="border p-4 rounded shadow-sm flex justify-between items-start"
            >
              <div className="text-sm">
                <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
                {record.weight && <p><strong>Weight:</strong> {record.weight} kg</p>}
                {record.height && <p><strong>Height:</strong> {record.height} cm</p>}
                {record.bloodPressure && <p><strong>Blood Pressure:</strong> {record.bloodPressure}</p>}
                {record.heartRate && <p><strong>Heart Rate:</strong> {record.heartRate} bpm</p>}
                {record.diagnosis && <p><strong>Diagnosis:</strong> {record.diagnosis}</p>}
                {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
              </div>
              <button
                onClick={() => setConfirmDeleteId(record._id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="text-sm mb-4">Are you sure you want to delete this health record?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => deleteRecord(confirmDeleteId)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="bg-gray-300 text-gray-800 px-4 py-1 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthRecord;
