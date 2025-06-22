import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = '$';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [HealthRecords, setHealthRecords] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userData, setUserData] = useState(false);

  // Fetch doctors
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  
  // Check slot availability (reusable function)
  const checkSlotAvailability = async (department, date) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/check-slot`, {
        params: { department, date },
      });
      return data; // { success, unavailable }
    } catch (error) {
      console.error(error);
      toast.error('Failed to check slot availability');
      return { success: false, unavailable: [] };
    }
  };

    // Create a new health record
  const createHealthRecord = async (recordData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/health-record`, recordData, {
        headers: { token }
      });
      if (data.success) {
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      return false;
    }
  };

  // Get user's health records
  const getHealthRecords = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/health-records`, {
        headers: { token }
      });
      if (data.success) {
        return data.records;
      } else {
        toast.error(data.message);
        return [];
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load health records');
      return [];
    }
  };

  // Delete health record by ID
const deleteHealthRecord = async (recordId) => {
  try {
    const { data } = await axios.delete(`${backendUrl}/api/user/health-record/${recordId}`, {
      headers: { token }
    });
    if (data.success) {
      toast.success(data.message);
      return true;
    } else {
      toast.error(data.message);
      return false;
    }
  } catch (error) {
    console.error(error);
    toast.error('Failed to delete record');
    return false;
  }
};

  // Fetch departments
  const getDepartmentsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/departments`);
      if (data.success) {
        setDepartments(data.departments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Fetch user profile
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { token },
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getDoctorsData();
    getDepartmentsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }
  }, [token]);

  const value = {
    doctors,
    getDoctorsData,
    departments,
    checkSlotAvailability,
    getDepartmentsData,
    currencySymbol,
    backendUrl,
    token,
    createHealthRecord,
    getHealthRecords,
    deleteHealthRecord,
        setToken,
    userData,
    setUserData,
    loadUserProfileData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
