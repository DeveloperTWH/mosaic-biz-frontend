"use client"

import React, { useEffect, useState } from 'react'
import HeroSection from './components/HeroSection';
import FilterBar from '../services/components/FilterBar';
import TabsHeadingSection from './components/TabsHeadingSection';
import FoodsAndRestaurantsPage from './components/FoodsAndRestaurantsPage';
import SimilarProduct from '../products/[productid]/[id]/Component/SimilarProduct';
import BookServices from './components/BookYourServices';
import { Service } from "@/types/service";
import axios from "axios";
import Image from 'next/image';
import JoinVendorBanner from './components/JoinVendorBanner';

const FoodSection = () => {

  const [searchText, setSearchText] = useState("");
  const [minorityType, setMinorityType] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const [services, setServices] = useState<Service[]>([]);

  const handleSearch = () => {
    console.log({
      searchText,
      minorityType,
      searchLocation,
    });
  }

    const fetchServices = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services/list`, {
        params: {
          search: searchText,
          city: searchLocation,
          minorityType,
          page: 1,
          limit: 10,
        },
      });
      setServices(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(()=>{
    fetchServices()
  },[])
  return (
    <div>
      <HeroSection heading={"Foods"} imageUrl="/bgdetailpage.png"  />
      {/* <FilterBar
        searchText={searchText}
        setSearchText={setSearchText}
        minorityType={minorityType}
        setMinorityType={setMinorityType}
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        onSearch={handleSearch}
      /> */}
      <FilterSection/>
      <div className='bg-[#C7A04024] h-[300px] flex justify-around'>
              <div className='justify-center flex flex-col'>
                  <div className="relative w-44 h-44 mx-auto rounded-full overflow-hidden border-8 border-white shadow-xl transition-all duration-300">
                                <div className={`relative w-full h-full`}>
                                  <Image
                                    src={"/restorant.png"}
                                    alt={'grocerry'}
                                    fill
                                    className="object-cover"
                                  />
                                  
                                  {/* Hover overlay - Yellow with text */}



                                </div>

                      
                    </div>

                    <p className={`mt-6 self-center font-medium font-poppins`}>
                      Restaurants
                    </p>
              </div>

              <div className='justify-center flex flex-col'>
                  <div className="relative w-44 h-44 mx-auto rounded-full overflow-hidden border-8 border-white shadow-xl transition-all duration-300">
                                <div className={`relative w-full h-full`}>
                                  <Image
                                    src={"/grocerry.png"}
                                    alt={'grocerry'}
                                    fill
                                    className="object-cover"
                                  />
                                  
                                  {/* Hover overlay - Yellow with text */}



                                </div>

                      
                    </div>

                    <p className={`mt-6 self-center font-medium font-poppins`}>
                      Grocery
                    </p>
              </div>

              <div className=' justify-center flex flex-col'>
                  <div className="relative w-44 h-44 mx-auto rounded-full overflow-hidden border-8 border-white shadow-xl transition-all duration-300">
                                <div className={`relative w-full h-full`}>
                                  <Image
                                    src={"/others.png"}
                                    alt={'grocerry'}
                                    fill
                                    className="object-cover"
                                  />
                                  
                                  {/* Hover overlay - Yellow with text */}



                                </div>

                      
                    </div>

                    <p className={`mt-6 self-center font-medium font-poppins`}>
                      Others
                    </p>
              </div>




        

                 
      </div>

      
      <BookServices services={services} />

      <JoinVendorBanner/>
      {/* <FoodsAndRestaurantsPage /> */}
      <div className="max-w-screen-xl px-8 py-10 mx-auto">
        {/* <SimilarProduct /> */}
      </div>
    </div>
  )
}


function FilterSection() {
  return (
    <div className="w-full bg-[#1A1F71] py-6 text-center text-white pb-10">
      <div className="max-w-[1500px]  mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col  md:flex-row md:items-end gap-4 md:gap-6">
        <div className="flex-[3] min-w-0 ">
            <label className="block mb-2 text-sm text-left  font-medium text-white font-poppins">
              Filter By Business Type
            </label>
            <input
              type="text"
              placeholder="Type Here"
              className="w-full h-10 px-4 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-custom-orange text-xs font-poppins"
            />
          </div>

          <div className="flex-[1] min-w-0">
            <label className="block mb-2  text-left  text-sm font-medium text-white font-poppins">
              Filter By Location
            </label>
            <div className="relative">
              <select className="w-full h-10 px-4 text-gray-700 bg-white text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-custom-orange text-[#5F5F5F] font-poppins">
                <option value="">Choose Location</option>
                <option value="ny">New York City</option>
                <option value="gc">Grand Canyon</option>
                <option value="sf"> San Francisco</option>
                <option value="ch">Chicago</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-full h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <label className="block text-left  mb-2 text-sm font-medium text-white font-poppins">
              Filter By Minority
            </label>
            <div className="relative">
              <select className="w-full h-10 px-4 text-gray-700 bg-white  text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-custom-orange text-[#5F5F5F] font-poppins">
                <option value="">Choose Minority</option>
                <option value="women-owned">Women-Owned</option>
                <option value="minority-owned">Minority-Owned</option>
                <option value="veteran-owned">Veteran-Owned</option>
                <option value="lgbtq-owned">LGBTQ+-Owned</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Yellow Search Button */}
          <div className="flex-1 min-w-0">
            <label className="block mb-2 text-sm font-medium text-white">
              {/* Search Here */}
            </label>
            <button className="w-full h-10 text-sm text-white font-xs text-gray-800 bg-[#C7A040]  hover:bg-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-600 flex items-center justify-center gap-2 font-montserrat">
              {/* <Search className="w-5 h-5" /> */}
              Search Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FoodSection;