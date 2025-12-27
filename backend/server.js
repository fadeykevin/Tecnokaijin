// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ==================== BASE DE DATOS SIMULADA ====================

// USUARIOS (con contraseñas encriptadas)
const users = [
  { 
    id: 1, 
    email: 'admin@tecnokaijin.cl',
    password: bcrypt.hashSync('admin123', 10),
    name: 'Administrador',
    role: 'admin',
    createdAt: new Date('2024-01-01')
  },
  { 
    id: 2, 
    email: 'user@tecnokaijin.cl',
    password: bcrypt.hashSync('user123', 10),
    name: 'Usuario Demo',
    role: 'user',
    createdAt: new Date('2024-01-15')
  }
];

let nextUserId = 3;

// PRODUCTOS
const products = [
  { 
    id: 1, 
    name: 'iPhone 15 Pro Max', 
    price: 1299990, 
    category: 'celulares', 
    image: 'https://images.unsplash.com/photo-1697723679729-42445f52bb9b?w=500&q=80',
    stock: 15,
    description: 'El smartphone más potente de Apple con chip A17 Pro',
    specs: 'Pantalla 6.7", A17 Pro, 8GB RAM, 256GB'
  },
  { 
    id: 2, 
    name: 'Samsung Galaxy S24 Ultra', 
    price: 1199990, 
    category: 'celulares', 
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80',
    stock: 20,
    description: 'Potencia Android con S Pen integrado',
    specs: 'Pantalla 6.8", Snapdragon 8 Gen 3, 12GB RAM'
  },
  { 
    id: 3, 
    name: 'MacBook Pro 16"', 
    price: 2499990, 
    category: 'notebooks', 
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
    stock: 8,
    description: 'Laptop profesional con chip M3 Max',
    specs: 'M3 Max, 16GB RAM, 512GB SSD, 16" Retina'
  },
  { 
    id: 4, 
    name: 'Sony WH-1000XM5', 
    price: 349990, 
    category: 'accesorios', 
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80',
    stock: 25,
    description: 'Auriculares con cancelación de ruido líder',
    specs: 'Bluetooth 5.2, 30h batería, ANC adaptativo'
  },
  { 
    id: 5, 
    name: 'iPad Pro 12.9"', 
    price: 1299990, 
    category: 'tablets', 
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
    stock: 18,
    description: 'Tablet profesional con chip M2',
    specs: 'M2, 8GB RAM, 256GB, ProMotion 120Hz'
  },
  { 
    id: 6, 
    name: 'Apple Watch Series 9', 
    price: 449990, 
    category: 'accesorios', 
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80',
    stock: 30,
    description: 'Smartwatch con GPS y monitor de salud',
    specs: 'GPS, Always-On, Resistente al agua, ECG'
  },
  { 
    id: 7, 
    name: 'PlayStation 5', 
    price: 599990, 
    category: 'accesorios', 
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80',
    stock: 12,
    description: 'Consola de nueva generación',
    specs: '825GB SSD, Ray Tracing, 4K 120fps'
  },
  { 
    id: 8, 
    name: 'Dell XPS 15', 
    price: 1899990, 
    category: 'notebooks', 
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80',
    stock: 10,
    description: 'Laptop premium con pantalla OLED',
    specs: 'Intel i7, 16GB RAM, 512GB SSD, OLED 4K'
  },
  { 
    id: 9, 
    name: 'AirPods Pro 2', 
    price: 279990, 
    category: 'accesorios', 
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500&q=80',
    stock: 35,
    description: 'Auriculares inalámbricos con ANC',
    specs: 'H2 chip, 6h batería, Cancelación activa'
  },
  { 
    id: 10, 
    name: 'Samsung Galaxy Tab S9', 
    price: 849990, 
    category: 'tablets', 
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80',
    stock: 14,
    description: 'Tablet Android premium con S Pen',
    specs: 'Snapdragon 8 Gen 2, 8GB RAM, 128GB'
  }
];

let nextProductId = 11;

// ÓRDENES
let orders = [
  {
    id: 1,
    orderNumber: 'ORD-001',
    userId: 1,
    user: { name: 'Administrador', email: 'admin@tecnokaijin.cl' },
    items: [
      { 
        productId: 1, 
        product: { name: 'iPhone 15 Pro Max' },
        quantity: 1, 
        price: 1299990 
      }
    ],
    total: 1299990,
    status: 'delivered',
    createdAt: new Date('2024-12-20')
  },
  {
    id: 2,
    orderNumber: 'ORD-002',
    userId: 2,
    user: { name: 'Usuario Demo', email: 'user@tecnokaijin.cl' },
    items: [
      { 
        productId: 4, 
        product: { name: 'Sony WH-1000XM5' },
        quantity: 1, 
        price: 349990 
      }
    ],
    total: 349990,
    status: 'pending',
    createdAt: new Date('2024-12-25')
  }
];

let nextOrderId = 3;

// ==================== FUNCIONES AUXILIARES ====================

