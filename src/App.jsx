import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Department from './pages/Department';
import Appointment from './pages/Appointment';
import MyAppointments from './pages/MyAppointments';
import MyProfile from './pages/Myprofile';
import HealthRecord from './pages/HealthRecord';
import AddHealthRecord from './pages/AddHealthRecord';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Verify from './pages/Verify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/department' element={<Department />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/appointment' element={<Appointment />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/health-record' element={<HealthRecord />} />
        <Route path='/add-health-record' element={<AddHealthRecord />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/verify' element={<Verify />} />
        {/* If dynamic doctor routing is needed later: */}
        {/* <Route path='/doctors/:speciality' element={<Doctors />} /> */}
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
