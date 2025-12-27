const fs = require('fs');

console.log('📄 Creando todas las páginas...\n');

const pages = {
  'src/pages/Login.js': `import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(formData);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Iniciar Sesión</h1>
          <p className="auth-subtitle">Bienvenido de vuelta a TecnoKaijin</p>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
              />
            </div>
            
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
            <p className="demo-info">
              🎯 <strong>Demo:</strong> admin@tecnokaijin.cl / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;`,

  'src/pages/Register.js': `import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await authService.register({ name: formData.name, email: formData.email, password: formData.password });
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Crear Cuenta</h1>
          <p className="auth-subtitle">Únete a TecnoKaijin hoy</p>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Nombre Completo</label>
              <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required minLength="6" />
            </div>
            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;`,

  'src/pages/Auth.css': `.auth-page {
  min-height: calc(100vh - 150px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.auth-container {
  width: 100%;
  max-width: 450px;
}
.auth-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
.auth-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
  text-align: center;
}
.auth-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 30px;
  text-align: center;
}
.auth-form {
  margin-bottom: 20px;
}
.auth-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}
.auth-footer p {
  margin: 10px 0;
  color: #6b7280;
}
.auth-footer a {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}
.auth-footer a:hover {
  text-decoration: underline;
}
.demo-info {
  background: #fef3c7;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  color: #92400e;
}`,

  'src/pages/Products.js': `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: 'todas', search: '', minPrice: '', maxPrice: '' });
  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll(filters.category !== 'todas' ? { category: filters.category, search: filters.search, minPrice: filters.minPrice, maxPrice: filters.maxPrice } : { search: filters.search, minPrice: filters.minPrice, maxPrice: filters.maxPrice });
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(\`✅ \${product.name} agregado al carrito\`);
  };

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">Catálogo de Productos</h1>
        
        <div className="filters-section">
          <div className="filter-group">
            <label>Categoría:</label>
            <select className="form-control" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              <option value="todas">Todas</option>
              <option value="celulares">Celulares</option>
              <option value="notebooks">Notebooks</option>
              <option value="tablets">Tablets</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Buscar:</label>
            <input type="text" className="form-control" placeholder="Nombre del producto..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          </div>
          <div className="filter-group">
            <label>Precio Mín:</label>
            <input type="number" className="form-control" placeholder="$0" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
          </div>
          <div className="filter-group">
            <label>Precio Máx:</label>
            <input type="number" className="form-control" placeholder="$9999999" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
          </div>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"></div><p>Cargando productos...</p></div>
        ) : products.length === 0 ? (
          <div className="no-results"><h3>No se encontraron productos</h3><p>Intenta con otros filtros</p></div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-badge">{product.category}</div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-specs">{product.specs}</p>
                  <p className="product-stock">Stock: {product.stock} unidades</p>
                  <div className="product-footer">
                    <span className="product-price">\${product.price.toLocaleString('es-CL')}</span>
                    <div className="product-actions">
                      <Link to={\`/products/\${product.id}\`} className="btn btn-secondary btn-small">Ver</Link>
                      <button onClick={() => handleAddToCart(product)} className="btn btn-primary btn-small">🛒</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;`,

  'src/pages/Products.css': `.products-page {
  padding: 40px 0;
}
.page-title {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 30px;
  text-align: center;
}
.filters-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
.filter-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #1f2937;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}
.product-stock {
  font-size: 14px;
  color: #10b981;
  font-weight: 500;
  margin-bottom: 10px;
}
.no-results {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}
.no-results h3 {
  font-size: 24px;
  color: #1f2937;
  margin-bottom: 10px;
}
.no-results p {
  color: #6b7280;
}`
};

let count = 0;
Object.entries(pages).forEach(([filepath, content]) => {
  fs.writeFileSync(filepath, content);
  count++;
  console.log(\`✅ (\${count}/\${Object.keys(pages).length}) \${filepath}\`);
});

console.log(\`\n✨ \${count} páginas creadas!\n\`);
console.log('🎯 Próximo paso: node create-more-pages.js\n');