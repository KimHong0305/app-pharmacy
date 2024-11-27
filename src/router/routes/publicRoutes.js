import Home from  '../../pages/Home';
import Cart from "../../pages/Cart";
import ProductDetail from  '../../pages/ProductDetail';
import ProductList from  '../../pages/ProductList';
import Register from '../../pages/auth/Register';

import TestComponent from  '../../pages/TestComponent';
import ForgotPassword from '../../pages/auth/ForgotPassword';
import SearchProduct from '../../pages/SearchProduct';

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
        path: '/test',
        element : <TestComponent/>, 
    },
    {
        path: '/ProductList/:categoryId',
        element : <ProductList/>, 
    },
    {
        path: '/search',
        element : <SearchProduct/>, 
    },
]

export default publicRoutes;