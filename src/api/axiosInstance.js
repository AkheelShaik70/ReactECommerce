import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Unable to reach the DummyJSON product catalog. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export const productApi = {
  getAllProducts: (limit = 24, skip = 0) =>
    axiosInstance.get(`/products?limit=${limit}&skip=${skip}`),
  getProductById: (id) =>
    axiosInstance.get(`/products/${id}`),
  searchProducts: (query) =>
    axiosInstance.get(`/products/search?q=${encodeURIComponent(query)}`),
  getCategoryList: () =>
    axiosInstance.get('/products/category-list'),
  getProductsByCategory: (categoryName) =>
    axiosInstance.get(`/products/category/${encodeURIComponent(categoryName)}`),
};

export default axiosInstance;
