import React, { useState, useEffect } from 'react';
import { orderService } from '../services/api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      console.log('📦 Pedidos cargados:', data);
      setOrders(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error('❌ Error al cargar pedidos:', error);
      setError('No se pudieron cargar los pedidos. Inténtalo de nuevo.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: '⏳ Pendiente', class: 'badge-warning' },
      processing: { text: '⚙️ Procesando', class: 'badge-info' },
      shipped: { text: '🚚 Enviado', class: 'badge-primary' },
      delivered: { text: '✅ Entregado', class: 'badge-success' },
      cancelled: { text: '❌ Cancelado', class: 'badge-danger' }
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando pedidos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>Error al cargar pedidos</h2>
            <p>{error}</p>
            <button onClick={loadOrders} className="btn btn-primary">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="page-title">Mis Pedidos ({orders.length})</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h2>No tienes pedidos aún</h2>
            <p>Cuando realices una compra, aparecerá aquí</p>
            <a href="/products" className="btn btn-primary">
              Ir a Comprar
            </a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              // ✅ Protección contra datos undefined
              if (!order) return null;
              
              const badge = getStatusBadge(order.status);
              const items = Array.isArray(order.items) ? order.items : [];
              const shipping = order.shippingAddress || {};
              
              return (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Pedido #{order.orderNumber || order.id || 'N/A'}</h3>
                      <p className="order-date">
                        📅 {order.createdAt 
                          ? new Date(order.createdAt).toLocaleDateString('es-CL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Fecha no disponible'
                        }
                      </p>
                    </div>
                    <span className={`badge ${badge.class}`}>
                      {badge.text}
                    </span>
                  </div>

                  {/* Items del pedido */}
                  {items.length > 0 && (
                    <div className="order-items">
                      {items.map((item, index) => {
                        const product = item.product || {};
                        return (
                          <div key={index} className="order-item">
                            <img 
                              src={product.image || '/placeholder.png'} 
                              alt={product.name || 'Producto'} 
                              onError={(e) => e.target.src = '/placeholder.png'}
                            />
                            <div className="order-item-info">
                              <p className="order-item-name">
                                {product.name || 'Producto no disponible'}
                              </p>
                              <p className="order-item-quantity">
                                Cantidad: {item.quantity || 1}
                              </p>
                            </div>
                            <p className="order-item-price">
                              ${((item.price || 0) * (item.quantity || 1)).toLocaleString('es-CL')}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="order-footer">
                    {/* Dirección de envío */}
                    <div className="order-shipping">
                      <h4>📍 Dirección de Envío</h4>
                      {shipping.fullName && <p><strong>{shipping.fullName}</strong></p>}
                      {shipping.address && <p>{shipping.address}</p>}
                      {(shipping.city || shipping.region) && (
                        <p>
                          {shipping.city ? `${shipping.city}` : ''}
                          {shipping.city && shipping.region ? ', ' : ''}
                          {shipping.region || ''}
                        </p>
                      )}
                      {shipping.phone && <p>📱 {shipping.phone}</p>}
                      {!shipping.fullName && !shipping.address && (
                        <p className="text-muted">Información no disponible</p>
                      )}
                    </div>

                    {/* Total del pedido */}
                    <div className="order-total">
                      <h4>Total Pagado</h4>
                      <p className="total-amount">
                        ${(order.total || 0).toLocaleString('es-CL')}
                      </p>
                      {order.paymentMethod && (
                        <p className="payment-method">
                          💳 {order.paymentMethod === 'webpay' 
                            ? 'Webpay Plus' 
                            : order.paymentMethod === 'transfer'
                            ? 'Transferencia'
                            : order.paymentMethod
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;