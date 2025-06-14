import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BiLogOutCircle } from 'react-icons/bi';
import logo from '../../assets/logo.png';
import { getNav } from '../../navigation/index';
import { logout } from '../../store/Reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useWebSocket } from '../../contexts/WebSocketContext';

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const { role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [allNav, setAllNav] = useState([]);
  const { disconnect, clearMessages } = useWebSocket();

  useEffect(() => {
    const navs = getNav(role);
    setAllNav(navs);
  }, [role]);

  const handleLogout = async () => {
    clearMessages();
    disconnect();
    await dispatch(logout());
    navigate('/');
  };

  const isActive = (nav) =>
    nav.activePaths ? nav.activePaths.includes(pathname) : pathname === nav.path;

  return (
    <div>
      <div
        onClick={() => setShowSidebar(false)}
        className={`fixed duration-200 ${
          !showSidebar ? 'invisible' : 'visible'
        } w-screen h-screen bg-black/20 top-0 left-0 z-10 lg:hidden`}
      ></div>

      <div
        className={`w-[260px] fixed bg-[#daf3f9] z-50 top-0 h-screen shadow-md transition-all duration-300 ${
          showSidebar ? 'left-0' : '-left-[260px] lg:left-0'
        }`}
      >
        <div className="h-[80px] flex justify-center items-center border-b border-gray-300">
          <Link to="/" className="w-[180px] h-[70px]">
            <img className="w-full h-full object-contain" src={logo} alt="Logo" />
          </Link>
        </div>

        <div className="px-2 h-[calc(100vh-140px)]">
          {allNav.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-2">
              <p className="uppercase text-[12px] text-gray-600 font-medium mb-2 px-1">
                {group.group}
              </p>
              <ul>
                {group.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      to={item.path}
                      className={`${
                        isActive(item)
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'text-gray-800 hover:bg-sky-100'
                      } px-3 py-3 rounded-md flex items-center gap-3 transition-all duration-200 font-medium`}
                    >
                      <span className="text-[18px]">{item.icon}</span>
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div className="px-4 py-3 border-t border-gray-300">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-gray-800 hover:bg-red-100 px-3 py-2 rounded-md transition-all duration-200 font-medium"
          >
            <BiLogOutCircle className="text-[18px]" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
