import React, { useState, useEffect } from 'react';
import { FaList } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getEmployeeInfo } from '../../store/Reducers/userReducer';

const Header = ({ showSidebar, setShowSidebar }) => {

  const { role } = useSelector((state) => state.auth); 
  const [searchTerm, setSearchTerm] = useState("");
  const { bio } = useSelector((state) => state.user);   

  const username = localStorage.getItem('username');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEmployeeInfo());
  }, [dispatch]);

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
                <h2 className="text-md font-bold">{username}</h2>
                <span className="text-[14px] w-full font-normal">{role}</span>
              </div>

              {/* User Avatar */}
              {role === 'ROLE_EMPLOYEE' || role === 'ROLE_NURSE' ? (
                <img
                  className="w-[45px] h-[45px] rounded-full overflow-hidden"
                  src={bio?.image || '/images/avata_1.png'}
                  alt="Admin Avatar"
                />
              ) : (
                <img
                  className="w-[45px] h-[45px] rounded-full overflow-hidden"
                  src={'/images/avata_1.png'}
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
