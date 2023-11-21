import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {About, AddProduct, Admin, Auth, Cart, Checkout, EditProduct, Error, Home, HomeLayout, Orders, Products, Product, Profile, ProtectedRoute, SuccessOrder} from './pages';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {showCurrentUser} from './features/user/userThunk';

const router = createBrowserRouter([
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
				path: 'about',
				element: <About/>
			},
			{
				path: 'products',
				element: <Products/>
			},
			{
				path: 'products/:id',
				element: <Product/>
			},
			{
				path: 'add-product',
				element: <ProtectedRoute role={['admin']}><AddProduct/></ProtectedRoute>
			},
			{
				path: 'edit-product',
				element: <ProtectedRoute role={['admin']}><EditProduct/></ProtectedRoute>
			},
			{
				path: 'admin',
				element: <ProtectedRoute role={['admin']}><Admin/></ProtectedRoute>
			},
			{
				path: 'cart',
				element: <Cart/>
			},
			{
				path: 'orders',
				element: <ProtectedRoute role={['user']}><Orders/></ProtectedRoute>
			},
			{
				path: 'checkout',
				element: <ProtectedRoute role={['user']}><Checkout/></ProtectedRoute>
			},
			{
				path: 'profile',
				element: <ProtectedRoute role={['user', 'admin']}><Profile/></ProtectedRoute>
			},
			{
				path: 'success-order',
				element: <ProtectedRoute role={['user']}><SuccessOrder/></ProtectedRoute>
			}
		]
	},
	{
		path: '/auth',
		element: <Auth/>
	}
]);

const App = () => {
	const dispatch = useDispatch();
	const {isLoading} = useSelector(store => store.user);
	React.useEffect(() => {
		dispatch(showCurrentUser());
	}, []);
	if (isLoading) {
		return (
			<h1>Loading...</h1>
		);
	}
	return (
		<RouterProvider router={router}/>
	);
}

export default App;