import { IoMdHome } from "react-icons/io";
import { LuUsers2 } from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";
import { GiMedicines } from "react-icons/gi";
import { IoPricetagOutline } from "react-icons/io5";
import { CiBoxes } from "react-icons/ci";
import { BsCartCheck } from "react-icons/bs"; 
import { PiTrademarkRegisteredLight } from "react-icons/pi";
import { MdOutlineFeedback } from "react-icons/md";
import { CiDeliveryTruck } from "react-icons/ci";
import { RiCoupon2Line } from "react-icons/ri";

export const allNav = [
    {
        id : 1,
        title : 'Dashboard',
        icon : <IoMdHome />,
        role : 'ROLE_ADMIN',
        path: '/admin/dashboard'
    },
    {
        id : 2,
        title : 'Users',
        icon : <LuUsers2 />,
        role : 'ROLE_ADMIN',
        path: '/admin/users'
    },
    {
        id : 3,
        title : 'Categories',
        icon : <MdOutlineCategory />,
        role : 'ROLE_ADMIN',
        path: '/admin/categories'
    },
    {
        id : 4,
        title : 'Products',
        icon : <GiMedicines />,
        role : 'ROLE_ADMIN',
        path: '/admin/products'
    },
    {
        id : 5,
        title : 'Prices',
        icon : <IoPricetagOutline />,
        role : 'ROLE_ADMIN',
        path: '/admin/prices'
    },
    {
        id : 6,
        title : 'Units',
        icon : <CiBoxes />,
        role : 'ROLE_ADMIN',
        path: '/admin/units'
    },
    {
        id : 7,
        title : 'Orders',
        icon : <BsCartCheck />,
        role : 'ROLE_ADMIN',
        path: '/admin/orders'
    },
    {
        id : 8,
        title : 'Companies',
        icon : <PiTrademarkRegisteredLight />,
        role : 'ROLE_ADMIN',
        path: '/admin/companies'
    },
    {
        id : 9,
        title : 'Dashboard',
        icon : <IoMdHome />,
        role : 'ROLE_EMPLOYEE',
        path: '/employee/dashboard'
    },
    {
        id : 10,
        title : 'Products',
        icon : <GiMedicines />,
        role : 'ROLE_EMPLOYEE',
        path: '/admin/products'
    },
    {
        id : 11,
        title : 'Prices',
        icon : <IoPricetagOutline />,
        role : 'ROLE_EMPLOYEE',
        path: '/admin/prices'
    },
    {
        id : 12,
        title : 'Units',
        icon : <CiBoxes />,
        role : 'ROLE_EMPLOYEE',
        path: '/admin/units'
    },
    {
        id : 13,
        title : 'Orders',
        icon : <BsCartCheck />,
        role : 'ROLE_EMPLOYEE',
        path: '/admin/orders'
    },
    {
        id : 14,
        title : 'Orders COD',
        icon : <CiDeliveryTruck />,
        role : 'ROLE_EMPLOYEE',
        path: '/admin/orderCOD'
    },
    {
        id : 15,
        title : 'Feedbacks',
        icon : <MdOutlineFeedback />,
        role : 'ROLE_EMPLOYEE',
        path: '/employee/feedback'
    },
    {
        id : 16,
        title : 'Coupons',
        icon : <RiCoupon2Line />,
        role : 'ROLE_EMPLOYEE',
        path: '/admin/coupon'
    },
    {
        id : 16,
        title : 'Coupons',
        icon : <RiCoupon2Line />,
        role : 'ROLE_ADMIN',
        path: '/admin/coupon'
    },
]