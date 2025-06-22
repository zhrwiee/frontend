import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';
import { BellIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const { token, setToken, userData, backendUrl } = useContext(AppContext);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/login');
  };

  const requireLogin = (callback) => {
    if (!token) {
      navigate('/login');
    } else {
      callback();
    }
  };

  const fetchNotifications = async () => {
    try {
      if (token) {
        const [appointmentsRes, healthRes] = await Promise.all([
          axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } }),
          axios.get(`${backendUrl}/api/user/health-records`, { headers: { token } })
        ]);

        const appointments = appointmentsRes.data.success
          ? appointmentsRes.data.appointments.filter(item => !item.cancelled).map(item => ({
              _id: item._id,
              type: 'appointment',
              read: item.read,
              title: item.departmentname,
              subtitle: `${item.slotDate.replace(/_/g, '/')} | ${item.slotTime}`
            }))
          : [];

        const healthRecords = healthRes.data.success
          ? healthRes.data.records
              .filter(item => !item.read)
              .slice(0, 5)
              .map(item => ({
                _id: item._id,
                type: 'health-record',
                read: item.read,
                title: 'New Health Record Added',
                subtitle: new Date(item.date).toLocaleDateString()
              }))
          : [];

        setNotifications([...appointments.slice(0, 3), ...healthRecords.slice(0, 2)]);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const handleOpenNotifications = async () => {
    const unreadItems = notifications.filter(n => !n.read).map(n => ({ _id: n._id, type: n.type }));

    if (unreadItems.length > 0) {
      await axios.post(`${backendUrl}/api/user/mark-as-read`, { items: unreadItems }, {
        headers: { token }
      });
    }

    setShowNotifications(!showNotifications);
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD] relative'>
      <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="Logo" />

<ul className='md:flex items-start gap-5 font-medium hidden'>
  <NavLink
    to='/'
    className={({ isActive }) =>
      `py-1 ${isActive ? 'border-b-2 border-blue-600' : 'hover:border-b-2 hover:border-blue-300'}`
    }
  >
    <li>HOME</li>
  </NavLink>

  <NavLink
    to='/department'
    className={({ isActive }) =>
      `py-1 ${isActive ? 'border-b-2 border-blue-600' : 'hover:border-b-2 hover:border-blue-300'}`
    }
    onClick={(e) => {
      e.preventDefault();
      requireLogin(() => navigate('/department'));
    }}
  >
    <li>BOOK APPOINTMENT</li>
  </NavLink>

  <NavLink
    to='/add-health-record'
    className={({ isActive }) =>
      `py-1 ${isActive ? 'border-b-2 border-blue-600' : 'hover:border-b-2 hover:border-blue-300'}`
    }
    onClick={(e) => {
      e.preventDefault();
      requireLogin(() => navigate('/add-health-record'));
    }}
  >
    <li>ADD HEALTH RECORDS</li>
  </NavLink>

  <NavLink
    to='/health-record'
    className={({ isActive }) =>
      `py-1 ${isActive ? 'border-b-2 border-blue-600' : 'hover:border-b-2 hover:border-blue-300'}`
    }
    onClick={(e) => {
      e.preventDefault();
      requireLogin(() => navigate('/health-record'));
    }}
  >
    <li>HEALTH RECORDS</li>
  </NavLink>
</ul>


      <div className='flex items-center gap-4'>
        {token && userData ? (
          <>
            {/* Notification Bell */}
            <div className='relative'>
              <BellIcon
                className='w-6 h-6 text-gray-700 cursor-pointer'
                onClick={handleOpenNotifications}
              />
              {notifications.some(n => !n.read) && (
                <span className='absolute top-0 right-0 bg-blue-500 w-2 h-2 rounded-full'></span>
              )}
              {showNotifications && (
                <div className='absolute right-0 top-8 bg-white border rounded shadow-md w-64 z-50 text-sm'>
                  <div className='p-2 font-semibold border-b'>My Notifications</div>
                  {notifications.length > 0 ? (
                    notifications.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-2 hover:bg-gray-100 cursor-pointer border-b ${!item.read ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          navigate(item.type === 'appointment' ? '/my-appointments' : '/health-record');
                          setShowNotifications(false);
                        }}
                      >
                        <p className='text-gray-700'>{item.title}</p>
                        <p className='text-xs text-gray-500'>{item.subtitle}</p>
                        {!item.read && <span className='text-xs text-blue-500'>New</span>}
                      </div>
                    ))
                  ) : (
                    <p className='p-2 text-gray-500'>No recent notifications</p>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-8 rounded-full' src={userData.image} alt="User" />
              <img className='w-2.5' src={assets.dropdown_icon} alt="Dropdown" />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                  <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>
            Create account
          </button>
        )}

        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="Menu" />

        {/* ---- Mobile Menu ---- */}
        <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img src={assets.logo} className='w-36' alt="Logo" />
            <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="Close" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/department'><p className='px-4 py-2'>BOOK</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
