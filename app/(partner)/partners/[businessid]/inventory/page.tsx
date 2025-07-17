"use client";
import React, { useState } from 'react'
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const page = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div className="flex h-screen bg-[#EBEAE2]">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 p-2 space-y-6 overflow-y-auto lg:p-6">
                    
                </main>
            </div>
        </div>
    )
}

export default page