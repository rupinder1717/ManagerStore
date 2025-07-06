import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './customerSlice';
import productReducer from './productSlice';
import storeReducer from './storeSlice';
import saleReducer from './saleSlice'; 

const store = configureStore({
    reducer: {
        customers: customerReducer,
        products: productReducer,
        stores: storeReducer,
        sale: saleReducer, 
    },
});

export default store;
