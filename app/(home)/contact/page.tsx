'use client';

import React, { useState } from 'react';
import HeroSection from './components/HeroSection';
import { Mail, MapPinned, PhoneCall, Facebook, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { submitContactInquiry, ContactInquiryData } from '@/lib/api/contact';
import { toast } from 'react-toastify';
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";

export default function ContactUsPage() {
    const [formData, setFormData] = useState<ContactInquiryData>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNo: '',
        subject: '',
        howCanWeHelp: ''
    });
    const [loading, setLoading] = useState(false);
   const recaptchaRef = useRef<ReCAPTCHA | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = recaptchaRef.current?.getValue();

if (!token) {
  alert("Please verify that you are not a robot.");
  return;
}
            await submitContactInquiry(formData);
            toast.success('Thank you for contacting us! We will get back to you soon.');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phoneNo: '',
                subject: '',
                howCanWeHelp: ''
            });
        } catch (error: any) {
            console.error('Contact form error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit your inquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <HeroSection heading="Connect With Us" imageUrl="/contact/contact_banner.png" />

            {/* Contact Form & Newsletter */}
            <div className="grid w-full grid-cols-1 gap-8 p-6 mx-auto lg:grid-cols-2 lg:p-12 max-w-7xl">
                {/* Contact Form */}
                <div className='p-4 sm:p-6 md:p-8 lg:p-10'>
                    <h2 className="mb-3 text-3xl font-poppins sm:text-4xl">CONNECT WITH US</h2>
                    <hr className="h-[2px] w-[100px] bg-green-900" />
                    <hr className="h-[2px] w-[100px] bg-green-900 mt-[1px] mb-4" />
                    <p className="mb-6 text-sm text-[#5F5F5F] font-montserrat">
                        Reach out to Mosaic Biz Hub anytime. We’re here to support your journey, answer your questions, and help your business thrive in the digital world.
                    </p>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex flex-col">
                            <label htmlFor="firstName" className="text-sm">First Name</label>
                            <input 
                                id="firstName" 
                                name="firstName"
                                type="text" 
                                placeholder="Enter First Name" 
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="input border-[1px] text-sm p-2 text-[#5F5F5F] font-montserrat" 
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="lastName" className="text-sm">Last Name</label>
                            <input 
                                id="lastName" 
                                name="lastName"
                                type="text" 
                                placeholder="Enter Last Name" 
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="input border-[1px] text-sm p-2 text-[#5F5F5F] font-montserrat" 
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-sm">Email</label>
                            <input 
                                id="email" 
                                name="email"
                                type="email" 
                                placeholder="Enter Email" 
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="input border-[1px] text-sm p-2 text-[#5F5F5F] font-montserrat" 
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="phoneNo" className="text-sm">Phone Number</label>
                            <input 
                                id="phoneNo" 
                                name="phoneNo"
                                type="tel" 
                                placeholder="Enter Phone Number" 
                                value={formData.phoneNo}
                                onChange={handleChange}
                                required
                                className="input border-[1px] text-sm p-2 text-[#5F5F5F] font-montserrat" 
                            />
                        </div>

                        <div className="flex flex-col md:col-span-2">
                            <label htmlFor="subject" className="text-sm">Subject</label>
                            <input 
                                id="subject" 
                                name="subject"
                                type="text" 
                                placeholder="Enter Subject" 
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="input border-[1px] text-sm p-2 text-[#5F5F5F] font-montserrat" 
                            />
                        </div>

                        <div className="flex flex-col md:col-span-2">
                            <label htmlFor="howCanWeHelp" className="text-sm">How Can We Help You?</label>
                            <textarea 
                                id="howCanWeHelp" 
                                name="howCanWeHelp"
                                placeholder="Enter Message" 
                                value={formData.howCanWeHelp}
                                onChange={handleChange}
                                required
                                className="input h-28 border-[1px] text-sm p-2 text-[#5F5F5F] font-montserrat" 
                            />
                        </div>
                        <div className="md:col-span-2">
  <ReCAPTCHA
    sitekey="6LcA_nMsAAAAANFObRTZO__HF5YR4wCW3zxV3KuR"
    ref={recaptchaRef}
  />
</div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-20 py-2 text-white bg-[#C7A040] md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>


                {/* Newsletter */}
                <div className="relative mt-10 min-h-[500px] w-[600px]">
                    {/* <div
                        className="absolute inset-0 z-0 bg-center bg-cover"
                        style={{ backgroundImage: "url('/contact/contactRight.png')" }}
                    > */}
                        {/* <div className="absolute inset-0 bg-gray-700 opacity-90" /> */}
                    {/* </div> */}
                    <Image
                    src={"/contact/contactRight.png"}
                    alt={"contact"}
                    height={800}
                    width={700}
                    />
                    

                    {/* <div className="relative z-10 flex flex-col justify-center h-full p-6 text-white sm:p-10">
                        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">SUBSCRIBE NEWSLETTER</h2>
                        <hr className="h-[2px] w-[100px] bg-white" />
                        <hr className="h-[2px] w-[100px] bg-white mt-[1px] mb-5" />
                        <p className="mb-6 text-sm">
                            Stay connected with Mosaic Biz Hub by subscribing to our newsletter. Receive the latest news, exclusive promotions, and inspiring stories from minority-owned businesses thriving in today’s digital landscape. Whether you’re a business owner or a supporter, our updates will keep you informed and motivated to help our community grow stronger every day. Don’t miss out on tips, events, and opportunities designed to empower and uplift.
                        </p>

                        <label htmlFor="Name" className="block mb-1">Name</label>
                        <input
                            id="Name"
                            type="text"
                            placeholder="Enter Name"
                            className="w-full p-2 mb-4 text-white placeholder-white bg-transparent border border-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />

                        <label htmlFor="email" className="block mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter Email"
                            className="w-full p-2 mb-4 text-white placeholder-white bg-transparent border border-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />

                        <button className="w-full px-6 py-2 text-white transition bg-custom-orange hover:bg-orange-700">
                            Subscribe Now
                        </button>
                    </div> */}
                </div>
            </div>

            {/* Contact Info Cards */}
            <div className="grid w-full grid-cols-1 gap-6 px-4 mx-auto mb-8 sm:grid-cols-2 md:grid-cols-3 md:px-8 max-w-7xl">
                <div className="px-10 py-8 text-white bg-gradient-blue">
                    <PhoneCall size={40} className='mb-10' />
                    <h3 className="mb-2 text-lg font-bold">CALL US:</h3>
                    <hr className="h-[2px] w-[50px] bg-white" />
                    <hr className="h-[2px] w-[50px] bg-white mt-[1px] mb-5" />
                    <p>+1 202.810.9450 </p>
                    <p>For Vendors: 888.845.4210</p>
                </div>

                <div className="px-10 py-8 text-white bg-gradient-skyblue">
                    <Mail size={40} className='mb-10' />
                    <h3 className="mb-2 text-lg font-bold">EMAIL US:</h3>
                    <hr className="h-[2px] w-[50px] bg-white" />
                    <hr className="h-[2px] w-[50px] bg-white mt-[1px] mb-5" />
                    <p>info@mosaicbizhub.com
</p>
                </div>

                <div className="px-10 py-8 text-white bg-gradient-yellow">
                    <Image
                        src="/contact/Untitled design.png"
                        alt="Socialize with us"
                        width={40}
                        height={40}
                        className="mb-10 object-contain"
                    />
                    <h3 className="mb-2 text-lg font-bold">SOCIALIZE WITH US:</h3>
                    <hr className="h-[2px] w-[50px] bg-white" />
                    <hr className="h-[2px] w-[50px] bg-white mt-[1px] mb-5" />
                    <div className="flex gap-4">
                        <a href="#" className="hover:opacity-80 transition-opacity">
                            <Facebook size={24} />
                        </a>
                        <a href="#" className="hover:opacity-80 transition-opacity">
                            <Instagram size={24} />
                        </a>
                        <a href="#" className="hover:opacity-80 transition-opacity">
                            <Linkedin size={24} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Call To Action Section */}
            <div
                className="relative w-full my-10 bg-center bg-cover "
                style={{ backgroundImage: "url('/contact/becomeVendor.png')" }}
            >
                {/* Black overlay */}
                <div className="bg-[#3333339E] p-6 sm:p-12 md:p-32 w-full">
                    <div className="flex flex-col items-center justify-center px-4 text-center text-white">
                        <h2 className="mb-2 text-3xl font-bold sm:text-3xl heading" style={{color:"white"}}>EXPAND YOUR REACH -</h2>
                        <h2 className="mb-4 text-3xl font-bold sm:text-3xl heading" style={{color:"white"}}>LIST YOUR BUSINESS ON OUR PLATFORM!</h2>

                        <hr className="h-[2px] w-[150px] bg-white" />
                        <hr className="h-[2px] w-[150px] bg-white mt-[1px] mb-5" />

                        <p className="max-w-3xl mb-6 text-sm sm:text-base">
                            Take your business to new heights by listing it on Mosaic Biz Hub. Connect with customers who value minority-owned brands, showcase your unique products and services, and grow your presence in the digital marketplace. Join a community dedicated to supporting your success every step of the way.
                        </p>

                        <Link href={"/become-a-vendor"} className="px-5 py-2 mt-5 mb-5 font-semibold text-white transition bg-transparent border border-white hover:bg-white hover:text-black">
                            Become A Vendor
                        </Link>
                    </div>
                </div>
                {/* <div className="absolute inset-0 bg-[#3333339E] z-20 pointer-events-none" /> */}

            </div>



            {/* Map Section */}
            {/* <div className="relative px-4 py-10 my-8 sm:px-8">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">FIND US ON MAP</h2>
                    <hr className="h-[2px] w-[100px] bg-green-900 mx-auto" />
                    <hr className="h-[2px] w-[100px] bg-green-900 mt-[1px] mx-auto" />
                </div>
                
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.478198356483!2d-79.38429378450022!3d43.648409279121854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34d9c2e4fd33%3A0x60aef9634974e0c0!2sUnion%20Station!5e0!3m2!1sen!2sca!4v1632940851879!5m2!1sen!2sca"
                    width="100%"
                    height="400"
                    allowFullScreen={false}
                    loading="lazy"
                    className="w-full max-w-5xl mx-auto border rounded-lg shadow-lg"
                ></iframe>
            </div> */}

            {/* Newsletter Section */}
            {/* <div className="flex justify-center bg-[#FFF6E0] h-[400px]">
                <div className='flex mt-8 h-[80%]'>
                    <Image
                        src={"/contact/subscribe.png"}
                        height={250}
                        width={250}
                        alt='subscribe image'
                    />
                </div>

                <div className='flex flex-col w-[50%] ml-[20%] justify-center gap-5'>
                    <h2 className='text-3xl font-bold'>SUBSCRIBE NEWSLETTER</h2>
                    <hr className="h-[2px] w-[100px] bg-green-900" />
                    <hr className="h-[2px] w-[100px] bg-green-900 mt-[1px] mb-4" />
                    <p className='text-sm w-[80%]'>Stay connected with Mosaic Biz Hub by subscribing to our newsletter. Receive the latest news, exclusive promotions, and inspiring stories from minority-owned businesses.</p>
        
                    <div className="flex flex-col">
                        <label htmlFor="newsletterEmail" className="text-sm mb-2">Email Address</label>
                        <div className='flex flex-row gap-2'>
                            <input 
                                id="newsletterEmail" 
                                type="email" 
                                placeholder="Enter Email" 
                                className="w-[400px] border-[1px] text-sm p-2 text-[#5F5F5F] font-montserrat rounded" 
                            />
                            <button
                                type="button"
                                className="px-8 py-2 text-white bg-[#C7A040] hover:bg-[#B8943A] transition-colors rounded"
                            >
                                Subscribe Now
                            </button>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
}

// Tailwind input class shortcut
const input = `bg-gray-900 border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-orange-500`;
