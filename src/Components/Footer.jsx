import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>

<div>
  <img className='mb-5 w-40' src={assets.logo} alt="Pusat Kesihatan UNIMAS Logo" />
  <p className='w-full md:w-2/3 text-gray-600 leading-6'>
    Selamat datang ke <strong>Pusat Kesihatan UNIMAS</strong>. Sila isikan maklumat yang diperlukan untuk menempah temujanji kesihatan anda. Kami komited untuk memberikan perkhidmatan kesihatan yang terbaik kepada semua warga kampus.
  </p>
</div>


        {/* <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div> */}

        {/* <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+1-212-456-7890</li>
            <li>greatstackdev@gmail.com</li>
          </ul>
        </div> */}

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025 @ HPAP.com - All Right Reserved.</p>
      </div>

    </div>
  )
}

export default Footer
