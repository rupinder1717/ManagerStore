import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ------------------------------
// API ENDPOINTS
// ------------------------------
const API_SALE = 'https://localhost:7040/api/sale';
const API_CUSTOMER = 'https://localhost:7040/api/customer';
const API_PRODUCT = 'https://localhost:7040/api/product';
const API_STORE = 'https://localhost:7040/api/store';

// ------------------------------
// Helper: always return a string
// ------------------------------
const extractErrorMessage = (err) =>
    err?.response?.data?.message || err.message || 'Something went wrong';

// ------------------------------
// Thunks
// ------------------------------
export const fetchSale = createAsyncThunk('sale/fetchSale', async (_, thunkAPI) => {
    try {
        const res = await axios.get(API_SALE);
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(extractErrorMessage(err));
    }
});

export const createSale = createAsyncThunk('sale/createSale', async (sale, thunkAPI) => {
    try {
        const res = await axios.post(API_SALE, sale);
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(extractErrorMessage(err));
    }
});

export const updateSale = createAsyncThunk('sale/updateSale', async (sale, thunkAPI) => {
    try {
        const res = await axios.put(`${API_SALE}/${sale.id}`, sale);
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(extractErrorMessage(err));
    }
});

export const deleteSale = createAsyncThunk('sale/deleteSale', async (id, thunkAPI) => {
    try {
        await axios.delete(`${API_SALE}/${id}`);
        return id;
    } catch (err) {
        return thunkAPI.rejectWithValue(extractErrorMessage(err));
    }
});

export const fetchCustomers = createAsyncThunk('sale/fetchCustomers', async (_, thunkAPI) => {
    try {
        const res = await axios.get(API_CUSTOMER);
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(extractErrorMessage(err));
    }
});

export const fetchProducts = createAsyncThunk('sale/fetchProducts', async (_, thunkAPI) => {
    try {
        const res = await axios.get(API_PRODUCT);
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(extractErrorMessage(err));
    }
});

export const fetchStores = createAsyncThunk('sale/fetchStores', async (_, thunkAPI) => {
    try {
        const res = await axios.get(API_STORE);
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(extractErrorMessage(err));
    }
});

// ------------------------------
// Initial State
// ------------------------------
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

// ------------------------------
// Slice
// ------------------------------
const saleSlice = createSlice({
    name: 'sale',
    initialState,
    reducers: {
        setShowModal: (s, a) => { s.showModal = a.payload; },
        setShowDeleteModal: (s, a) => { s.showDeleteModal = a.payload; },
        setModalType: (s, a) => { s.modalType = a.payload; },
        setSelectedSale: (s, a) => { s.selectedSale = a.payload; },
        clearError: (s) => { s.error = null; },
    },
    extraReducers: (b) => {
        // ───── fetchSale
        b.addCase(fetchSale.pending, (s) => { s.loading = true; s.error = null; });
        b.addCase(fetchSale.fulfilled, (s, a) => { s.loading = false; s.sale = a.payload; });
        b.addCase(fetchSale.rejected, (s, a) => { s.loading = false; s.sale = []; s.error = a.payload; });

        // ───── createSale
        b.addCase(createSale.pending, (s) => { s.loading = true; s.error = null; });
        b.addCase(createSale.fulfilled, (s, a) => { s.loading = false; s.sale.push(a.payload); });
        b.addCase(createSale.rejected, (s, a) => { s.loading = false; s.error = a.payload; });

        // ───── updateSale
        b.addCase(updateSale.pending, (s) => { s.loading = true; s.error = null; });
        b.addCase(updateSale.fulfilled, (s, a) => {
            s.loading = false;
            const idx = s.sale.findIndex((x) => x.id === a.payload.id);
            if (idx > -1) s.sale[idx] = a.payload;
        });
        b.addCase(updateSale.rejected, (s, a) => { s.loading = false; s.error = a.payload; });

        // ───── deleteSale
        b.addCase(deleteSale.pending, (s) => { s.loading = true; s.error = null; });
        b.addCase(deleteSale.fulfilled, (s, a) => {
            s.loading = false;
            s.sale = s.sale.filter((x) => x.id !== a.payload);
        });
        b.addCase(deleteSale.rejected, (s, a) => { s.loading = false; s.error = a.payload; });

        // ───── dropdown data (no loaders for these)
        b.addCase(fetchCustomers.fulfilled, (s, a) => { s.customers = a.payload; });
        b.addCase(fetchProducts.fulfilled, (s, a) => { s.products = a.payload; });
        b.addCase(fetchStores.fulfilled, (s, a) => { s.stores = a.payload; });
    },
});

export const {
    setShowModal,
    setShowDeleteModal,
    setModalType,
    setSelectedSale,
    clearError,
} = saleSlice.actions;

export default saleSlice.reducer;
