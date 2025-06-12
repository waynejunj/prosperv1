import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://prosperv21.pythonanywhere.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No token found in localStorage');
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

// Add response interceptor to handle errors
api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    window.location.href = '/signin'; // Redirect to login
  }
  return Promise.reject(error);
});


export const getFeaturedProducts = async () => {
  const response = await api.get('/api/products?featured=true&limit=8');
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get('/api/products');
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/api/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/api/products/${id}`, productData);
  return response.data;
};

const API_URL = 'https://prosperv21.pythonanywhere.com/api';

export const deleteProduct = async (productId) => {
  const token = localStorage.getItem('token');
  console.log(token)
  const response = await axios.delete(`${API_URL}/products/${productId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/api/orders');
  return response.data;
};

export const getOrder = async (id) => {
  const response = await api.get(`/api/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/api/orders/${id}/status`, { status });
  return response.data;
};

export const getUsers = async () => {
  try {
    const response = await axios.get('https://prosperv21.pythonanywhere.com/api/users')
    return response.data;
  } catch (err) {
    console.error('Error details:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    throw err;
  }
};
export const updateUser  = async (id, userData) => {
  const response = await api.put(`/api/users/${id}`, userData);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/api/dashboard/stats');
  return response.data;
};

// Add to your api.js
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized (redirect to login)
      window.location = '/signin';
    } else if (error.response?.status === 403) {
      // Don't redirect for 403, just reject
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;

