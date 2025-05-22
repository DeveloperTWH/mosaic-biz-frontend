import React from 'react';
import HeroSection from '../services/components/HeroSection';
import { Mail, MapPinned, PhoneCall } from 'lucide-react';

export default function ContactUsPage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <HeroSection />

            {/* Contact Form & Newsletter */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-12 max-w-7xl mx-auto w-full">
                {/* Contact Form */}
                <div className='p-4 sm:p-6 md:p-8 lg:p-10'>
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-3 heading">CONNECT WITH US</h2>
                    <hr className="h-[2px] w-[100px] bg-green-900" />
                    <hr className="h-[2px] w-[100px] bg-green-900 mt-[1px] mb-4" />
                    <p className="mb-6 text-gray-600 text-sm sm:text-base">
                        Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Praesent Vitae Libero Venenatis, Tristique Justo.
                    </p>

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="FirstName" className="">First Name</label>
                            <input id="FirstName" type="text" placeholder="Enter First Name" className="input" />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="LastName" className="">Last Name</label>
                            <input id="LastName" type="text" placeholder="Enter Last Name" className="input" />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="Email" className="">Email</label>
                            <input id="Email" type="email" placeholder="Enter Email" className="input" />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="Phone" className="">Phone Number</label>
                            <input id="Phone" type="tel" placeholder="Enter Phone Number" className="input" />
                        </div>

                        <div className="flex flex-col md:col-span-2">
                            <label htmlFor="Subject" className="">Subject</label>
                            <input id="Subject" type="text" placeholder="Enter Subject" className="input" />
                        </div>

                        <div className="flex flex-col md:col-span-2">
                            <label htmlFor="Message" className="">How Can We Help You?</label>
                            <textarea id="Message" placeholder="Enter Message" className="input h-28" />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="bg-custom-orange text-white py-2 px-20 w-full md:w-auto"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>


                {/* Newsletter */}
                <div className="relative min-h-[600px]">
                    <div
                        className="absolute inset-0 bg-cover bg-center z-0"
                        style={{ backgroundImage: "url('/about/about 1.png')" }}
                    >
                        <div className="absolute inset-0 bg-gray-700 opacity-90" />
                    </div>

                    <div className="relative z-10 text-white p-6 sm:p-10 h-full flex flex-col justify-center">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4">SUBSCRIBE NEWSLETTER</h2>
                        <hr className="h-[2px] w-[100px] bg-white" />
                        <hr className="h-[2px] w-[100px] bg-white mt-[1px] mb-5" />
                        <p className="text-sm mb-6">
                            Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Nullam Laoreet, Diam Sit Amet Porta Eleifend, Turpis Justo Maximus Eros, Rhoncus Ullamcorper Mi Tortor Et Libero. Maecenas Lacinia Lorem Ultrices Ligula Mollis Accumsan Dictum Ut Eros. Ut Varius A Nunc Vel Vestibulum. Cras Dignissim Consequat Sapien Et Viverra. Mauris A Ipsum Id Urna Interdum Pretium.
                        </p>

                        <label htmlFor="Name" className="block mb-1">Name</label>
                        <input
                            id="Name"
                            type="text"
                            placeholder="Enter Name"
                            className="mb-4 w-full bg-transparent border border-white text-white placeholder-white p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />

                        <label htmlFor="email" className="block mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter Email"
                            className="mb-4 w-full bg-transparent border border-white text-white placeholder-white p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />

                        <button className="bg-custom-orange hover:bg-orange-700 transition text-white py-2 px-6 w-full">
                            Subscribe Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 md:px-8 mb-8 max-w-7xl mx-auto w-full">
                <div className="bg-gradient-blue text-white px-10 py-8">
                    <PhoneCall size={40} className='mb-10' />
                    <h3 className="font-bold text-lg mb-2">CALL US:</h3>
                    <hr className="h-[2px] w-[50px] bg-white" />
                    <hr className="h-[2px] w-[50px] bg-white mt-[1px] mb-5" />
                    <p>+1 234 56 7890</p>
                    <p>For Vendors: +9876 54 3201</p>
                </div>

                <div className="bg-gradient-orange text-white px-10 py-8">
                    <Mail size={40} className='mb-10' />
                    <h3 className="font-bold text-lg mb-2">EMAIL US:</h3>
                    <hr className="h-[2px] w-[50px] bg-white" />
                    <hr className="h-[2px] w-[50px] bg-white mt-[1px] mb-5" />
                    <p>Mosaicbizhub@gmail.com</p>
                </div>

                <div className="bg-gradient-yellow text-white px-10 py-8">
                    <MapPinned size={40} className='mb-10' />
                    <h3 className="text-lg mb-2">LOCATE US:</h3>
                    <hr className="h-[2px] w-[50px] bg-white" />
                    <hr className="h-[2px] w-[50px] bg-white mt-[1px] mb-5" />
                    <p>Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit.</p>
                </div>
            </div>

            {/* Call To Action Section */}
            <div
                className="relative w-full bg-cover bg-center my-10 "
                style={{ backgroundImage: "url('/contact/becomeVendor.png')" }}
            >
                {/* Black overlay */}
                <div className="bg-[#3333339E] p-6 sm:p-12 md:p-32 w-full">
                    <div className="flex flex-col items-center justify-center text-white text-center px-4">
                        <h2 className="text-3xl sm:text-3xl font-bold mb-2 heading" style={{color:"white"}}>EXPAND YOUR REACH -</h2>
                        <h2 className="text-3xl sm:text-3xl font-bold mb-4 heading" style={{color:"white"}}>LIST YOUR BUSINESS ON OUR PLATFORM!</h2>

                        <hr className="h-[2px] w-[150px] bg-white" />
                        <hr className="h-[2px] w-[150px] bg-white mt-[1px] mb-5" />

                        <p className="mb-6 max-w-3xl text-sm sm:text-base">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas maxime iure quidem vel optio sequi,
                            suscipit recusandae eum pariatur reprehenderit veritatis laboriosam dolorem a libero culpa quisquam
                            quae. Fuga, nihil.
                        </p>

                        <button className="bg-transparent text-white border border-white mt-5 mb-5 py-2 px-5 font-semibold hover:bg-white hover:text-black transition">
                            Become A Vendor
                        </button>
                    </div>
                </div>
                {/* <div className="absolute inset-0 bg-[#3333339E] z-20 pointer-events-none" /> */}

            </div>


            {/* Map Section */}
            <div className="relative my-8 py-10 px-4 sm:px-8">
                <div className="absolute bottom-[-10%] left-[0%] w-[50%] h-[80%] bg-custom-blue -z-10" />

                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.478198356483!2d-79.38429378450022!3d43.648409279121854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34d9c2e4fd33%3A0x60aef9634974e0c0!2sUnion%20Station!5e0!3m2!1sen!2sca!4v1632940851879!5m2!1sen!2sca"
                    width="100%"
                    height="400"
                    allowFullScreen={false}
                    loading="lazy"
                    className=" mx-auto w-full max-w-5xl border"
                ></iframe>
            </div>
        </div>
    );
}

// Tailwind input class shortcut
const input = `bg-gray-900 border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-orange-500`;
