import { lazy } from "react";

const Profile = lazy(() => import("../../pages/user/Profile"));
const Address = lazy(() => import("../../pages/user/address/Address"));
const EditAddress = lazy(() => import("../../pages/user/address/EditAddress"));
const AddAdderss = lazy(() => import("../../pages/user/address/AddAddress"));
const OrderUser = lazy(() => import("../../pages/user/OrderUser"));
const OrderCartUser = lazy(() => import("../../pages/user/OrderCartUser"));
const HistoryOrder = lazy(() => import("../../pages/user/HistoryOrder"));


const userRoutes = [
    {
        path: '/profile',
        element : <Profile/>, 
        role:'ROLE_USER'
    },
    {
        path: '/history',
        element : <HistoryOrder/>, 
        role:'ROLE_USER'
    },
    {
        path: '/address',
        element : <Address/>, 
        role:'ROLE_USER'
    },
    {
        path: '/editAddress',
        element : <EditAddress/>, 
        role:'ROLE_USER'
    },
    {
        path: '/addAddress',
        element : <AddAdderss/>, 
        role:'ROLE_USER'
    },
    {
        path: '/orderUser',
        element : <OrderUser/>, 
        role:'ROLE_USER'
    },
    {
        path: '/orderCartUser',
        element : <OrderCartUser/>, 
        role:'ROLE_USER'
    },
]

export default userRoutes;