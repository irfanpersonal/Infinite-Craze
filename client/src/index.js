import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App.js';

import {Provider} from 'react-redux';
import store from './store.js';

import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';

import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
const stripePromise = loadStripe('pk_test_51NQsazA4iGWI69G8cH0dV2Lc7XwZ3SyvaO473foM8rGGPlEfbOfsjv9YaPSqiRm651aKPqOblEHiQAg989ISlQOJ000oAldk55');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Provider store={store}>
		<Elements stripe={stripePromise}>
			<App/>
		</Elements>
		<ToastContainer position='top-center'/>
	</Provider>
);