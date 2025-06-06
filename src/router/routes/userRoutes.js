import { lazy } from "react";

const ListCoupon = lazy(() => import("../../pages/user/coupon/ListCoupon"));
const Profile = lazy(() => import("../../pages/user/Profile"));
const Address = lazy(() => import("../../pages/user/address/Address"));
const EditAddress = lazy(() => import("../../pages/user/address/EditAddress"));
const AddAddress = lazy(() => import("../../pages/user/address/AddAddress"));
const OrderUser = lazy(() => import("../../pages/user/OrderUser"));
const OrderCartUser = lazy(() => import("../../pages/user/OrderCartUser"));
const HistoryOrder = lazy(() => import("../../pages/user/HistoryOrder"));
const HistoryChat = lazy(() => import("../../pages/user/chat/HistoryChat"));
const ChangeEmail = lazy(() => import("../../pages/user/ChangeEmail"));
const ChangePassword = lazy(() => import("../../pages/user/ChangePassword"));
const Statistic = lazy(() => import("../../pages/user/Statistic"));

const userRoutes = [
    // Profile
    { path: '/user/profile', element: <Profile />, role: 'ROLE_USER' },
    { path: '/user/edit/email', element: <ChangeEmail />, role: 'ROLE_USER' },
    { path: '/user/edit/password', element: <ChangePassword />, role: 'ROLE_USER' },
    { path: '/user/statistic', element: <Statistic />, role: 'ROLE_USER' },

    // Address Management
    { path: '/user/addresses', element: <Address />, role: 'ROLE_USER' },
    { path: '/user/addresses/new', element: <AddAddress />, role: 'ROLE_USER' },
    { path: '/user/addresses/edit/:id', element: <EditAddress />, role: 'ROLE_USER' },

    // Orders
    { path: '/user/orders', element: <OrderUser />, role: 'ROLE_USER' },
    { path: '/user/orders/cart', element: <OrderCartUser />, role: 'ROLE_USER' },
    { path: '/user/orders/history', element: <HistoryOrder />, role: 'ROLE_USER' },

    // Coupons
    { path: '/user/coupons', element: <ListCoupon />, role: 'ROLE_USER' },

    // Chat
    { path: '/user/chat/history', element: <HistoryChat />, role: 'ROLE_USER' },

];

export default userRoutes;