import { lazy } from "react";
import Authenticate from "../../pages/auth/Authenticate";

const Home = lazy(() => import('../../pages/Home'));
const Cart = lazy(() => import('../../pages/Cart'));
const ProductDetail = lazy(() => import('../../pages/ProductDetail'));
const ProductList = lazy(() => import('../../pages/ProductList'));
const Register = lazy(() => import('../../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../../pages/auth/ForgotPassword'));
const SearchProduct = lazy(() => import('../../pages/SearchProduct'));
const Order = lazy(() => import('../../pages/Order'));


const publicRoutes = [
    {
        path: '/',
        element : <Home/>, 
    },
    {
        path: '/cart',
        element : <Cart/>, 
    },
    {
        path: '/productDetail/:productId',
        element : <ProductDetail/>, 
    },
    {
        path: '/register',
        element : <Register/>, 
    },
    {
        path: '/forgotPassword',
        element : <ForgotPassword/>, 
    },
    {
        path: '/ProductList/:categoryId',
        element : <ProductList/>, 
    },
    {
        path: '/search',
        element : <SearchProduct/>, 
    },
    {
        path: '/order',
        element : <Order/>, 
    },
    {
        path: '//authenticate',
        element : <Authenticate/>, 
    },
]

export default publicRoutes;