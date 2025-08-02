"use client";

import React, { useEffect, useState } from "react";
import { Bell, Globe, Search, Menu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Use to redirect on logout

const Topbar = ({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [gender, setGender] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    setIsLoggedIn(session === "true");

    const userGender = localStorage.getItem("user_gender");
    setGender(userGender);

    const name = localStorage.getItem("user_name");
    setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    localStorage.removeItem("user_gender");
    localStorage.removeItem("user_name");
    setIsLoggedIn(false);
    router.push("/login"); // Redirect to login page
  };

  return (
    <header className="flex items-center justify-between w-full px-6 py-4 bg-white shadow-md">
      <div className="flex items-center gap-4">
        {/* Hamburger for Mobile */}
        <button
          className="p-2 bg-gray-100 rounded md:hidden"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        <h2 className="text-lg font-semibold">Welcome{userName ? `, ${userName}` : "!"}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search here ..."
            className="py-1 pl-10 pr-4 text-sm border rounded-full focus:outline-none"
          />
          <Search className="absolute left-3 top-1.5 w-4 h-4 text-gray-400" />
        </div>

        {/* Language and Country */}
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-gray-500" />
          <span className="hidden text-sm sm:block">English</span>
        </div>

        {/* Notifications */}
        <button className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="relative">
          <Image
            src={gender === "female" ? "/female-avatar.png" : "/male-avatar.png"}
            width={40}
            height={40}
            alt="Profile"
            className="border border-gray-300 rounded-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
