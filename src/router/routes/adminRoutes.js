import { lazy } from "react";

// Dashboard
const AdminDashboard = lazy(() => import("../../pages/admin/AdminDashboard"));

// Users
const Users = lazy(() => import("../../pages/admin/Users"));
const Employees = lazy(() => import("../../pages/admin/staff/Employees"));
const AddEmployee = lazy(() => import("../../pages/admin/staff/AddEmployee"));

// Categories
const Categories = lazy(() => import("../../pages/admin/category/Categories"));
const AddCategory = lazy(() => import("../../pages/admin/category/AddCategory"));
const EditCategory = lazy(() => import("../../pages/admin/category/EditCategory"));

// Products
const Products = lazy(() => import("../../pages/admin/product/Products"));
const AddProduct = lazy(() => import("../../pages/admin/product/AddProduct"));
const EditProduct = lazy(() => import("../../pages/admin/product/EditProduct"));

// Units
const Units = lazy(() => import("../../pages/admin/Units"));

// Companies
const Companies = lazy(() => import("../../pages/admin/Companies"));

// Prices
const Prices = lazy(() => import("../../pages/admin/price/Prices"));
const AddPrice = lazy(() => import("../../pages/admin/price/AddPrice"));
const EditPrice = lazy(() => import("../../pages/admin/price/EditPrice"));

// Orders
const Orders = lazy(() => import("../../pages/admin/order/Orders"));
const OrderDetail = lazy(() => import("../../pages/admin/order/OrderDetail"));

// Coupons
const Coupon = lazy(() => import("../../pages/admin/coupon/Coupon"));
const AddCoupon = lazy(() => import("../../pages/admin/coupon/AddCoupon"));
const EditCoupon = lazy(() => import("../../pages/admin/coupon/EditCoupon"));

export const adminRoutes = [
    { path: 'admin/dashboard', element: <AdminDashboard />, role: 'ROLE_ADMIN' },

    { path: 'admin/users', element: <Users />, role: 'ROLE_ADMIN' },
    { path: 'admin/employees', element: <Employees />, role: 'ROLE_ADMIN' },
    { path: 'admin/employees/add', element: <AddEmployee />, role: 'ROLE_ADMIN' },

    { path: 'admin/categories', element: <Categories />, role: 'ROLE_ADMIN' },
    { path: 'admin/categories/add', element: <AddCategory />, role: ['ROLE_ADMIN', 'ROLE_EMPLOYEE']  },
    { path: 'admin/categories/edit/:id', element: <EditCategory />, role: ['ROLE_ADMIN', 'ROLE_EMPLOYEE']  },

    { path: 'admin/products', element: <Products />, role: 'ROLE_ADMIN' },
    { path: 'admin/products/add', element: <AddProduct />, role: ['ROLE_ADMIN', 'ROLE_EMPLOYEE']  },
    { path: 'admin/products/edit/:id', element: <EditProduct />, role: ['ROLE_ADMIN', 'ROLE_EMPLOYEE']  },

    { path: 'admin/units', element: <Units />, role: 'ROLE_ADMIN' },
    { path: 'admin/companies', element: <Companies />, role: 'ROLE_ADMIN' },

    { path: 'admin/prices', element: <Prices />, role: 'ROLE_ADMIN' },
    { path: 'admin/prices/add', element: <AddPrice />, role: ['ROLE_ADMIN', 'ROLE_EMPLOYEE']  },
    { path: 'admin/prices/edit/:id', element: <EditPrice />, role: ['ROLE_ADMIN', 'ROLE_EMPLOYEE']  },

    { path: 'admin/orders', element: <Orders />, role: 'ROLE_ADMIN' },
    { path: 'admin/orders/:id', element: <OrderDetail />, role: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] },

    { path: 'admin/coupons', element: <Coupon />, role: 'ROLE_ADMIN' },
    { path: 'admin/coupons/add', element: <AddCoupon />, role: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] },
    { path: 'admin/coupons/edit/:id', element: <EditCoupon />, role: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] },
];

export default adminRoutes;