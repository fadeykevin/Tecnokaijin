import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const products = await productService.getAll();
      setFeaturedProducts(products.slice(0, 4));
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`✅ ${product.name} agregado al carrito`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Bienvenido a <span className="brand-name">TecnoKaijin</span>
          </h1>
          <p className="hero-subtitle">
            La mejor tecnología al alcance de tus manos. Productos originales, garantía oficial y envío gratis.
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary btn-large">
              Ver Catálogo
            </Link>
            <Link to="/register" className="btn btn-secondary btn-large">
              Crear Cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Envío Gratis</h3>
              <p>En todas tus compras a todo Chile</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Pago Seguro</h3>
              <p>Protegemos tus datos con tecnología SSL</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Garantía Oficial</h3>
              <p>Todos nuestros productos son originales</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Múltiples Pagos</h3>
              <p>Tarjetas, transferencias y más</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Productos Destacados</h2>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    <div className="product-badge">{product.category}</div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-specs">{product.specs}</p>
                    <div className="product-footer">
                      <span className="product-price">
                        ${product.price.toLocaleString('es-CL')}
                      </span>
                      <div className="product-actions">
                        <Link 
                          to={`/products/${product.id}`} 
                          className="btn btn-secondary btn-small"
                        >
                          Ver Más
                        </Link>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="btn btn-primary btn-small"
                        >
                          🛒
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="view-all">
            <Link to="/products" className="btn btn-primary btn-large">
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2 className="section-title">Explora por Categorías</h2>
          <div className="categories-grid">
            <Link to="/products?category=celulares" className="category-card">
              <div className="category-icon">📱</div>
              <h3>Celulares</h3>
              <p>Los últimos modelos</p>
            </Link>
            <Link to="/products?category=notebooks" className="category-card">
              <div className="category-icon">💻</div>
              <h3>Notebooks</h3>
              <p>Potencia y portabilidad</p>
            </Link>
            <Link to="/products?category=tablets" className="category-card">
              <div className="category-icon">📲</div>
              <h3>Tablets</h3>
              <p>Versatilidad máxima</p>
            </Link>
            <Link to="/products?category=accesorios" className="category-card">
              <div className="category-icon">🎧</div>
              <h3>Accesorios</h3>
              <p>Complementa tu equipo</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;