import {configureStore} from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice.js';
import productsReducer from './features/products/productsSlice.js';
import productReducer from './features/product/productSlice.js';
import reviewsReducer from './features/reviews/reviewsSlice.js';
import addProductReducer from './features/addProduct/addProductSlice.js';
import adminReducer from './features/admin/adminSlice.js';
import cartReducer from './features/cart/cartSlice.js';
import ordersReducer from './features/orders/ordersSlice.js';

const store = configureStore({
    reducer: {
        user: userReducer,
        products: productsReducer,
        product: productReducer,
        reviews: reviewsReducer,
        addProduct: addProductReducer,
        admin: adminReducer,
        cart: cartReducer,
        orders: ordersReducer
    }
});

export default store;