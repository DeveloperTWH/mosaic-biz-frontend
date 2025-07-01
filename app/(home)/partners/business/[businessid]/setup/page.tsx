'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function BankDetailsPage() {
  const { businessid } = useParams();
  const [formData, setFormData] = useState({
    accountNumber: '',
    ifscCode: '',
    branchName: '',
    registeredMobile: '',
    location: '',
    city: '',
    state: '',
    country: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log('Submitting for business:', businessid);
    console.log(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-10 bg-white sm:px-6 md:px-10 lg:px-20">
      <div className="w-full max-w-4xl">
        <h1 className="mb-2 text-2xl font-bold uppercase heading">Bank Details</h1>
        <hr className="h-[2px] w-[100px] bg-stone-900" />
        <hr className="h-[2px] w-[100px] bg-stone-900 mt-[1px]" />
        <p className="max-w-xl mt-2 mb-6 text-gray-600">
          Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit. Praesent Vitae
          Libero Venenatis, Tristique Justo.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <input
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="Account Number"
            className="px-4 py-2 border rounded"
          />
          <input
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            placeholder="IFSC Code"
            className="px-4 py-2 border rounded"
          />
          <input
            name="branchName"
            value={formData.branchName}
            onChange={handleChange}
            placeholder="Branch Name"
            className="px-4 py-2 border rounded"
          />
          <input
            name="registeredMobile"
            value={formData.registeredMobile}
            onChange={handleChange}
            placeholder="Registered Mobile Number"
            className="px-4 py-2 border rounded"
          />
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="px-4 py-2 border rounded"
          />
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="px-4 py-2 border rounded"
          >
            <option value="">--Choose City--</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="px-4 py-2 border rounded"
          >
            <option value="">--Choose State--</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Telangana">Telangana</option>
          </select>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="px-4 py-2 border rounded"
          >
            <option value="">--Choose Country--</option>
            <option value="India">India</option>
          </select>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-white bg-orange-600 rounded hover:bg-orange-700"
          >
            Submit Registration
          </button>
          <button
            onClick={() => setFormData({
              accountNumber: '', ifscCode: '', branchName: '', registeredMobile: '',
              location: '', city: '', state: '', country: ''
            })}
            className="px-6 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
