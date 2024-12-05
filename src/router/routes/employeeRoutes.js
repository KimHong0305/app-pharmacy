import AddPrice from "../../pages/admin/price/AddPrice";
import AdminDashboard from "../../pages/admin/AdminDashboard";
import Orders from "../../pages/admin/Orders";
import Prices from "../../pages/admin/price/Prices";
import Products from "../../pages/admin/product/Products";
import Units from "../../pages/admin/Units";
import EditPrice from "../../pages/admin/price/EditPrice";
import AddProduct from "../../pages/admin/product/AddProduct";
import EditProduct from "../../pages/admin/product/EditProduct";

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
]

export default employeeRoutes;