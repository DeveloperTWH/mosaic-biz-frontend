"use client"
import PublicPageHero from "../Components/PublicPageHero";
import VendorFilters from "./components/VendorFilters";
import VendorGrid from "./components/VendorGrid";




import { useState } from "react";
import PricingBar from "@/app/(admin)/admin/components/PriceBar";

export default function VendorsPage() {
const [form, setForm] = useState({});


    const update = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    // return(
    //   <PricingBar/>
    // )

  //   return (
  //   <div className="min-h-screen bg-[#F8F9FA] py-10 px-4 font-body text-[#333]">
  //     <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-md border border-gray-200 overflow-hidden">
        
  //       {/* Header Branding */}
  //       {/* <div className="p-6 border-b border-gray-100">
  //         <h1 className="text-xl font-bold font-heading text-blue-900 tracking-tight">OSAIC BIZ HUB</h1>
  //         <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Where Culture and Commerce Connect</p>
  //       </div> */}

  //       <form className="p-8 md:p-12 space-y-10">
  //         {/* <h2 className="text-center text-lg font-bold font-heading text-gray-700 uppercase tracking-widest mb-10">
  //           Vendor Registration Request
  //         </h2> */}

  //         {/* Business Name Section */}
  //         <div className="space-y-6">
  //           <div className="group">
  //             <label className="block text-sm font-bold font-heading mb-2">Business Name</label>
  //             <input type="text" placeholder="Enter Your Business Name" className="w-full text-[14px] border border-gray-300 p-2 rounded-md focus:border-blue-500 outline-none transition-all" />
  //           </div>

  //           {/* Minority Status */}
  //           <div className="flex gap-5">
  //             <span className="block text-sm font-bold font-heading">Minority Owned Business</span>
  //             <div className="flex gap-8">
  //               <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
  //                 <input type="radio" name="minority" className="w-4 h-4 accent-blue-900" /> Yes
  //               </label>
  //               <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
  //                 <input type="radio" name="minority" className="w-4 h-4 accent-blue-900" /> No
  //               </label>
  //             </div>
  //           </div>

  //           {/* Minority Categories */}
  //           <div className="space-y-4">
  //             <span className="block text-sm font-bold font-heading">Minority Owner Category (Tick Boxes For Multiple Selection)</span>
  //             <div className="grid grid-cols-2 md:grid-cols-5 gap-y-4">
  //               {['African-American', 'Asian', 'Latinx', 'Woman', 'Disabled Veteran'].map((item) => (
  //                 <label key={item} className="flex items-center gap-2 text-xs font-semibold text-gray-600">
  //                   <input type="checkbox" className="w-4 h-4 rounded border-gray-300" /> {item}
  //                 </label>
  //               ))}
  //             </div>
  //             <div className="flex items-center gap-2 mt-2">
  //               <input type="checkbox" className="w-4 h-4" /> <p className="text-xs font-semibold text-gray-600">Other (Please Specify)</p>
  //               {/* <input type="text" placeholder="Other (Please Specify)" className="flex-1 border-b border-gray-300 text-sm py-1 focus:border-blue-900 outline-none" /> */}
  //             </div>
  //                 <input type="text" placeholder="Mention your Minority Category" className="w-full border  text-[14px] border-gray-300 p-2 rounded-md focus:border-blue-500 outline-none transition-all" />

  //           </div>

  //           {/* Upload Stakes */}
  //           <div className="space-y-2">
  //             <label className="block text-sm font-bold font-heading">Upload Supporting Documents Proving Majority Stakes In The Name Of The Minority Founder (Optional)</label>
  //             <div className="flex gap-5">
  //               <input type="text" readOnly placeholder="No File Chosen" className="flex-1 text-[13px] border rounded-md border-gray-300 p-2 bg-gray-50" />
  //               <button type="button" className="bg-[#D1D5DB] px-6 text-xs rounded-md font-bold uppercase tracking-wider">+ Upload File</button>
  //             </div>
  //           </div>
  //         </div>

  //         <hr className="border-gray-100" />

  //         {/* EIN & License Section */}
  //         {/* <div className="grid md:grid-cols-2 gap-10"> */}
  //           <div className="space-y-6">
  //             <div className="flex gap-5">
  //               <span className="block text-sm font-bold font-heading">Do You Have An Employee Identification Number (EIN)</span>
  //               <div className="flex gap-6">
  //                 <label className="flex items-center gap-2 text-sm"><input type="radio" name="ein" className="accent-blue-900" /> Yes</label>
  //                 <label className="flex items-center gap-2 text-sm"><input type="radio" name="ein" className="accent-blue-900" /> No</label>
  //               </div>
  //             </div>
  //             <div className="flex gap-5">
  //                 <div>
  //                   <label className="block text-sm font-bold font-heading mb-2">Employee Identification Number (EIN)</label>
  //                   <input type="text" placeholder="9 Digit Number" className="w-[480px] text-[14px] border border-gray-300 p-2 rounded-md focus:border-blue-500 outline-none transition-all" />
  //                 </div>

  //                 <div className="">
  //                   <label className="block text-sm font-bold  rounded-md font-heading mb-2">Upload Supporting Documents (Optional)</label>
  //                   <div className="flex gap-2">
  //                     <input type="text" readOnly className="w-[65%] text-[14px] border border-gray-300 p-2 rounded-md focus:border-blue-500 outline-none transition-all" />
  //                     <button type="button" className="bg-[#D1D5DB] px-6 text-xs rounded-md font-bold uppercase tracking-wider">+ Upload File</button>
  //                   </div>
  //                 </div>
  //               </div>
  //           </div>

  //           <hr className="border-gray-100" />


  //           <div className="space-y-6">
  //             <div className="flex gap-5">
  //               <span className="block text-sm font-bold font-heading">Do You Have Current Business License</span>
  //               <div className="flex gap-6">
  //                 <label className="flex items-center gap-2 text-sm"><input type="radio" name="license" className="accent-blue-900" /> Yes</label>
  //                 <label className="flex items-center gap-2 text-sm"><input type="radio" name="license" className="accent-blue-900" /> No</label>
  //               </div>
  //             </div>
  //               <div className="">
  //                 <label className="block text-sm font-bold  rounded-md font-heading mb-2">Upload Supporting Documents (Optional)</label>
  //                 <div className="flex gap-2">
  //                   <input type="text" readOnly className="w-[30%] text-[14px] border border-gray-300 p-2 rounded-md focus:border-blue-500 outline-none transition-all" />
  //                   <button type="button" className="bg-[#D1D5DB] px-6 text-xs rounded-md font-bold uppercase tracking-wider">+ Upload File</button>
  //                 </div>
  //               </div>
  //           </div>
  //         {/* </div> */}


  //           <hr className="border-gray-100" />

  //         {/* Additional Details */}
  //         <div className="grid md:grid-cols-2 gap-6">
  //           <div>
  //             <label className="block text-sm font-bold font-heading mb-2">Business Ownership Type</label>
  //             <select className="w-full border border-gray-300 p-3 text-sm text-gray-500 appearance-none bg-white">
  //               <option>-- Choose Your Minority Type --</option>
  //             </select>
  //           </div>
  //           <div>
  //             <label className="block text-sm font-bold font-heading mb-2">Years In Business</label>
  //             <select className="w-full border border-gray-300 p-3 text-sm text-gray-500 appearance-none bg-white">
  //               <option>-- Choose Your Business Tenure --</option>
  //             </select>
  //           </div>

  //           <div>
  //             <div className="flex gap-5">
  //               <span className="block text-sm font-bold font-heading">Is Your Business a Franchise ?</span>
  //               <div className="flex gap-6">
  //                 <label className="flex items-center gap-2 text-sm"><input type="radio" name="license" className="accent-blue-900" /> Yes</label>
  //                 <label className="flex items-center gap-2 text-sm"><input type="radio" name="license" className="accent-blue-900" /> No</label>
  //               </div>
  //             </div>

  //             <div className="mt-5">
  //               <label className="block text-sm font-bold font-heading mb-2">Franchise Name</label>
  //               <input type="text" placeholder="9 Digit Number" className="w-[480px] text-[14px] border border-gray-300 p-2 rounded-md focus:border-blue-500 outline-none transition-all" />
  //             </div>

  //           </div>

  //         </div>

  //         <hr className="border-gray-100" />


  //         <div className="flex flex-row">
  //           <div>
  //               <label className="block text-sm font-bold font-heading mb-2">Type of Busines</label>
  //               <select className="w-full border border-gray-300 p-3 text-sm text-gray-500 appearance-none bg-white">
  //                 <option>-- Choose Your Business Types --</option>
  //               </select>
  //           </div>

  //             <div className="flex ml-10">
  //               <p className="block text-sm font-bold font-heading">Is Your Business a Franchise ?</p>
  //               <div className="flex gap-6 mr-[10px]">
  //                 <label className="flex items-center gap-2 text-sm"><input type="radio" name="license" className="accent-blue-900" /> Yes</label>
  //                 <label className="flex items-center gap-2 text-sm"><input type="radio" name="license" className="accent-blue-900" /> No</label>
  //               </div>
  //             </div>

              

  //         </div>

  //         <div className="space-y-6">
  //           <div className="group">
  //             <label className="block text-sm font-bold font-heading mb-2">Business Website URL</label>
  //             <input type="text"  className="w-full text-[14px] border border-gray-300 p-2 rounded-md focus:border-blue-500 outline-none transition-all" />
  //           </div>
  //         </div>


  //         {}



  //         {/* Contact Information */}
  //         <div className="grid md:grid-cols-2 gap-6">
  //           <input type="text" placeholder="Primary Contact Name" className="border border-gray-300 p-3 text-sm" />
  //           <select className="border border-gray-300 p-3 text-sm text-gray-500"><option>-- Choose Your Designation --</option></select>
  //           <input type="email" placeholder="Contact Email Address" className="border border-gray-300 p-3 text-sm" />
  //           <input type="email" placeholder="Business Email Address" className="border border-gray-300 p-3 text-sm" />
  //           <input type="tel" placeholder="Primary Contact Phone Number" className="border border-gray-300 p-3 text-sm" />
  //         </div>

  //         {/* Address Section */}
  //         <div className="space-y-4">
  //           <input type="text" placeholder="Full Address" className="w-full border border-gray-300 p-3 text-sm" />
  //           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  //             <input type="text" placeholder="City" className="border border-gray-300 p-3 text-sm" />
  //             <input type="text" placeholder="State" className="border border-gray-300 p-3 text-sm" />
  //             <input type="text" placeholder="Country" className="border border-gray-300 p-3 text-sm" />
  //             <input type="text" placeholder="Zip Code" className="border border-gray-300 p-3 text-sm" />
  //           </div>
  //         </div>

  //         {/* Employee Count */}
  //         <div className="space-y-4">
  //           <span className="block text-sm font-bold font-heading">Number Of Employees</span>
  //           <div className="flex flex-wrap gap-8">
  //             {['0-1', '2-5', '6-10', '10+'].map((range) => (
  //               <label key={range} className="flex items-center gap-2 text-sm font-medium">
  //                 <input type="checkbox" className="w-4 h-4" /> {range}
  //               </label>
  //             ))}
  //           </div>
  //         </div>

  //         {/* Terms and Actions */}
  //         <div className="space-y-3 pt-6 border-t border-gray-100">
  //           <label className="flex items-start gap-3 text-xs font-medium text-gray-600">
  //             <input type="checkbox" className="mt-0.5" />
  //             I Agree To The Terms & Conditions (Pop Up, Check-Off, Provide Initials) [cite: 75]
  //           </label>
  //           <label className="flex items-start gap-3 text-xs font-medium text-gray-600">
  //             <input type="checkbox" className="mt-0.5" />
  //             The Information Provided Above Is Accurate To My Knowledge [cite: 76]
  //           </label>
  //         </div>

  //         <div className="flex gap-4 pt-6">
  //           <button className="bg-[#B8860B] hover:bg-[#9A6F09] text-white font-bold py-4 px-10 rounded-md transition-all font-heading text-sm uppercase shadow-md">
  //             Proceed To Payment 
  //           </button>
  //           <button className="bg-[#9CA3AF] hover:bg-[#6B7280] text-white font-bold py-4 px-10 rounded-md transition-all font-heading text-sm uppercase">
  //             Clear Response [cite: 78]
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  // );
  return (
    <div className="min-h-screen">
      
        <PublicPageHero
          title="Our Vendors"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Vendors" },
          ]}
          imageUrl="/about/about_banner.png"
        />
      <div className="container-page market-content-safe-bottom py-10">
        <VendorGrid />
      </div>
    </div>
  );
}
