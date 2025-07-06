import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://localhost:7040/api/product';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, thunkAPI) => {
    try {
        const res = await axios.get(API_URL);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const createProduct = createAsyncThunk('products/createProduct', async (product, thunkAPI) => {
    try {
        const res = await axios.post(API_URL, product);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const updateProduct = createAsyncThunk('products/updateProduct', async (product, thunkAPI) => {
    try {
        const res = await axios.put(`${API_URL}/${product.id}`, product);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, thunkAPI) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

const initialState = {
    products: [],
    loading: false,
    error: null,
    showModal: false,
    showDeleteModal: false,
    modalType: 'create',
    selectedProduct: null,
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setShowModal: (state, action) => { state.showModal = action.payload; },
        setShowDeleteModal: (state, action) => { state.showDeleteModal = action.payload; },
        setModalType: (state, action) => { state.modalType = action.payload; },
        setSelectedProduct: (state, action) => { state.selectedProduct = action.payload; },
        clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true; state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false; state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false; state.error = action.payload || 'Failed to fetch products.';
            })

            .addCase(createProduct.pending, (state) => {
                state.loading = true; state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false; state.products.push(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false; state.error = action.payload || 'Failed to create product.';
            })

            .addCase(updateProduct.pending, (state) => {
                state.loading = true; state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.products[index] = action.payload;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false; state.error = action.payload || 'Failed to update product.';
            })

            .addCase(deleteProduct.pending, (state) => {
                state.loading = true; state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(p => p.id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false; state.error = action.payload || 'Failed to delete product.';
            });
    }
});

export const { setShowModal, setShowDeleteModal, setModalType, setSelectedProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
