'use client';

import { create } from 'zustand';
import api from './api';

function normalizeError(error, fallback) {
  return error.response?.data?.error || error.message || fallback;
}

const useProductStore = create((set) => ({
  products: [],
  featuredProducts: [],
  selectedProduct: null,
  stores: [],
  pagination: { page: 1, per_page: 12, total: 0, pages: 1 },
  loading: false,
  error: '',

  fetchFeaturedProducts: async () => {
    set({ loading: true, error: '' });
    try {
      const res = await api.get('/products', { params: { page: 1, per_page: 8 } });
      set({ featuredProducts: res.data.products || [], loading: false });
    } catch (error) {
      set({
        featuredProducts: [],
        loading: false,
        error: normalizeError(error, 'Falha ao carregar produtos.'),
      });
    }
  },

  fetchProducts: async (filters = {}) => {
    set({ loading: true, error: '' });
    try {
      const { search, page = 1, per_page = 12, ...rest } = filters;

      const params = { page, per_page, ...rest };
      Object.keys(params).forEach((key) => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const res = await api.get('/search', {
        params: { ...params, q: search },
      });
      set({
        products: (res.data.results || []).map((result) => ({
          ...result,
          title: result.title || result.name,
        })),
        pagination: {
          page,
          per_page,
          total: res.data.total || 0,
          pages: Math.max(1, Math.ceil((res.data.total || 0) / per_page)),
        },
        loading: false,
      });
    } catch (error) {
      set({
        products: [],
        loading: false,
        error: normalizeError(error, 'Falha ao carregar produtos.'),
      });
    }
  },

  fetchProduct: async (id) => {
    set({ selectedProduct: null, loading: true, error: '' });
    try {
      const res = await api.get(`/products/${id}`);
      set({ selectedProduct: res.data.product, loading: false });
    } catch (error) {
      set({
        selectedProduct: null,
        loading: false,
        error: normalizeError(error, 'Produto não encontrado.'),
      });
    }
  },

  fetchStores: async (params = {}) => {
    set({ loading: true, error: '' });
    try {
      const res = await api.get('/stores', { params });
      set({ stores: res.data.stores || [], loading: false });
    } catch (error) {
      set({
        stores: [],
        loading: false,
        error: normalizeError(error, 'Falha ao carregar lojas.'),
      });
    }
  },
}));

export default useProductStore;