const findUserByEmail = (email) => {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

const findUserById = (id) => {
  return users.find(u => u.id === parseInt(id));
};

const verifyPassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

// ==================== RUTAS DE AUTENTICACIÓN ====================

// REGISTRO DE USUARIOS
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    console.log('📝 Intento de registro:', { name, email });

    // Validaciones
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Las contraseñas no coinciden'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el email ya existe
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este email ya está registrado'
      });
    }

    // Crear nuevo usuario
    const newUser = {
      id: nextUserId++,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: bcrypt.hashSync(password, 10),
      role: 'user',
      createdAt: new Date()
    };

    users.push(newUser);

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = newUser;

    console.log('✅ Usuario registrado exitosamente:', userWithoutPassword.email);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword,
      token: 'demo-token-' + newUser.id
    });

  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario'
    });
  }
});

// LOGIN PRINCIPAL
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Intento de login:', { email });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    const user = findUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const isValidPassword = verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const { password: _, ...userWithoutPassword } = user;
    
    console.log('✅ Login exitoso:', userWithoutPassword.email);

    res.json({
      success: true,
      message: 'Login exitoso',
      user: userWithoutPassword,
      token: 'demo-token-' + user.id
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión'
    });
  }
});

// ==================== RUTAS DE PRODUCTOS ====================

// Obtener todos los productos
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Obtener un producto por ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

// Crear nuevo producto (admin)
app.post('/api/products', (req, res) => {
  try {
    const { name, price, category, stock, image, description, specs } = req.body;

    if (!name || !price || !category || !image) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos'
      });
    }

    const newProduct = {
      id: nextProductId++,
      name,
      price: Number(price),
      category,
      stock: Number(stock) || 0,
      image,
      description: description || '',
      specs: specs || ''
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al crear producto'
    });
  }
});

// Actualizar producto
app.put('/api/products/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === productId);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    const updatedProduct = {
      ...products[index],
      ...req.body,
      id: productId,
      price: Number(req.body.price),
      stock: Number(req.body.stock)
    };

    products[index] = updatedProduct;

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al actualizar producto'
    });
  }
});

// Eliminar producto
app.delete('/api/products/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === productId);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    products.splice(index, 1);

    res.json({
      success: true,
      message: 'Producto eliminado'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar producto'
    });
  }
});

// ==================== RUTAS DE ÓRDENES ====================

// Obtener todas las órdenes (admin)
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Obtener órdenes de un usuario
app.get('/api/orders/my-orders/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userOrders = orders.filter(o => o.userId === userId);
  
  res.json({
    success: true,
    orders: userOrders
  });
});

// Crear nueva orden
app.post('/api/orders', (req, res) => {
  try {
    const { userId, items, total } = req.body;
    
    const user = findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const newOrder = {
      id: nextOrderId++,
      orderNumber: `ORD-${String(nextOrderId - 1).padStart(3, '0')}`,
      userId,
      user: {
        name: user.name,
        email: user.email
      },
      items: items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          ...item,
          product: product ? { name: product.name } : null
        };
      }),
      total,
      status: 'pending',
      createdAt: new Date()
    };
    
    orders.push(newOrder);
    
    res.status(201).json({
      success: true,
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear orden'
    });
  }
});

// Actualizar estado de orden
app.put('/api/orders/:id/status', (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    order.status = status;

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar orden'
    });
  }
});

// ==================== RUTA RAÍZ ====================

app.get('/', (req, res) => {
  res.json({
    message: '🚀 TecnoKaiJin API - Backend Completo',
    version: '2.0.0',
    status: 'online',
    endpoints: {
      auth: [
        'POST /api/auth/register - Registro de usuarios',
        'POST /api/auth/login - Iniciar sesión'
      ],
      products: [
        'GET /api/products - Listar productos',
        'GET /api/products/:id - Ver producto',
        'POST /api/products - Crear producto',
        'PUT /api/products/:id - Actualizar producto',
        'DELETE /api/products/:id - Eliminar producto'
      ],
      orders: [
        'GET /api/orders - Todas las órdenes',
        'GET /api/orders/my-orders/:userId - Órdenes de usuario',
        'POST /api/orders - Crear orden',
        'PUT /api/orders/:id/status - Actualizar estado'
      ]
    },
    stats: {
      users: users.length,
      products: products.length,
      orders: orders.length
    },
    demoUsers: [
      { email: 'admin@tecnokaijin.cl', password: 'admin123', role: 'admin' },
      { email: 'user@tecnokaijin.cl', password: 'user123', role: 'user' }
    ]
  });
});

// ==================== INICIAR SERVIDOR ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 SERVIDOR BACKEND TECNOKAIJIN INICIADO');
  console.log('='.repeat(60));
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📦 API: http://localhost:${PORT}/api/products`);
  console.log(`👤 Usuarios registrados: ${users.length}`);
  console.log(`📦 Productos disponibles: ${products.length}`);
  console.log(`🛒 Órdenes totales: ${orders.length}`);
  console.log('\n🔐 Usuarios Demo:');
  console.log('   👑 Admin: admin@tecnokaijin.cl / admin123');
  console.log('   👤 User:  user@tecnokaijin.cl / user123');
  console.log('='.repeat(60) + '\n');
});