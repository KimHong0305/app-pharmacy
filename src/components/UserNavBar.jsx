import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import MembershipCard from "./MembershipCard";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { IoLocationOutline } from "react-icons/io5";
import { PiNewspaperClippingLight } from "react-icons/pi";
import { HiOutlineTicket } from "react-icons/hi2";

const UserNavBar = ({ bio, handleProfile, handleAddress, handleCoupon, handleHistory }) => {
    const { username, point, image } = bio;
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? "text-sky-600 bg-sky-100 font-medium" : "text-gray-700 font-medium hover:text-sky-600";

    return (
        <div className='w-full bg-white rounded-lg shadow-xl flex flex-col p-5'>
            <div className='flex items-center justify-start ml-2'>
                <img className='w-[80px] h-[80px] rounded-full border-2 overflow-hidden' 
                    src={image || "http://localhost:3000/images/avata_khach.jpg"} 
                    alt="Avatar" 
                />
                <div className='ml-4 flex flex-col items-start'>
                    <p className='text-lg font-normal'>{username}</p>
                </div>
            </div>
            <div className='mt-5 flex items-center justify-center'>
                <MembershipCard point={point} />
            </div>
            <div className="my-4 flex-grow border-t border-gray-300"></div>
            <div className="flex flex-col items-start justify-start space-y-4">
                <button 
                    className={`block w-full h-10 flex items-center space-x-2 text-left ${isActive('/user/profile')}`}
                    onClick={handleProfile}
                >
                    <HiOutlineUserCircle className="text-xl ml-2"/>
                    <span>Thông tin cá nhân</span>
                </button>

                <button 
                    className={`block w-full h-10 flex items-center space-x-2 text-left ${isActive('/user/addresses')}`}
                    onClick={handleAddress}
                >
                    <IoLocationOutline className="text-xl ml-2"/>
                    <span>Địa chỉ nhận hàng</span>
                </button>

                <button 
                    className={`block w-full h-10 flex items-center space-x-2 text-left ${isActive('/user/coupons')}`}
                    onClick={handleCoupon}
                >
                    <HiOutlineTicket className="text-xl ml-2"/>
                    <span>Mã giảm giá</span>
                </button>

                <button 
                    className={`block w-full h-10 flex items-center space-x-2 text-left ${isActive('/user/orders/history')}`}
                    onClick={handleHistory}
                >
                    <PiNewspaperClippingLight className="text-xl ml-2"/>
                    <span>Lịch sử mua hàng</span>
                </button>

            </div>
        </div>
    );
};

UserNavBar.propTypes = {
    bio: PropTypes.shape({
        username: PropTypes.string,
        point: PropTypes.number,
        image: PropTypes.string,
    }).isRequired,
    handleProfile: PropTypes.func.isRequired,
    handleAddress: PropTypes.func.isRequired,
    handleCoupon: PropTypes.func.isRequired,
    handleHistory: PropTypes.func.isRequired,
};

export default UserNavBar;
