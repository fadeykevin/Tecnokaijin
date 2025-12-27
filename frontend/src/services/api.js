import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Crear instancia de axios con configuración mejorada
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 segundos de timeout
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 Request:', config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      // Token expirado o inválido
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  register: async (userData) => {
    try {
      console.log('📝 Intentando registrar usuario:', { 
        name: userData.name, 
        email: userData.email 
      });

      const response = await api.post('/auth/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword
      });

      console.log('✅ Registro exitoso:', response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      console.error('❌ Error en registro:', error.response?.data || error.message);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      console.log('🔐 Intentando login:', { email: credentials.email });

      const response = await api.post('/auth/login', credentials);

      console.log('✅ Login exitoso:', response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('❌ Error en login:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: () => {
    console.log('👋 Cerrando sesión');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'admin';
  }
};

// Servicios de productos
export const productService = {
  // Obtener todos los productos con filtros opcionales
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.minPrice) {
        params.append('minPrice', filters.minPrice);
      }
      if (filters.maxPrice) {
        params.append('maxPrice', filters.maxPrice);
      }

      const queryString = params.toString();
      const url = queryString ? `/products?${queryString}` : '/products';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  // Obtener producto por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  },

  // Crear producto (admin)
  create: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  // Actualizar producto (admin)
  update: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  // Eliminar producto (admin)
  delete: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }
};

// Servicios de pedidos
export const orderService = {
  create: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error;
    }
  },

  getMyOrders: async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('Usuario no autenticado');
      
      const response = await api.get(`/orders/my-orders/${user.id}`);
      return response.data.orders || [];
    } catch (error) {
      console.error('Error al obtener mis órdenes:', error);
      throw error;
    }
  },

  getAll: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Error al obtener todas las órdenes:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener orden:', error);
      throw error;
    }
  },

  updateStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  },

  cancel: async (orderId) => {
    try {
      const response = await api.patch(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error al cancelar orden:', error);
      throw error;
    }
  }
};

// Servicios del carrito (localStorage)
export const cartService = {
  getCart: () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },

  addToCart: (product, quantity = 1) => {
    const cart = cartService.getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    return cart;
  },

  removeFromCart: (productId) => {
    let cart = cartService.getCart();
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    return cart;
  },

  updateQuantity: (productId, quantity) => {
    const cart = cartService.getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        return cartService.removeFromCart(productId);
      }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    return cart;
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
    return [];
  },

  getTotal: () => {
    const cart = cartService.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getItemCount: () => {
    const cart = cartService.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  }
};

// Utilidades
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(price);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

// Verificar conexión con el backend
export const checkBackendConnection = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log('✅ Backend conectado:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Backend no disponible:', error.message);
    return false;
  }
};

export default api;