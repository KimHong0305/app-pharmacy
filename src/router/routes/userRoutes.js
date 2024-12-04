import Profile from "../../pages/user/Profile";
import HomeUser from "../../pages/user/HomeUser";
import Address from "../../pages/user/address/Address";
import EditAddress from "../../pages/user/address/EditAddress";
import AddAdderss from "../../pages/user/address/AddAddress";
import OrderUser from "../../pages/user/OrderUser";
import PaymentCallback from "../../pages/user/PaymentCallback";

const userRoutes = [
    {
        path: '/profile',
        element : <Profile/>, 
        role:'ROLE_USER'
    },
    {
        path: '/home',
        element : <HomeUser/>, 
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
        path: '/paymentCallback',
        element : <PaymentCallback/>, 
        role:'ROLE_USER'
    },
]

export default userRoutes;