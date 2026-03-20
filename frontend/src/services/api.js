import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

// Products
export const fetchProducts = (params = {}) => API.get('/products', { params });
export const fetchProductBySlug = (slug) => API.get(`/products/${slug}`);
export const fetchProductById = (id) => API.get(`/products/id/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const createProductReview = (id, data) => API.post(`/products/${id}/reviews`, data);
export const fetchDistinctValues = () => API.get('/products/distinct');
export const createCategoryMeta = (data) => API.post('/products/extras/category', data);

// Orders
export const fetchMyOrders = () => API.get('/orders/myorders');
export const fetchOrders = () => API.get('/orders');
export const fetchOrderById = (id) => API.get(`/orders/${id}`);
export const fetchDashboardStats = () => API.get('/orders/stats');
export const createOrder = (data) => API.post('/orders', data);
export const deliverOrder = (id) => API.put(`/orders/${id}/deliver`);
export const deleteOrder = (id) => API.delete(`/orders/${id}`);
export const initiatePhonePe = (data) => API.post('/payment/phonepe/initiate', data);
export const checkPhonePeStatus = (id) => API.get(`/payment/phonepe/status/${id}`);

// Coupons
export const fetchCoupons = () => API.get('/coupons');
export const createCoupon = (data) => API.post('/coupons', data);
export const deleteCoupon = (id) => API.delete(`/coupons/${id}`);
export const validateCoupon = (data) => API.post('/coupons/validate', data);

// Config
export const fetchConfigs = () => API.get('/config');
export const saveConfig = (data) => API.post('/config', data);
export const sendContact = (data) => API.post('/contact', data);
export const uploadImage = (formData) => API.post('/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// User
export const login = (data) => API.post('/users/login', data);
export const register = (data) => API.post('/users', data);
export const forgotPassword = (data) => API.post('/users/forgotpassword', data);
export const resetPassword = (token, data) => API.put(`/users/resetpassword/${token}`, data);
export const fetchUsers = () => API.get('/users');
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const updateUserRole = (id, data) => API.put(`/users/${id}`, data);

export default API;