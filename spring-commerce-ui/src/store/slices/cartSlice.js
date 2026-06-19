import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const loadLocalCart = () => {
  try {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: loadLocalCart(),
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/cart');
    return response.data.data.items || [];
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await api.post('/cart/items', { productId, quantity });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add item');
  }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
  try {
    await api.delete(`/cart/items/${itemId}`);
    return itemId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
  }
});

export const updateQuantity = createAsyncThunk('cart/updateQty', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
  }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/cart/clear');
    return true;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToLocalCart(state, action) {
      const product = action.payload;
      const existing = state.items.find(i => i.productId === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, productId: product.id, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromLocalCart(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateLocalQuantity(state, action) {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(i => i.id === itemId);
      if (item) item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearLocalCart(state) {
      state.items = [];
      localStorage.removeItem('cart');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        localStorage.removeItem('cart');
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.loading = false;
        localStorage.removeItem('cart');
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { addToLocalCart, removeFromLocalCart, updateLocalQuantity, clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;
