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
import { GrUserManager } from "react-icons/gr";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { CiShoppingBasket } from "react-icons/ci";

export const allNav = [
    {
        id: 1,
        title: 'Dashboard',
        icon: <IoMdHome />,
        role: 'ROLE_ADMIN',
        path: '/admin/dashboard'
    },
    {
        id: 2,
        title: 'Accounts',
        icon: <LuUsers2 />,
        role: 'ROLE_ADMIN',
        path: '/admin/users',
    },
    {
        id: 3,
        title: 'Staff',
        icon: <GrUserManager />,
        role: 'ROLE_ADMIN',
        path: '/admin/employees',
    },
    {
        id: 4,
        title: 'Categories',
        icon: <MdOutlineCategory />,
        role: 'ROLE_ADMIN',
        path: '/admin/categories'
    },
    {
        id: 5,
        title: 'Products',
        icon: <GiMedicines />,
        role: 'ROLE_ADMIN',
        path: '/admin/products'
    },
    {
        id: 6,
        title: 'Prices',
        icon: <IoPricetagOutline />,
        role: 'ROLE_ADMIN',
        path: '/admin/prices'
    },
    {
        id: 7,
        title: 'Units',
        icon: <CiBoxes />,
        role: 'ROLE_ADMIN',
        path: '/admin/units'
    },
    {
        id: 8,
        title: 'Orders',
        icon: <BsCartCheck />,
        role: 'ROLE_ADMIN',
        path: '/admin/orders'
    },
    {
        id: 9,
        title: 'Companies',
        icon: <PiTrademarkRegisteredLight />,
        role: 'ROLE_ADMIN',
        path: '/admin/companies'
    },
    {
        id: 10,
        title: 'Dashboard',
        icon: <IoMdHome />,
        role: 'ROLE_EMPLOYEE',
        path: '/employee/dashboard'
    },
    {
        id: 11,
        title: 'Products',
        icon: <GiMedicines />,
        role: 'ROLE_EMPLOYEE',
        path: '/employee/products'
    },
    {
        id: 12,
        title: 'Prices',
        icon: <IoPricetagOutline />,
        role: 'ROLE_EMPLOYEE',
        path: '/employee/prices'
    },
    {
        id: 13,
        title: 'Units',
        icon: <CiBoxes />,
        role: 'ROLE_EMPLOYEE',
        path: '/employee/units'
    },
    {
        id: 14,
        title: 'Orders',
        icon: <BsCartCheck />,
        role: 'ROLE_EMPLOYEE',
        path: '/employee/orders'
    },
    {
        id: 15,
        title: 'Orders COD',
        icon: <CiDeliveryTruck />,
        role: 'ROLE_EMPLOYEE',
        path: '/employee/orders/cod'
    },
    {
        id: 16,
        title: 'Feedbacks',
        icon: <MdOutlineFeedback />,
        role: 'ROLE_EMPLOYEE',
        path: '/employee/feedback'
    },
    {
        id: 17,
        title: 'Coupons',
        icon: <RiCoupon2Line />,
        role: 'ROLE_EMPLOYEE',
        path: '/employee/coupons'
    },
    {
        id: 18,
        title: 'Coupons',
        icon: <RiCoupon2Line />,
        role: 'ROLE_ADMIN',
        path: '/admin/coupons'
    },
    {
        id: 19,
        title: 'Order',
        icon: <CiShoppingBasket />,
        role: 'ROLE_NURSE',
        path: '/nurse/order'
    },
    
    {
        id: 20,
        title: 'Chat',
        icon: <IoChatboxEllipsesOutline />,
        role: 'ROLE_NURSE',
        path: '/nurse/chat'
    },
];
