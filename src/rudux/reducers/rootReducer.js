import { combineReducers } from 'redux';
import cartReducer from './cartReducer';
import categoryReducer from './categoryReducer';
import brandReducer from './brandReducer';
import buyNowReducer from './buyNowReducer';

export default combineReducers({
    cart: cartReducer,
    category: categoryReducer,
    brand: brandReducer,
    buyNow: buyNowReducer
});
