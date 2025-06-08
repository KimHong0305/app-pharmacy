import { lazy } from "react";

const Chat = lazy(() => import("../../pages/nurse/Chat"));
const OrderShop = lazy(() => import("../../pages/nurse/OrderShop"));
const ProfileNurse = lazy(() => import("../../pages/nurse/ProfileNurse"));

export const nurseRoutes = [

    { path: 'nurse/chat', element: <Chat />, role: 'ROLE_NURSE' },

    { path: 'nurse/order', element: <OrderShop />, role: 'ROLE_NURSE' },

    { path: 'nurse/profile', element: <ProfileNurse />, role: 'ROLE_NURSE' },
];

export default nurseRoutes;