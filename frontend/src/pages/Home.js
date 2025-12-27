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
          <div className="categories-header">
            <h2 className="section-title">
              Explora por Categorías
              <span className="categories-title-accent"></span>
            </h2>
            <p className="categories-subtitle">
              Descubre nuestra selección de productos tecnológicos
            </p>
          </div>

          <div className="categories-grid">
            <Link to="/products?category=celulares" className="category-card category-blue">
              <div className="category-card-inner">
                <div className="category-icon-wrapper">
                  <div className="category-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                      <line x1="12" y1="18" x2="12.01" y2="18"/>
                    </svg>
                  </div>
                  <div className="category-icon-bg"></div>
                </div>
                
                <div className="category-content">
                  <h3 className="category-name">Celulares</h3>
                  <p className="category-description">Los últimos modelos</p>
                </div>

                <div className="category-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>

                <div className="category-shine"></div>
              </div>
            </Link>

            <Link to="/products?category=notebooks" className="category-card category-purple">
              <div className="category-card-inner">
                <div className="category-icon-wrapper">
                  <div className="category-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="2" y1="20" x2="22" y2="20"/>
                    </svg>
                  </div>
                  <div className="category-icon-bg"></div>
                </div>
                
                <div className="category-content">
                  <h3 className="category-name">Notebooks</h3>
                  <p className="category-description">Potencia y portabilidad</p>
                </div>

                <div className="category-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>

                <div className="category-shine"></div>
              </div>
            </Link>

            <Link to="/products?category=tablets" className="category-card category-orange">
              <div className="category-card-inner">
                <div className="category-icon-wrapper">
                  <div className="category-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                      <line x1="12" y1="18" x2="12.01" y2="18"/>
                    </svg>
                  </div>
                  <div className="category-icon-bg"></div>
                </div>
                
                <div className="category-content">
                  <h3 className="category-name">Tablets</h3>
                  <p className="category-description">Versatilidad máxima</p>
                </div>

                <div className="category-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>

                <div className="category-shine"></div>
              </div>
            </Link>

            <Link to="/products?category=accesorios" className="category-card category-green">
              <div className="category-card-inner">
                <div className="category-icon-wrapper">
                  <div className="category-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                    </svg>
                  </div>
                  <div className="category-icon-bg"></div>
                </div>
                
                <div className="category-content">
                  <h3 className="category-name">Accesorios</h3>
                  <p className="category-description">Complementa tu equipo</p>
                </div>

                <div className="category-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>

                <div className="category-shine"></div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;