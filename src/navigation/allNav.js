import { IoMdHome } from "react-icons/io";
import { LuUsers2 } from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";
import { GiMedicines } from "react-icons/gi";
import { IoPricetagOutline } from "react-icons/io5";
import { CiBoxes } from "react-icons/ci";
import { BsCartCheck } from "react-icons/bs"; 
import { PiTrademarkRegisteredLight } from "react-icons/pi";

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
        path: '/admin/users'
    },
    {
        id : 4,
        title : 'Products',
        icon : <GiMedicines />,
        role : 'ROLE_ADMIN',
        path: '/admin/users'
    },
    {
        id : 5,
        title : 'Prices',
        icon : <IoPricetagOutline />,
        role : 'ROLE_ADMIN',
        path: '/admin/users'
    },
    {
        id : 6,
        title : 'Units',
        icon : <CiBoxes />,
        role : 'ROLE_ADMIN',
        path: '/admin/users'
    },
    {
        id : 7,
        title : 'Orders',
        icon : <BsCartCheck />,
        role : 'ROLE_ADMIN',
        path: '/admin/users'
    },
    {
        id : 8,
        title : 'Company',
        icon : <PiTrademarkRegisteredLight />,
        role : 'ROLE_ADMIN',
        path: '/admin/users'
    },
]