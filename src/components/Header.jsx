import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { FaBell, FaCartShopping } from "react-icons/fa6";
import { PiLineVertical } from "react-icons/pi";
import Login from "../pages/auth/Login";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/Reducers/authReducer';
import { MdLogout } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCategoryNull } from '../store/Reducers/categoryReducer';
import { getCartGuest, getCartUser } from '../store/Reducers/cartReducer';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const products = useSelector((state) => state.product.allProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      dispatch(getCartUser());
    } else {
      dispatch(getCartGuest());
    }
  }, [dispatch]);

  const cartCount = cartItems.length;
  // localStorage.removeItem('token');
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false)
  const isLoggedIn = !!localStorage.getItem('token');
  const [showMenu, setShowMenu] = useState(false);


  const { message } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.category);

  const handleLogout = () => {
    setShowMenu(false)
    dispatch(logout());
    navigate('/');
  };

  const handleCategoryClick = (categoryId, categoryName) => {
    navigate(`/productList/${categoryId}`, {
        state: { categoryName },
    });
  };

  useEffect(() => {
    console.log("Products:", products);
    console.log("Search Query:", searchQuery);
  
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
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/productDetail/${productId}`);
  };

  useEffect(() => {
    dispatch(getCategoryNull());
    // if (message) {
    //   toast.success('Đăng xuất thành công')
    // }
  },[dispatch, message])

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
                  placeholder="Tìm kiếm..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <button onClick={handleSearch} className="p-2">
                  <FaSearch />
                </button>
              </div>

              {/* Hiển thị kết quả tìm kiếm */}
              {filteredProducts.length > 0 && (
                <div className="absolute top-12 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50 max-w-[695px]">
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
              <button className='ml-10 '>
                <FaBell className='h-6 w-6'/>
              </button> 

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
                      <img className='w-[30px] h-[30px] rounded-full overflow-hidden' src="http://localhost:3000/images/avata_1.jpg" alt="" />
                      <span className='ml-2 text-sm font-medium'>Kim Hồng</span>
                      {/* <button onClick={handleLogout}>Đăng xuất</button> */}
                    </button>
                  </div>
                  {showMenu && (
                  <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" 
                  role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                  <div className="py-1" role="none">
                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-200" role="menuitem" tabIndex="-1" id="menu-item-0">Thông tin cá nhân</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-200" role="menuitem" tabIndex="-1" id="menu-item-1">Lịch sử đơn hàng</a>
                    <a onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-200 flex items-center justify-between" 
                    role="menuitem" tabIndex="-1" id="menu-item-2">Đăng xuất <MdLogout className='text-rose-700'/></a>
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
          <div className='mt-[79px] flex items-center justify-center'>
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