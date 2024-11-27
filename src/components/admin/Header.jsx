import React, { useState } from 'react';
import { FaList } from 'react-icons/fa';

const Header = ({ showSidebar, setShowSidebar }) => {

  const userInfo = {
    name: "Kim Hong",
    role: "admin",
    image: "http://localhost:3000/images/avata_1.jpg"
  };

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="fixed top-0 left-0 w-full z-40">
      <div className="ml-0 lg:ml-[260px] h-[65px] flex justify-between items-center bg-[#41c5e5] px-5 transition-all">

        {/* Sidebar Toggle Button */}
        <div
          onClick={() => setShowSidebar(!showSidebar)}
          className="w-[35px] flex lg:hidden h-[35px] rounded-sm bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 justify-center items-center cursor-pointer"
        >
          <span>
            <FaList />
          </span>
        </div>

        {/* Search Bar */}
        <div className="hidden md:block">
          <input
            className="px-3 py-2 outline-none border bg-transparent border-slate-700 rounded-md text-[#423d72] focus:border-indigo-300 overflow-hidden"
            type="text"
            name="search"
            placeholder="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* User Info */}
        <div className="flex justify-center items-center gap-8 relative">
          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center gap-3">
              <div className="flex justify-center items-center flex-col text-end">
                <h2 className="text-md font-bold">{userInfo.name}</h2>
                <span className="text-[14px] w-full font-normal">{userInfo.role}</span>
              </div>

              {/* User Avatar */}
              {userInfo.role === "admin" ? (
                <img
                  className="w-[45px] h-[45px] rounded-full overflow-hidden"
                  src="http://localhost:3000/images/avata_1.jpg"
                  alt="Admin Avatar"
                />
              ) : (
                <img
                  className="w-[45px] h-[45px] rounded-full overflow-hidden"
                  src={userInfo.image}
                  alt="User Avatar"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
