import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../Context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors  = () => {

  const [department, setDepartment] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const handleNext = (e) => {
    e.preventDefault()
    if (!department || !date || !time) {
      toast.error('Please fill in all fields')
      return
    }

    // Pass values to the parent or navigate to next page
    if (onNext) {
      onNext({ department, date, time })
    } else {
      toast.success('Ready to check availability')
    }
  }

  return (
    <form onSubmit={handleNext} className="p-6 max-w-md mx-auto bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">Choose Department and Time</h2>

      <div className="mb-4">
        <label className="block mb-1">Select Department</label>
        <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full border px-3 py-2 rounded" required>
          <option value="">-- Choose Department --</option>
          <option value="General physician">General Physician</option>
          <option value="Dermatologist">Dermatologist</option>
          <option value="Gynecologist">Gynecologist</option>
          <option value="Pediatricians">Pediatricians</option>
          <option value="Neurologist">Neurologist</option>
          <option value="Gastroenterologist">Gastroenterologist</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Select Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border px-3 py-2 rounded" required />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Select Time</label>
        <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full border px-3 py-2 rounded" required />
      </div>

      <button type="submit" className="bg-primary text-white px-6 py-2 rounded-full">Next</button>
    </form>
  )
}

export default Doctors