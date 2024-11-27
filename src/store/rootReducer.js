import authReducer from "./Reducers/authReducer";
import cartReducer from "./Reducers/cartReducer";
import categoryReducer from "./Reducers/categoryReducer";
import productReducer from "./Reducers/productReducer";

const rootReducer = {
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
    cart: cartReducer,
}
export default rootReducer;