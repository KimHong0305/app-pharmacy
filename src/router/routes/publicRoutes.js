import { lazy } from "react";
import OrderCart from "../../pages/OrderCart";
import DetailOrder from "../../pages/DetailOrder";

const Authenticate = lazy(() => import("../../pages/auth/Authenticate"));
const Register = lazy(() => import("../../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../../pages/auth/ForgotPassword"));

const PaymentCallback = lazy(() => import("../../pages/PaymentCallback"));
const SearchOrder = lazy(() => import("../../pages/SearchOrder"));
const Home = lazy(() => import("../../pages/Home"));
const Cart = lazy(() => import("../../pages/Cart"));
const ProductDetail = lazy(() => import("../../pages/ProductDetail"));
const ProductList = lazy(() => import("../../pages/ProductList"));
const SearchProduct = lazy(() => import("../../pages/SearchProduct"));
const Order = lazy(() => import("../../pages/Order"));

const publicRoutes = [
    { path: '/', element: <Home /> },
    { path: '/cart', element: <Cart /> },

    // Products
    { path: '/products/:productId', element: <ProductDetail /> },
    { path: '/categories/:categoryId/products', element: <ProductList /> },
    { path: '/search/products', element: <SearchProduct /> },

    // Orders
    { path: '/orders', element: <Order /> },
    { path: '/orders/cart', element: <OrderCart /> },
    { path: '/orderDetail', element: <DetailOrder /> },
    { path: '/orders/search', element: <SearchOrder /> },
    { path: '/paymentCallback', element: <PaymentCallback /> },

    // Auth
    { path: '/auth', element: <Authenticate /> },
    { path: '/auth/register', element: <Register /> },
    { path: '/auth/forgot-password', element: <ForgotPassword /> },
    { path: '/authenticate', element: <Authenticate/> },

];

export default publicRoutes;