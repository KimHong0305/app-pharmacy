import AddPrice from "../../pages/admin/AddPrice";
import AdminDashboard from "../../pages/admin/AdminDashboard";
import Categories from "../../pages/admin/Categories";
import Companies from "../../pages/admin/Companies";
import Orders from "../../pages/admin/Orders";
import Prices from "../../pages/admin/Prices";
import Products from "../../pages/admin/Products";
import Units from "../../pages/admin/Units";
import Users from "../../pages/admin/Users";

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
        path: 'admin/products',
        element : <Products/>,
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
        path: 'admin/orders',
        element : <Orders/>,
        role : 'ROLE_ADMIN'
    },
]

export default adminRoutes;