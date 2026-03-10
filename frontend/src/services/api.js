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
export const fetchProducts = () => API.get('/products');
export const fetchProductBySlug = (slug) => API.get(`/products/${slug}`);
export const fetchProductById = (id) => API.get(`/products/id/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const createProductReview = (id, data) => API.post(`/products/${id}/reviews`, data);


// Orders
export const fetchOrders = () => API.get('/orders');
export const fetchOrderById = (id) => API.get(`/orders/${id}`);
export const createOrder = (data) => API.post('/orders', data);
export const deliverOrder = (id) => API.put(`/orders/${id}/deliver`);
export const deleteOrder = (id) => API.delete(`/orders/${id}`);
export const initiatePhonePe = (data) => API.post('/payment/phonepe/initiate', data);



// Coupons
export const fetchCoupons = () => API.get('/coupons');
export const createCoupon = (data) => API.post('/coupons', data);
export const deleteCoupon = (id) => API.delete(`/coupons/${id}`);
export const validateCoupon = (data) => API.post('/coupons/validate', data);



// Config
export const fetchConfigs = () => API.get('/config');
export const saveConfig = (data) => API.post('/config', data);

// User
export const login = (data) => API.post('/users/login', data);

export const register = (data) => API.post('/users', data);
export const fetchUsers = () => API.get('/users');

export default API;


