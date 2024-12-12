import { lazy } from "react";
const OrderDetail = lazy(() => import("../../pages/admin/order/OrderDetail"));
const Feedback = lazy(() => import("../../pages/employee/Feedback"));
const OrderCOD = lazy(() => import("../../pages/admin/order/OrderCOD"));
const AddPrice = lazy(() => import("../../pages/admin/price/AddPrice"));
const AdminDashboard = lazy(() => import("../../pages/admin/AdminDashboard"));
const Orders = lazy(() => import("../../pages/admin/order/Orders"));
const Prices = lazy(() => import("../../pages/admin/price/Prices"));
const Products = lazy(() => import("../../pages/admin/product/Products"));
const Units = lazy(() => import("../../pages/admin/Units"));
const EditPrice = lazy(() => import("../../pages/admin/price/EditPrice"));
const AddProduct = lazy(() => import("../../pages/admin/product/AddProduct"));
const EditProduct = lazy(() => import("../../pages/admin/product/EditProduct"));

export const employeeRoutes = [
    {
        path: 'employee/dashboard',
        element : <AdminDashboard/>,
        role : 'ROLE_EMPLOYEE'
    },
    {
        path: 'admin/products',
        element : <Products/>,
        role : 'ROLE_EMPLOYEE'
    },
    {
        path: 'admin/addProduct',
        element : <AddProduct/>,
        role : 'ROLE_EMPLOYEE'
    },
    {
        path: 'admin/editProduct',
        element : <EditProduct/>,
        role : 'ROLE_EMPLOYEE'
    },
    {
        path: 'admin/units',
        element : <Units/>,
        role : 'ROLE_EMPLOYEE'
    },
    {
        path: 'admin/prices',
        element : <Prices/>,
        role : 'ROLE_EMPLOYEE'
    },
    {
        path: 'admin/addPrice',
        element : <AddPrice/>,
        role : 'ROLE_EMPLOYEE'
    },
    {
        path: 'admin/editPrice',
        element : <EditPrice/>,
        role : 'ROLE_EMPLOYEE'
    },
    {
        path: 'admin/orders',
        element : <Orders/>,
        role : 'ROLE_EMPLOYEE'
    },
    {
        path: 'admin/orderCOD',
        element : <OrderCOD/>,
        role : 'ROLE_EMPLOYEE'
    },
    {
        path: 'admin/orderDetail',
        element : <OrderDetail/>,
        role : 'ROLE_EMPLOYEE'
    },
    {
        path: 'employee/feedback',
        element : <Feedback/>,
        role : 'ROLE_EMPLOYEE'
    },
]

export default employeeRoutes;