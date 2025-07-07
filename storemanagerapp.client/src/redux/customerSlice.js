import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = '/api/customer'; // ✅ lets Vite proxy handle HTTP/HTTPS locally


/* ───────── Thunks ───────── */
export const fetchCustomers = createAsyncThunk('customers/fetch', async () => {
    const { data } = await axios.get(API);
    return data;
});

export const createCustomer = createAsyncThunk('customers/create', async (dto, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(API, dto);
        return data;                         // new customer JSON
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const updateCustomer = createAsyncThunk('customers/update', async (dto, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${API}/${dto.id}`, dto);
        return data;                         // updated JSON (may be undefined if API returns 204)
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const deleteCustomer = createAsyncThunk('customers/delete', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

/* ───────── Slice ───────── */
const slice = createSlice({
    name: 'customers',
    initialState: {
        customers: [],
        loading: false,
        error: null,
        showModal: false,
        showDeleteModal: false,
        modalType: 'create',
        selectedCustomer: null,
    },
    reducers: {
        setShowModal: (s, a) => { s.showModal = a.payload; },
        setShowDeleteModal: (s, a) => { s.showDeleteModal = a.payload; },
        setModalType: (s, a) => { s.modalType = a.payload; },
        setSelectedCustomer: (s, a) => { s.selectedCustomer = a.payload; },
        clearError: (s) => { s.error = null; },
    },
    extraReducers: (b) => {
        /* fetch */
        b.addCase(fetchCustomers.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(fetchCustomers.fulfilled, (s, a) => { s.loading = false; s.customers = a.payload; })
            .addCase(fetchCustomers.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
        /* create */
        b.addCase(createCustomer.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(createCustomer.fulfilled, (s, a) => {
                s.loading = false;
                if (a.payload) s.customers.push(a.payload);
            })
            .addCase(createCustomer.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
        /* update */
        b.addCase(updateCustomer.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(updateCustomer.fulfilled, (s, a) => {
                s.loading = false;
                if (a.payload) {
                    const i = s.customers.findIndex(c => c.id === a.payload.id);
                    if (i !== -1) s.customers[i] = a.payload;
                }
            })
            .addCase(updateCustomer.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
        /* delete */
        b.addCase(deleteCustomer.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(deleteCustomer.fulfilled, (s, a) => {
                s.loading = false;
                s.customers = s.customers.filter(c => c.id !== a.payload);
            })
            .addCase(deleteCustomer.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    },
});
export const {
    setShowModal,
    setShowDeleteModal,
    setModalType,
    setSelectedCustomer,
    clearError,
} = slice.actions;
export default slice.reducer;
