import Profile from "../../pages/user/Profile";
import HomeUser from "../../pages/user/HomeUser";

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
]

export default userRoutes;