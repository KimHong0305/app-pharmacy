import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BiLogOutCircle } from "react-icons/bi";
import logo from '../../assets/logo.png';
import { getNav } from '../../navigation/index';
import { logout } from '../../store/Reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';

const Sidebar = ({ showSidebar, setShowSidebar }) => {

  const { role } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const {pathname} = useLocation()
  const [allNav,setAllNav] = useState([])

  useEffect(() => {
    const navs = getNav(role)
    setAllNav(navs)
  },[role])

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div>
      <div
        onClick={() => setShowSidebar(false)}
        className={`fixed duration-200 ${
          !showSidebar ? "invisible" : "visible"
        } w-screen h-screen bg-[#daf3f9] top-0 left-0 z-10`}
      ></div>

      {/* Sidebar */}
      <div
        className={`w-[260px] fixed bg-[#daf3f9] z-50 top-0 h-screen shadow-[0_0_15px_0_rgb(34_41_47_/_5%)] transition-all ${
          showSidebar ? "left-0" : "-left-[260px] lg:left-0"
        }`}
      >
        {/* Logo */}
        <div className="h-[80px] flex justify-center items-center">
          <Link to="/admin/dashboard" className="w-[180px] h-[70px]">
            <img className="w-full h-full" src={logo} alt="Logo" />
          </Link>
        </div>

        {/* Navigation */}
        <div className="px-[16px]">
          <ul>
            {allNav.map((n, i) => (
              <li key={i}>
                <Link
                  to={n.path}
                  className={`${
                    pathname === n.path
                      ? "bg-[#84ccde] shadow-indigo-500/50 text-white font-semibold duration-500"
                      : "text-[#030811] font-semibold duration-200"
                  } px-[12px] py-[9px] rounded-sm flex justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1`}
                >
                  <span>{n.icon}</span>
                  <span>{n.title}</span>
                </Link>
              </li>
            ))}
            </ul>

            {/* Logout Button */}
            <div className=''>
              <button
                onClick={() => handleLogout()}
                className="text-[#030811] font-semibold duration-200 px-[12px] py-[9px] rounded-sm flex justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1"
              >
                <span>
                  <BiLogOutCircle />
                </span>
                <span>Logout</span>
              </button>
            </div>
          
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
