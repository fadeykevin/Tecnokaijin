import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    paymentMethod: 'webpay'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: getCartTotal(),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          region: formData.region,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod
      };

      await orderService.create(orderData);
      clearCart();
      alert('✅ ¡Pedido realizado con éxito!');
      navigate('/orders');
    } catch (error) {
      alert('❌ Error al procesar el pedido: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Finalizar Compra</h1>

        <div className="checkout-layout">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h3>📋 Información Personal</h3>
                <div className="form-group">
                  <label>Nombre Completo *</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Teléfono *</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>📍 Dirección de Envío</h3>
                <div className="form-group">
                  <label>Dirección *</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Calle, número, depto"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ciudad *</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Región *</label>
                    <select
                      name="region"
                      className="form-control"
                      value={formData.region}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="metropolitana">Región Metropolitana</option>
                      <option value="valparaiso">Valparaíso</option>
                      <option value="biobio">Biobío</option>
                      <option value="araucania">La Araucanía</option>
                      <option value="maule">Maule</option>
                      <option value="los-lagos">Los Lagos</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>💳 Método de Pago</h3>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="webpay"
                      checked={formData.paymentMethod === 'webpay'}
                      onChange={handleChange}
                    />
                    <span className="payment-label">
                      <strong>Webpay Plus</strong>
                      <small>Tarjetas de débito y crédito</small>
                    </span>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={formData.paymentMethod === 'transfer'}
                      onChange={handleChange}
                    />
                    <span className="payment-label">
                      <strong>Transferencia Bancaria</strong>
                      <small>Se enviará información por email</small>
                    </span>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-large btn-block"
                disabled={loading}
              >
                {loading ? 'Procesando...' : `Pagar $${getCartTotal().toLocaleString('es-CL')}`}
              </button>
            </form>
          </div>

          <div className="checkout-summary">
            <h3>Resumen del Pedido</h3>
            
            <div className="summary-items">
              {cart.map(item => (
                <div key={item.id} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="summary-item-info">
                    <p className="summary-item-name">{item.name}</p>
                    <p className="summary-item-quantity">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="summary-item-price">
                    ${(item.price * item.quantity).toLocaleString('es-CL')}
                  </p>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${getCartTotal().toLocaleString('es-CL')}</span>
            </div>

            <div className="summary-row">
              <span>Envío:</span>
              <span className="free-text">Gratis</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row summary-total">
              <span>Total:</span>
              <span>${getCartTotal().toLocaleString('es-CL')}</span>
            </div>

            <div className="security-badge">
              🔒 Pago 100% Seguro
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;