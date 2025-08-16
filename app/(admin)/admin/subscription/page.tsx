"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import Sidebar from "../components/Sidebar"; // Import Sidebar component
import Topbar from "../components/Topbar"; // Import Topbar component

const OrdersPage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();


    if (loading) {
        return <div>Loading...</div>; // Display a loading message while businesses are being fetched
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Component */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Topbar Component */}
                <Topbar setIsSidebarOpen={setSidebarOpen} />

                <main className="flex-1 px-8 py-6 overflow-y-auto">
                    {/* Stats Section */}
                    
                </main>
            </div>
        </div>
    );
};

export default OrdersPage;
