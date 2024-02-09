import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {AddProduct, Stats, Auth, Cart, Checkout, Error, Home, HomeLayout, Order, Orders, Product, Products, Profile, ProtectedRoute, Success, User, Users} from './pages';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from './store';
import {showCurrentUser} from './features/user/userThunk';
import {Loading} from './components';

const router = createBrowserRouter([
	// undefined is when the user is not logged in at all
	{
		path: '/',
		element: <HomeLayout/>,
		errorElement: <Error/>,
		children: [
			{
				index: true,
				element: <Home/>
			},
			{
				path: 'add-product',
				element: <ProtectedRoute role={['admin']}><AddProduct/></ProtectedRoute>
			},
			{
				path: 'stats',
				element: <ProtectedRoute role={['admin']}><Stats/></ProtectedRoute>
			},
			{
				path: 'cart',
				element: <ProtectedRoute role={['user', undefined]}><Cart/></ProtectedRoute>
			},
			{
				path: 'checkout',
				element: <ProtectedRoute role={['user']}><Checkout/></ProtectedRoute>
			},
			{
				path: 'order',
				element: <ProtectedRoute role={['user', 'admin']}><Orders/></ProtectedRoute>
			},
			{
				path: 'order/:id',
				element: <ProtectedRoute role={['user', 'admin']}><Order/></ProtectedRoute>
			},
			{
				path: 'product',
				element: <Products/>
			},
			{
				path: 'product/:id',
				element: <Product/>
			},
			{
				path: 'success',
				element: <ProtectedRoute role={['user']}><Success/></ProtectedRoute>
			},
			{
				path: 'user',
				element: <ProtectedRoute role={['admin']}><Users/></ProtectedRoute>
			},
			{
				path: 'user/:id',
				element: <ProtectedRoute role={['admin']}><User/></ProtectedRoute>
			},
			{
				path: 'profile',
				element: <ProtectedRoute role={['user', 'admin']}><Profile/></ProtectedRoute>,
			}
		]
	},
	{
		path: '/auth',
		element: <Auth/>,
		errorElement: <Error/>
	}
])

const App: React.FunctionComponent = () => {
	const dispatch = useDispatch<useDispatchType>();
	const {globalLoading} = useSelector((store: useSelectorType) => store.user);
	const {location} = useSelector((store: useSelectorType) => store.navigation);
	React.useEffect(() => {
		dispatch(showCurrentUser());
	}, []);
	React.useEffect(() => {
		if (window.location.pathname !== location) {
			router.navigate(location);
		}
	}, [location]);
	if (globalLoading) {
		return (
			<Loading title="Loading Application" position="center"/>
		);
	}
	return (
		<RouterProvider router={router}/>
	);
}

export default App;