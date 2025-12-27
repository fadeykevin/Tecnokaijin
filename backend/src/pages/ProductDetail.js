import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await productService.getById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error al cargar producto:', error);
      alert('Producto no encontrado');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert(`✅ ${quantity} x ${product.name} agregado(s) al carrito`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando producto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Volver
        </button>

        <div className="product-detail-grid">
          <div className="product-detail-image">
            <img src={product.image} alt={product.name} />
            <div className="product-category-badge">{product.category}</div>
          </div>

          <div className="product-detail-info">
            <h1 className="product-detail-title">{product.name}</h1>
            
            <div className="product-detail-price">
              ${product.price.toLocaleString('es-CL')}
            </div>

            <div className="product-detail-stock">
              {product.stock > 0 ? (
                <span className="in-stock">✅ {product.stock} unidades disponibles</span>
              ) : (
                <span className="out-stock">❌ Sin stock</span>
              )}
            </div>

            <div className="product-detail-section">
              <h3>📋 Descripción</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-detail-section">
              <h3>⚙️ Especificaciones Técnicas</h3>
              <p>{product.specs}</p>
            </div>

            <div className="product-detail-section">
              <h3>✨ Características</h3>
              <ul className="features-list">
                {product.features?.map((feature, index) => (
                  <li key={index}>{feature}</li>
                )) || (
                  <>
                    <li>Garantía oficial del fabricante</li>
                    <li>Envío gratuito a todo Chile</li>
                    <li>Producto 100% original</li>
                    <li>Devolución sin costo en 30 días</li>
                  </>
                )}
              </ul>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <label>Cantidad:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="quantity-btn"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button
                  onClick={handleAddToCart}
                  className="btn btn-secondary btn-large"
                  disabled={product.stock === 0}
                >
                  🛒 Agregar al Carrito
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn btn-primary btn-large"
                  disabled={product.stock === 0}
                >
                  💳 Comprar Ahora
                </button>
              </div>
            </div>

            <div className="product-security">
              <div className="security-item">
                <span className="security-icon">🔒</span>
                <span>Pago 100% Seguro</span>
              </div>
              <div className="security-item">
                <span className="security-icon">🚚</span>
                <span>Envío Gratis</span>
              </div>
              <div className="security-item">
                <span className="security-icon">↩️</span>
                <span>Devolución Gratis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;