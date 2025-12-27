import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});

  const { addToCart, cart } = useCart();

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error al cargar productos:', err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    console.log('🛒 Agregando al carrito:', product.name);
    
    // Verificar stock
    if (product.stock <= 0) {
      showNotification('❌ Sin stock disponible', 'error');
      return;
    }

    // Verificar cantidad en carrito
    const itemInCart = cart.find(item => item.id === product.id);
    const currentQuantity = itemInCart ? itemInCart.quantity : 0;
    
    if (currentQuantity >= product.stock) {
      showNotification('⚠️ Stock máximo alcanzado', 'warning');
      return;
    }

    // Mostrar estado de carga
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));

    // Agregar al carrito
    setTimeout(() => {
      addToCart(product);
      showNotification(`✅ ${product.name} agregado al carrito`, 'success');
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }, 300);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return <span className="stock-badge no-stock">Sin stock</span>;
    if (stock < 10) return <span className="stock-badge low-stock">Quedan {stock}</span>;
    return null;
  };

  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  if (loading) {
    return (
      <div className="products-page container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page container">
      {/* Notificaciones */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="products-header">
        <h1>Productos ({products.length})</h1>
        {cart.length > 0 && (
          <div className="cart-summary">
            🛒 {cart.reduce((sum, item) => sum + item.quantity, 0)} items en el carrito
          </div>
        )}
      </div>

      <div className="products-grid">
        {products.map(product => {
          const inCart = isInCart(product.id);
          const isAdding = addingToCart[product.id];
          
          return (
            <div className="product-card" key={product.id}>
              <div className="image-wrapper">
                <img src={product.image} alt={product.name} />
                {getStockBadge(product.stock)}
                {inCart && <span className="in-cart-badge">En carrito ✓</span>}
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-description">{product.description}</p>

                <div className="card-footer">
                  <strong className="product-price">
                    ${product.price.toLocaleString('es-CL')}
                  </strong>

                  <div className="product-actions">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`btn-cart ${product.stock === 0 ? 'disabled' : ''} ${isAdding ? 'adding' : ''}`}
                      disabled={product.stock === 0 || isAdding}
                      title={product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                    >
                      {isAdding ? '⏳' : '🛒'}
                    </button>

                    <Link 
                      to={`/products/${product.id}`} 
                      className="btn btn-view"
                    >
                      Ver
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;