import addressReducer from "./Reducers/addressReducer";
import authReducer from "./Reducers/authReducer";
import cartReducer from "./Reducers/cartReducer";
import categoryReducer from "./Reducers/categoryReducer";
import companyReducer from "./Reducers/companyReducer";
import locationReducer from "./Reducers/locationReducer";
import priceReducer from "./Reducers/priceReducer";
import productReducer from "./Reducers/productReducer";
import unitReducer from "./Reducers/unitReducer";
import userReducer from "./Reducers/userReducer";

const rootReducer = {
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
    cart: cartReducer,
    user: userReducer,
    unit: unitReducer,
    company: companyReducer,
    price: priceReducer,
    location: locationReducer,
    address: addressReducer,
}
export default rootReducer;