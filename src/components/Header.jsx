import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { FaBell, FaCartShopping } from "react-icons/fa6";
import { PiLineVertical } from "react-icons/pi";
import Login from "../pages/auth/Login";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/Reducers/authReducer';
import { MdLogout } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
import { getCategoryNull } from '../store/Reducers/categoryReducer';
import { useNavigate } from 'react-router-dom';
import { clearAddress } from '../store/Reducers/addressReducer';
import { getAllProducts } from '../store/Reducers/productReducer';
import { useWebSocket } from '../contexts/WebSocketContext';

const Header = () => {
  
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const products = useSelector((state) => state.product.allProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();

  const cartCount = cartItems.length;
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false)
  const isLoggedIn = !!localStorage.getItem('token');
  const [showMenu, setShowMenu] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { categories } = useSelector((state) => state.category);
  const { bio, token } = useSelector((state) => state.auth);   
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const { clearMessages, disconnect } = useWebSocket();

  useEffect(() => {
    dispatch(getCategoryNull());
    dispatch(getAllProducts(0, 1000));
  },[dispatch])

  useEffect(() => {
    const url = `${process.env.REACT_APP_WS_BASE_URL}/ws-notifications`;
    const socket = new WebSocket(url);
  
    console.log('🟡 Đang cố gắng kết nối tới:', url);
  
    socket.onopen = () => {
      console.log('✅ WebSocket connected');
    };
  
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [...prev, data]);
      console.log('📨 Received:', data);
      setHasNewNotifications(true);
    };    
  
    socket.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };
  
    socket.onclose = (event) => {
      console.log('🔌 WebSocket closed', event);
    };
  
    return () => {
      socket.close();
    };
  }, []);

  const handleLogout = () => {
    setShowMenu(false)
    disconnect();
    dispatch(logout());
    dispatch(clearAddress());
    clearMessages();
    navigate('/');
  };

  const handleCategoryClick = (categoryId, categoryName) => {
    const prevTrail = location.state?.breadcrumbTrail || [];
    const newTrail = [...prevTrail, { id: categoryId, name: categoryName }];

    navigate(`/categories/${categoryId}/products`, {
      state: {
        breadcrumbTrail: newTrail,
      },
    });
  };


  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts([]);
    } else {
      const results = products.filter(
        (product) =>
          product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(results);
    }
  }, [searchQuery, products]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search/products?query=${searchQuery}`);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleSearchFocus = () => {
    setShowSearchResults(true);
  };

  const handleToggleNotifications = () => {
    setShowNotifications((prev) => {
      if (!prev) {
        setHasNewNotifications(false);
      }
      return !prev;
    });
  };  

  return (
    <header className="relative z-50">
      <div className='w-full h-10 bg-[#24a4f2]'>
        <div className='fixed top-0 left-0 right-0 bg-[#24a4f2]'>
          <div className='my-2 flex items-center justify-center'>
            <Link to='/' className="w-[150px] h-[70px]">
                <img className="w-full h-full" src="http://localhost:3000/images/logo_Web.png" alt="Pharmacity Logo"/>
            </Link>

            {/* Thanh search */}
            <div className="flex items-center w-full max-w-[695px] ml-5 relative">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full bg-white">
              <input  
                type="text" 
                placeholder="Tìm kiếm sản phẩm hoặc tra cứu đơn hàng..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={(e) => {
                  if (e.relatedTarget?.classList?.contains('Tra cứu đơn hàng')) {
                    return;
                  }
                  setShowSearchResults(false);
                }}
                
                className="flex-1 p-2 focus:outline-none" 
              />

                <button onClick={handleSearch} className="p-2">
                  <FaSearch />
                </button>
              </div>

              {/* Hiển thị kết quả tìm kiếm */}
              {(filteredProducts.length > 0 || showSearchResults) && (
                <div className="absolute top-12 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50 max-w-[695px]">
                  <div className="p-3">
                    <button
                      className="w-[200px] bg-gray-200 hover:bg-blue-300 font-semibold py-2 px-4 rounded-lg focus:outline-none"
                      onMouseDown={() => navigate('/orders/search')}
                    >
                      Tra cứu đơn hàng
                    </button>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <li key={product.id} className="flex items-center gap-4 p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleProductClick(product.id)}>
                        {/* Hình ảnh sản phẩm */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-md border border-gray-300"
                        />
                        {/* Thông tin sản phẩm */}
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-800">{product.name}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            
            <div className='flex items-center justify-center' >
              <div className="relative ml-10 mt-1">
                <button onClick={handleToggleNotifications}>
                  <FaBell className="h-6 w-6" />
                </button>
                {notifications.length > 0 && hasNewNotifications && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {notifications.length}
                  </span>
                )}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                    <div className="p-3 font-semibold border-b">Thông báo</div>
                    <ul className="max-h-60 overflow-y-auto divide-y divide-gray-200">
                      {notifications.length === 0 ? (
                        <li className="p-3 text-gray-500 text-sm">Không có thông báo mới</li>
                      ) : (
                        <ul>
                        {Array.isArray(notifications) && notifications.length > 0 ? (
                          notifications.map((noti, index) => (
                            <li key={index} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-md transition duration-200 ease-in-out">
                              <img
                                src={noti.image}
                                alt={noti.title}
                                className="w-16 h-16 rounded-full object-cover shadow-md"
                              />
                              <div className="flex-1">
                                <p className="text-lg font-semibold text-gray-900">{noti.title}</p>
                                <p className="text-sm text-gray-600">{noti.content}</p>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="p-3 text-gray-500 text-sm">Không có thông báo mới</li>
                        )}
                      </ul>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="relative ml-5">
                <Link to="/cart">
                  <FaCartShopping className="h-6 w-6" />
                </Link>
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>

              <span ml-3 mr-3>
                <PiLineVertical className='h-6 w-6'/>
              </span>
              
              {isLoggedIn ? (
                // Hiển thị header cho người dùng đã đăng nhập
                <div className="relative inline-block text-left">
                  <div>
                    <button onClick={() => setShowMenu(!showMenu)} type="button" className='h-10 px-3 rounded-lg bg-white text-black flex items-center justify-start' 
                    id="menu-button" aria-expanded="true" aria-haspopup="true">
                      <img className='w-[30px] h-[30px] rounded-full overflow-hidden' src={bio?.image|| "http://localhost:3000/images/avata_khach.jpg"} alt="" />
                      <span className='ml-2 text-sm font-medium'>{bio?.username}</span>
                    </button>
                  </div>
                  {showMenu && (
                  <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" 
                  role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                  <div className="py-1" role="none">
                    <Link to="/user/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-200" role="menuitem" tabIndex="-1" id="menu-item-0">Thông tin cá nhân</Link>
                    <Link to="/user/addresses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-200" role="menuitem" tabIndex="-1" id="menu-item-1">Địa chỉ nhận hàng</Link>
                    <Link to="/user/coupons" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-200" role="menuitem" tabIndex="-1" id="menu-item-2">Mã giảm giá</Link>
                    <Link to="/user/orders/history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-200" role="menuitem" tabIndex="-1" id="menu-item-3">Lịch sử đơn hàng</Link>
                    <a onClick={handleLogout} className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-slate-200 flex items-center justify-between" 
                    role="menuitem" tabIndex="-1" id="menu-item-4">Đăng xuất <MdLogout className='text-rose-700'/></a>
                  </div>
                </div>)}
                </div>
              ) : (
                // Hiển thị header cho khách
                <button onClick={() => setShowLogin(true)} className="h-10 px-6 rounded-lg bg-white text-black">
                  Đăng nhập/ Đăng ký
                </button>
              )}
            </div>
          </div>
        </div>
        <div className='px-4 md:px-8 lg:px-48'>
          <div className='mt-[80px] flex items-center justify-center'>
            {Array.isArray(categories) && categories.length > 0 ? (
                <div className='flex items-center whitespace-nowrap'>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className='pr-10 font-semibold text-blue-950 hover:underline focus:outline-none'
                            onClick={() => handleCategoryClick(category.id, category.name)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            ) : (
                <div>No categories</div>
            )}
          </div>
        </div>
      </div>

      <Login isVisible={showLogin} onClose={() => setShowLogin(false)}/>
    </header>
  );
};

export default Header;