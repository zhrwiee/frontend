import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../Context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext);

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();

            formData.append('name', userData.name);
            formData.append('phone', userData.phone);
            formData.append('address', JSON.stringify(userData.address));
            formData.append('gender', userData.gender);
            formData.append('dob', userData.dob);
            formData.append('nationality', userData.nationality || '');
            formData.append('nric', userData.nric || '');

            image && formData.append('image', image);

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, {
                headers: { token }
            });

            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();
                setIsEdit(false);
                setImage(false);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    return userData ? (
        <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>
            {isEdit ? (
                <label htmlFor='image'>
                    <div className='inline-block relative cursor-pointer'>
                        <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
                        <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
                    </div>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                </label>
            ) : (
                <img className='w-36 rounded' src={userData.image} alt="" />
            )}

            {isEdit ? (
                <input className='bg-gray-50 text-3xl font-medium max-w-60' type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
            ) : (
                <p className='font-medium text-3xl text-[#262626] mt-4'>{userData.name}</p>
            )}

            <hr className='bg-[#ADADAD] h-[1px] border-none' />

            <div>
                <p className='text-gray-600 underline mt-3'>CONTACT INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]'>
                    <p className='font-medium'>Email id:</p>
                    <p className='text-blue-500'>{userData.email}</p>

                    <p className='font-medium'>Phone:</p>
                    {isEdit ? (
                        <input className='bg-gray-50 max-w-52' type="text" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
                    ) : (
                        <p className='text-blue-500'>{userData.phone}</p>
                    )}

                    <p className='font-medium'>Address:</p>
                    {isEdit ? (
                        <div className='flex flex-col gap-1'>
                            <input className='bg-gray-50' type="text" placeholder="Line 1" value={userData.address.line1} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} />
                            <input className='bg-gray-50' type="text" placeholder="Line 2" value={userData.address.line2} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} />
                            <input className='bg-gray-50' type="text" placeholder="Postal Code" value={userData.address.postalCode} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, postalCode: e.target.value } }))} />
                            <input className='bg-gray-50' type="text" placeholder="City" value={userData.address.city} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, city: e.target.value } }))} />
                            <input className='bg-gray-50' type="text" placeholder="State" value={userData.address.state} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, state: e.target.value } }))} />
                            <input className='bg-gray-50' type="text" placeholder="Country" value={userData.address.country} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, country: e.target.value } }))} />
                        </div>
                    ) : (
                        <div className='text-gray-500'>
                            <p>{userData.address.line1}</p>
                            <p>{userData.address.line2}</p>
                            <p>{userData.address.postalCode}, {userData.address.city}</p>
                            <p>{userData.address.state}, {userData.address.country}</p>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <p className='text-[#797979] underline mt-3'>BASIC INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>

                    <p className='font-medium'>Gender:</p>
                    {isEdit ? (
                        <select className='max-w-20 bg-gray-50' value={userData.gender} onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}>
                            <option value="Not Selected">Not Selected</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    ) : (
                        <p className='text-gray-500'>{userData.gender}</p>
                    )}

                    <p className='font-medium'>Birthday:</p>
                    {isEdit ? (
                        <input className='max-w-28 bg-gray-50' type="date" value={userData.dob} onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} />
                    ) : (
                        <p className='text-gray-500'>{userData.dob}</p>
                    )}

                    <p className='font-medium'>Nationality:</p>
                    {isEdit ? (
                        <input className='bg-gray-50' type="text" value={userData.nationality || ''} onChange={(e) => setUserData(prev => ({ ...prev, nationality: e.target.value }))} />
                    ) : (
                        <p className='text-gray-500'>{userData.nationality}</p>
                    )}

                    <p className='font-medium'>NRIC / Passport:</p>
                    {isEdit ? (
                        <input className='bg-gray-50' type="text" value={userData.nric || ''} onChange={(e) => setUserData(prev => ({ ...prev, nric: e.target.value }))} />
                    ) : (
                        <p className='text-gray-500'>{userData.nric}</p>
                    )}

                </div>
            </div>

            <div className='mt-10'>
                {isEdit ? (
                    <button onClick={updateUserProfileData} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>
                        Save information
                    </button>
                ) : (
                    <button onClick={() => setIsEdit(true)} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>
                        Edit
                    </button>
                )}
            </div>
        </div>
    ) : null;
};

export default MyProfile;
