import AddPrice from "../../pages/admin/price/AddPrice";
import AdminDashboard from "../../pages/admin/AdminDashboard";
import Categories from "../../pages/admin/category/Categories";
import Companies from "../../pages/admin/Companies";
import Orders from "../../pages/admin/Orders";
import Prices from "../../pages/admin/price/Prices";
import Products from "../../pages/admin/product/Products";
import Units from "../../pages/admin/Units";
import Users from "../../pages/admin/Users";
import EditPrice from "../../pages/admin/price/EditPrice";
import AddCategory from "../../pages/admin/category/AddCategory";
import EditCategory from "../../pages/admin/category/EditCategory";
import AddProduct from "../../pages/admin/product/AddProduct";
import EditProduct from "../../pages/admin/product/EditProduct";

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