import { lazy } from "react";

const AddPrice = lazy(() => import("../../pages/admin/price/AddPrice"));
const AdminDashboard = lazy(() => import("../../pages/admin/AdminDashboard"));
const Categories = lazy(() => import("../../pages/admin/category/Categories"));
const Companies = lazy(() => import("../../pages/admin/Companies"));
const Orders = lazy(() => import("../../pages/admin/Orders"));
const Prices = lazy(() => import("../../pages/admin/price/Prices"));
const Products = lazy(() => import("../../pages/admin/product/Products"));
const Units = lazy(() => import("../../pages/admin/Units"));
const Users = lazy(() => import("../../pages/admin/Users"));
const EditPrice = lazy(() => import("../../pages/admin/price/EditPrice"));
const AddCategory = lazy(() => import("../../pages/admin/category/AddCategory"));
const EditCategory = lazy(() => import("../../pages/admin/category/EditCategory"));
const AddProduct = lazy(() => import("../../pages/admin/product/AddProduct"));
const EditProduct = lazy(() => import("../../pages/admin/product/EditProduct"));


export const adminRoutes = [
    {
        path: 'admin/dashboard',
        element : <AdminDashboard/>,
        role : 'ROLE_ADMIN'
    },
    {
        path: 'admin/users',
        element : <Users/>,
        role : 'ROLE_ADMIN'
    },
    {
        path: 'admin/categories',
        element : <Categories/>,
        role : 'ROLE_ADMIN'
    },
    {
        path: 'admin/addCategory',
        element : <AddCategory/>,
        role : 'ROLE_ADMIN'
    },
    {
        path: 'admin/editCategory',
        element : <EditCategory/>,
        role : 'ROLE_ADMIN'
    },
    {
        path: 'admin/products',
        element : <Products/>,
        role : 'ROLE_ADMIN'
    },
    {
        path: 'admin/addProduct',
        element : <AddProduct/>,
        role : 'ROLE_ADMIN'
    },
    {
        path: 'admin/editProduct',
        element : <EditProduct/>,
        role : 'ROLE_ADMIN'
    },
    {
        path: 'admin/units',
        element : <Units/>,
        role : 'ROLE_ADMIN'
    },
    {
        path: 'admin/companies',
        element : <Companies/>,
        role : 'ROLE_ADMIN'
    },
    {
        path: 'admin/prices',
        element : <Prices/>,
        role : 'ROLE_ADMIN'
    },
    {
        path: 'admin/addPrice',
        element : <AddPrice/>,
        role : 'ROLE_ADMIN'
    },
    {
        path: 'admin/editPrice',
        element : <EditPrice/>,
        role : 'ROLE_ADMIN'
    },
    {
        path: 'admin/orders',
        element : <Orders/>,
        role : 'ROLE_ADMIN'
    },
]

export default adminRoutes;