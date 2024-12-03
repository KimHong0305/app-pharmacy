import Profile from "../../pages/user/Profile";
import HomeUser from "../../pages/user/HomeUser";
import Address from "../../pages/user/Address";

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
]

export default userRoutes;