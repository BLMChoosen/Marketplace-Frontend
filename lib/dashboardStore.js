'use client';

import { create } from 'zustand';
import api from './api';

function apiError(error, fallback) {
  return error.response?.data?.error || error.message || fallback;
}

const emptyStats = {
  total_revenue: 0,
  total_orders: 0,
  pending_orders: 0,
  products_count: 0,
  revenue_last_30d: 0,
  orders_today: 0,
};

const useDashboardStore = create((set, get) => ({
  sellerStats: emptyStats,
  sellerOrders: [],
  sellerStores: [],
  sellerProducts: [],
  buyerOrders: [],
  loading: false,
  error: '',

  fetchSellerDashboard: async () => {
    set({ loading: true, error: '' });
    try {
      const [statsRes, ordersRes, storesRes, productsRes] = await Promise.all([
        api.get('/seller/stats'),
        api.get('/seller/orders', { params: { page: 1, per_page: 5 } }),
        api.get('/stores/my'),
        api.get('/seller/products', { params: { page: 1, per_page: 50 } }),
      ]);
      set({
        sellerStats: statsRes.data || emptyStats,
        sellerOrders: ordersRes.data.orders || [],
        sellerStores: storesRes.data.stores || [],
        sellerProducts: productsRes.data.products || [],
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: apiError(error, 'Falha ao carregar painel do vendedor.'),
      });
    }
  },

  fetchBuyerDashboard: async () => {
    set({ loading: true, error: '' });
    try {
      const res = await api.get('/orders', { params: { page: 1, per_page: 5 } });
      set({ buyerOrders: res.data.orders || [], loading: false });
    } catch (error) {
      set({
        buyerOrders: [],
        loading: false,
        error: apiError(error, 'Falha ao carregar pedidos.'),
      });
    }
  },

  createStore: async (payload) => {
    const res = await api.post('/stores', payload);
    await get().fetchSellerDashboard();
    return res.data.store;
  },

  createProduct: async (payload) => {
    const res = await api.post('/products', payload);
    await get().fetchSellerDashboard();
    return res.data.product;
  },

  shipOrder: async (orderId) => {
    await api.patch(`/seller/orders/${orderId}/ship`);
    await get().fetchSellerDashboard();
  },

  deliverOrder: async (orderId) => {
    await api.patch(`/seller/orders/${orderId}/deliver`);
    await get().fetchSellerDashboard();
  },
}));

export default useDashboardStore;
