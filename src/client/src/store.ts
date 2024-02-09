import {configureStore} from '@reduxjs/toolkit';
import navigationReducer from './features/navigation/navigationSlice';
import userReducer from './features/user/userSlice';
import profileReducer from './features/profile/profileSlice';
import productsReducer from './features/products/productsSlice';
import ordersReducer from './features/orders/ordersSlice';
import singleOrderReducer from './features/singleOrder/singleOrderSlice';
import singleProductReducer from './features/singleProduct/singleProductSlice';
import cartReducer from './features/cart/cartSlice';
import usersReducer from './features/users/usersSlice';
import singleUserReducer from './features/singleUser/singleUserSlice';
import statsReducer from './features/stats/statsSlice';

const store = configureStore({
    reducer: {
        navigation: navigationReducer,
        user: userReducer,
        profile: profileReducer,
        products: productsReducer,
        orders: ordersReducer,
        singleOrder: singleOrderReducer,
        singleProduct: singleProductReducer,
        cart: cartReducer,
        users: usersReducer,
        singleUser: singleUserReducer,
        stats: statsReducer
    }
});

export type useDispatchType = typeof store.dispatch;

export type useSelectorType = ReturnType<typeof store.getState>;

export default store;