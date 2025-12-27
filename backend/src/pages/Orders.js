import React, { useState, useEffect } from 'react';
import { orderService } from '../services/api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pendiente', class: 'badge-warning' },
      processing: { text: 'Procesando', class: 'badge-info' },
      shipped: { text: 'Enviado', class: 'badge-primary' },
      delivered: { text: 'Entregado', class: 'badge-success' },
      cancelled: { text: 'Cancelado', class: 'badge-danger' }
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

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="page-title">Mis Pedidos</h1>

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
              const badge = getStatusBadge(order.status);
              return (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Pedido #{order.orderNumber}</h3>
                      <p className="order-date">
                        📅 {new Date(order.createdAt).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                    <span className={`badge ${badge.class}`}>
                      {badge.text}
                    </span>
                  </div>

                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <img src={item.product?.image || '/placeholder.png'} alt={item.product?.name} />
                        <div className="order-item-info">
                          <p className="order-item-name">{item.product?.name}</p>
                          <p className="order-item-quantity">Cantidad: {item.quantity}</p>
                        </div>
                        <p className="order-item-price">
                          ${(item.price * item.quantity).toLocaleString('es-CL')}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="order-shipping">
                      <h4>📍 Dirección de Envío</h4>
                      <p>{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.region}</p>
                      <p>📱 {order.shippingAddress.phone}</p>
                    </div>
                    <div className="order-total">
                      <h4>Total Pagado</h4>
                      <p className="total-amount">${order.total.toLocaleString('es-CL')}</p>
                      <p className="payment-method">
                        💳 {order.paymentMethod === 'webpay' ? 'Webpay Plus' : 'Transferencia'}
                      </p>
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