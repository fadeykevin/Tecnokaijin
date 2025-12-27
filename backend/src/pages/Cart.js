import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { authService } from '../services/api';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    const user = authService.getCurrentUser();
    if (!user) {
      alert('Debes iniciar sesión para continuar con la compra');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Tu carrito está vacío</h2>
            <p>¡Agrega productos para comenzar tu compra!</p>
            <Link to="/products" className="btn btn-primary">
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Carrito de Compras</h1>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cart-item-specs">{item.specs}</p>
                  <p className="cart-item-price">
                    ${item.price.toLocaleString('es-CL')}
                  </p>
                </div>

                <div className="cart-item-quantity">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  <p className="item-total">
                    ${(item.price * item.quantity).toLocaleString('es-CL')}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="btn-remove"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Resumen de Compra</h3>
            
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${getCartTotal().toLocaleString('es-CL')}</span>
            </div>
            
            <div className="summary-row">
              <span>Envío:</span>
              <span className="free-shipping">Gratis</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row summary-total">
              <span>Total:</span>
              <span>${getCartTotal().toLocaleString('es-CL')}</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="btn btn-primary btn-block"
            >
              Proceder al Pago
            </button>

            <button 
              onClick={clearCart}
              className="btn btn-secondary btn-block"
            >
              Vaciar Carrito
            </button>

            <Link to="/products" className="continue-shopping">
              ← Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;