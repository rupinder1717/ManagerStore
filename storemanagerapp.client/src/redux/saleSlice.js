import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_SALE = 'https://localhost:7040/api/sale';
const API_CUSTOMER = 'https://localhost:7040/api/customer';
const API_PRODUCT = 'https://localhost:7040/api/product';
const API_STORE = 'https://localhost:7040/api/store';

export const fetchSale = createAsyncThunk('sale/fetchSale', async (_, thunkAPI) => {
    try {
        const res = await axios.get(API_SALE);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const createSale = createAsyncThunk('sale/createSale', async (sale, thunkAPI) => {
    try {
        const res = await axios.post(API_SALE, sale);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const updateSale = createAsyncThunk('sale/updateSale', async (sale, thunkAPI) => {
    try {
        const res = await axios.put(`${API_SALE}/${sale.id}`, sale);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const deleteSale = createAsyncThunk('sale/deleteSale', async (id, thunkAPI) => {
    try {
        await axios.delete(`${API_SALE}/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchCustomers = createAsyncThunk('sale/fetchCustomers', async (_, thunkAPI) => {
    try {
        const res = await axios.get(API_CUSTOMER);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchProducts = createAsyncThunk('sale/fetchProducts', async (_, thunkAPI) => {
    try {
        const res = await axios.get(API_PRODUCT);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchStores = createAsyncThunk('sale/fetchStores', async (_, thunkAPI) => {
    try {
        const res = await axios.get(API_STORE);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

const initialState = {
    sale: [],
    customers: [],
    products: [],
    stores: [],
    loading: false,
    error: null,
    showModal: false,
    showDeleteModal: false,
    modalType: 'create',
    selectedSale: null,
};

const saleSlice = createSlice({
    name: 'sale',
    initialState,
    reducers: {
        setShowModal: (state, action) => { state.showModal = action.payload; },
        setShowDeleteModal: (state, action) => { state.showDeleteModal = action.payload; },
        setModalType: (state, action) => { state.modalType = action.payload; },
        setSelectedSale: (state, action) => { state.selectedSale = action.payload; },
        clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSale.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchSale.fulfilled, (state, action) => { state.loading = false; state.sale = action.payload; })
            .addCase(fetchSale.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Failed to fetch sales.'; })

            .addCase(createSale.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createSale.fulfilled, (state, action) => { state.loading = false; state.sale.push(action.payload); })
            .addCase(createSale.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Failed to create sale.'; })

            .addCase(updateSale.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateSale.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.sale.findIndex(s => s.id === action.payload.id);
                if (idx !== -1) state.sale[idx] = action.payload;
            })
            .addCase(updateSale.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Failed to update sale.'; })

            .addCase(deleteSale.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteSale.fulfilled, (state, action) => {
                state.loading = false;
                state.sale = state.sale.filter(s => s.id !== action.payload);
            })
            .addCase(deleteSale.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Failed to delete sale.'; })

            // Dropdown data
            .addCase(fetchCustomers.fulfilled, (state, action) => { state.customers = action.payload; })
            .addCase(fetchProducts.fulfilled, (state, action) => { state.products = action.payload; })
            .addCase(fetchStores.fulfilled, (state, action) => { state.stores = action.payload; });
    }
});

export const { setShowModal, setShowDeleteModal, setModalType, setSelectedSale, clearError } = saleSlice.actions;
export default saleSlice.reducer;
