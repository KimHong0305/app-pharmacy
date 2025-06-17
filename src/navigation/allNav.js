import { IoMdHome } from "react-icons/io";
import { LuUsers2 } from "react-icons/lu";
import { MdOutlineCategory, MdOutlineFeedback, MdOutlineInventory2 } from "react-icons/md";
import { GiMedicines } from "react-icons/gi";
import { IoPricetagOutline, IoChatboxEllipsesOutline } from "react-icons/io5";
import { CiBoxes, CiDeliveryTruck, CiShoppingBasket } from "react-icons/ci";
import { BsCartCheck } from "react-icons/bs";
import { PiTrademarkRegisteredLight } from "react-icons/pi";
import { RiCoupon2Line } from "react-icons/ri";
import { GrUserManager } from "react-icons/gr";

// ------------------ NAV ADMIN ------------------
export const navAdmin = [
    {
    items: [
        {
        id: 1,
        title: "Bảng điều khiển",
        icon: <IoMdHome />,
        path: "/admin/dashboard",
        },
    ],
    },
    {
        group: "Người dùng",
        items: [
        {
            id: 2,
            title: "Tài khoản",
            icon: <LuUsers2 />,
            path: "/admin/users",
        },
        {
            id: 3,
            title: "Nhân viên",
            icon: <GrUserManager />,
            path: "/admin/employees",
        },
        ],
    },
    {
        group: "Sản phẩm",
        items: [
        {
            id: 4,
            title: "Danh mục",
            icon: <MdOutlineCategory />,
            path: "/admin/categories",
        },
        {
            id: 5,
            title: "Sản phẩm",
            icon: <GiMedicines />,
            path: "/admin/products",
        },
        {
            id: 6,
            title: "Giá bán",
            icon: <IoPricetagOutline />,
            path: "/admin/prices",
        },
        {
            id: 7,
            title: "Đơn vị",
            icon: <CiBoxes />,
            path: "/admin/units",
        },
        {
            id: 9,
            title: "Công ty",
            icon: <PiTrademarkRegisteredLight />,
            path: "/admin/companies",
        },
        {
            id: 22,
            title: "Quản lý kho",
            icon: <MdOutlineInventory2 />,
            path: "/admin/inventory",
        },
        {
            id: 18,
            title: "Mã giảm giá",
            icon: <RiCoupon2Line />,
            path: "/admin/coupons",
        },
        {
            id: 8,
            title: "Đơn hàng",
            icon: <BsCartCheck />,
            path: "/admin/orders",
        },
        ],
    },
];

// ------------------ NAV EMPLOYEE ------------------
export const navEmployee = [
    {
        items: [
            {
                id: 10,
                title: "Bảng điều khiển",
                icon: <IoMdHome />,
                path: "/employee/dashboard",
            }
        ],
    },
    {
        group: "Sản phẩm",
        items: [
        {
            id: 11,
            title: "Sản phẩm",
            icon: <GiMedicines />,
            path: "/employee/products",
        },
        {
            id: 12,
            title: "Giá bán",
            icon: <IoPricetagOutline />,
            path: "/employee/prices",
        },
        {
            id: 13,
            title: "Đơn vị",
            icon: <CiBoxes />,
            path: "/employee/units",
        },
        {
            id: 23,
            title: "Quản lý kho",
            icon: <MdOutlineInventory2 />,
            path: "/employee/inventory",
        },
        {
            id: 17,
            title: "Mã giảm giá",
            icon: <RiCoupon2Line />,
            path: "/employee/coupons",
        },
        ],
    },
    {
        group: "Đơn hàng",
        items: [
        {
            id: 14,
            title: "Đơn hàng",
            icon: <BsCartCheck />,
            path: "/employee/orders",
        },
        {
            id: 15,
            title: "Đơn hàng COD",
            icon: <CiDeliveryTruck />,
            path: "/employee/orders/cod",
        },
        {
            id: 16,
            title: "Phản hồi",
            icon: <MdOutlineFeedback />,
            path: "/employee/feedback",
        },
        ],
    },
];

// ------------------ NAV NURSE ------------------
export const navNurse = [
    {
        id: 19,
        title: "Bảng điều khiển",
        icon: <IoMdHome />,
        path: "/nurse/home",
    },
    {
        id: 20,
        title: "Tạo đơn thuốc",
        icon: <CiShoppingBasket />,
        path: "/nurse/order",
    },
    {
        id: 21,
        title: "Chat trực tuyến",
        icon: <IoChatboxEllipsesOutline />,
        path: "/nurse/chat",
    },
];

