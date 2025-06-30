'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BusinessForm {
  businessName: string;
  description: string;
  email: string;
  phoneNumber: string;
  listingType: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

const initialForm: BusinessForm = {
  businessName: '',
  description: '',
  email: '',
  phoneNumber: '',
  listingType: '',
  address: '',
  city: '',
  state: '',
  country: '',
};

export default function CreateNewBusinessPage() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData(initialForm);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Business registered successfully!');
        handleReset();
      } else {
        setErrorMsg(data.message || 'Something went wrong');
      }
    } catch (err) {
      setErrorMsg('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-white sm:mt-10 md:px-10 lg:px-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Left Image */}
        <div className="relative flex items-start justify-center pt-2 sm:pt-10">
          <div className="absolute top-[-20px] left-[-20px] w-[60%] h-[60%] bg-custom-yellow z-0" />
          <Image
            src="/partners/registration-image.png"
            alt="Business Registration"
            width={500}
            height={500}
            className="relative z-10 rounded-lg shadow"
          />
        </div>

        {/* Form Section */}
        <div>
          <h1 className="mb-4 text-2xl font-semibold uppercase sm:text-3xl md:text-4xl heading">BUSINESS REGISTRATION</h1>
          <hr className="h-[2px] w-[100px] bg-green-900" />
          <hr className="h-[2px] w-[100px] bg-green-900 mt-[1px]" />
          <p className="mt-5 mb-6 text-sm text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae libero venenatis.
          </p>

          {/* Business Info */}
          <div className="space-y-4">
            <div>
              <label htmlFor="businessName" className="block mb-1 text-sm font-medium text-gray-700">Business Name</label>
              <input id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Business Name" className="w-full px-4 py-2 border rounded" required />
            </div>
            <div>
              <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">Description</label>
              <textarea id='description' name="description" value={formData.description} onChange={handleChange} placeholder="Enter Business Description" className="w-full px-4 py-2 border rounded" rows={3} required />
            </div>
          </div>

          {/* Contact Info */}
          <h2 className="mt-6 font-semibold">CONTACT DETAILS</h2>
          <div className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-2">
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full px-4 py-2 border rounded" type="email" required />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
              <input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="w-full px-4 py-2 border rounded" required />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="listingType" className="block mb-1 text-sm font-medium text-gray-700">Listing Type</label>
            <select id="listingType" name="listingType" value={formData.listingType} onChange={handleChange} className="w-full px-4 py-2 border rounded" required>
              <option value="">-- Select Listing Type --</option>
              <option value="products">Products</option>
              <option value="services">Services</option>
              <option value="foods">Foods</option>
            </select>
          </div>

          {/* Address Info */}
          <div className="mt-4">
            <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-700">Street Address</label>
            <input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" className="w-full px-4 py-2 border rounded" required />
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
            <div>
              <label htmlFor="city" className="block mb-1 text-sm font-medium text-gray-700">City</label>
              <select id="city" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border rounded">
                <option value="">-- Choose City --</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>
            <div>
              <label htmlFor="state" className="block mb-1 text-sm font-medium text-gray-700">State</label>
              <select id="state" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-2 border rounded">
                <option value="">-- Choose State --</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>
            <div>
              <label htmlFor="country" className="block mb-1 text-sm font-medium text-gray-700">Country</label>
              <select id="country" name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-2 border rounded">
                <option value="">-- Choose Country --</option>
                <option value="India">India</option>
                <option value="UAE">UAE</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 font-medium text-white bg-orange-600 rounded hover:bg-orange-700"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
            <button onClick={handleReset} className="px-6 py-2 text-gray-700 border border-gray-500 rounded">
              Reset
            </button>
          </div>

          {/* Feedback */}
          {successMsg && <p className="mt-4 text-green-600">{successMsg}</p>}
          {errorMsg && <p className="mt-4 text-red-600">{errorMsg}</p>}
        </div>
      </div>
    </div>
  );
}
