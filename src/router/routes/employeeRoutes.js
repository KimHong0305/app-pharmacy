import { lazy } from "react";

// Employee pages
const EmployeeDashboard = lazy(() => import("../../pages/employee/EmployeeDashboard"));
const Feedback = lazy(() => import("../../pages/employee/Feedback"));

// Products
const Products = lazy(() => import("../../pages/admin/product/Products"));
const AddProduct = lazy(() => import("../../pages/admin/product/AddProduct"));
const EditProduct = lazy(() => import("../../pages/admin/product/EditProduct"));

// Prices
const Prices = lazy(() => import("../../pages/admin/price/Prices"));
const AddPrice = lazy(() => import("../../pages/admin/price/AddPrice"));
const EditPrice = lazy(() => import("../../pages/admin/price/EditPrice"));

// Orders
const Orders = lazy(() => import("../../pages/admin/order/Orders"));
const OrderCOD = lazy(() => import("../../pages/admin/order/OrderCOD"));
const OrderDetail = lazy(() => import("../../pages/admin/order/OrderDetail"));

// Units
const Units = lazy(() => import("../../pages/admin/Units"));

// Coupons
const Coupon = lazy(() => import("../../pages/admin/coupon/Coupon"));
const AddCoupon = lazy(() => import("../../pages/admin/coupon/AddCoupon"));
const EditCoupon = lazy(() => import("../../pages/admin/coupon/EditCoupon"));

const Inventory = lazy(() => import("../../pages/admin/inventory/Inventory"));
export const employeeRoutes = [
    { path: 'employee/dashboard', element: <EmployeeDashboard />, role: 'ROLE_EMPLOYEE' },
    { path: 'employee/feedback', element: <Feedback />, role: 'ROLE_EMPLOYEE' },

    { path: 'employee/products', element: <Products />, role: 'ROLE_EMPLOYEE' },
    { path: 'employee/products/add', element: <AddProduct />, role: 'ROLE_EMPLOYEE' },
    { path: 'employee/products/edit/:id', element: <EditProduct />, role: 'ROLE_EMPLOYEE' },

    { path: 'employee/prices', element: <Prices />, role: 'ROLE_EMPLOYEE' },
    { path: 'employee/prices/add', element: <AddPrice />, role: 'ROLE_EMPLOYEE' },
    { path: 'employee/prices/edit/:id', element: <EditPrice />, role: 'ROLE_EMPLOYEE' },

    { path: 'employee/orders', element: <Orders />, role: 'ROLE_EMPLOYEE' },
    { path: 'employee/orders/cod', element: <OrderCOD />, role: 'ROLE_EMPLOYEE' },
    { path: 'employee/orders/:id', element: <OrderDetail />, role: 'ROLE_EMPLOYEE' },

    { path: 'employee/units', element: <Units />, role: 'ROLE_EMPLOYEE' },

    { path: 'employee/coupons', element: <Coupon />, role: 'ROLE_EMPLOYEE' },
    { path: 'employee/coupons/add', element: <AddCoupon />, role: 'ROLE_EMPLOYEE' },
    { path: 'employee/coupons/edit/:id', element: <EditCoupon />, role: 'ROLE_EMPLOYEE' },

    { path: 'employee/inventory', element: <Inventory />, role: 'ROLE_EMPLOYEE' },
];

export default employeeRoutes;