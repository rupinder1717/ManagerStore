import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://localhost:7040/api/store';

export const fetchStores = createAsyncThunk('stores/fetchStores', async (_, thunkAPI) => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const createStore = createAsyncThunk('stores/createStore', async (store, thunkAPI) => {
    try {
        const response = await axios.post(API_URL, store);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const updateStore = createAsyncThunk('stores/updateStore', async (store, thunkAPI) => {
    try {
        const response = await axios.put(`${API_URL}/${store.id}`, store);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const deleteStore = createAsyncThunk('stores/deleteStore', async (id, thunkAPI) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

const initialState = {
    stores: [],
    showModal: false,
    showDeleteModal: false,
    modalType: 'create',
    selectedStore: null,
    loading: false,
    error: null,
};

const storeSlice = createSlice({
    name: 'stores',
    initialState,
    reducers: {
        setShowModal: (state, action) => { state.showModal = action.payload; },
        setShowDeleteModal: (state, action) => { state.showDeleteModal = action.payload; },
        setModalType: (state, action) => { state.modalType = action.payload; },
        setSelectedStore: (state, action) => { state.selectedStore = action.payload; },
        clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStores.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStores.fulfilled, (state, action) => {
                state.loading = false;
                state.stores = action.payload;
            })
            .addCase(fetchStores.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch stores.';
            })
            .addCase(createStore.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createStore.fulfilled, (state, action) => {
                state.loading = false;
                state.stores.push(action.payload);
            })
            .addCase(createStore.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create store.';
            })
            .addCase(updateStore.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStore.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.stores.findIndex(s => s.id === action.payload.id);
                if (index !== -1) state.stores[index] = action.payload;
            })
            .addCase(updateStore.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update store.';
            })
            .addCase(deleteStore.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteStore.fulfilled, (state, action) => {
                state.loading = false;
                state.stores = state.stores.filter(s => s.id !== action.payload);
            })
            .addCase(deleteStore.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete store.';
            });
    }
});

export const { setShowModal, setShowDeleteModal, setModalType, setSelectedStore, clearError } = storeSlice.actions;
export default storeSlice.reducer;
