import React, { useState, useEffect } from 'react';
import { productService, orderService } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'celulares',
    stock: '',
    description: '',
    specs: '',
    image: ''
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const data = await productService.getAll();
        setProducts(data);
      } else if (activeTab === 'orders') {
        const data = await orderService.getAll();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      showNotification('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Vista previa de imagen
    if (name === 'image') {
      setImagePreview(value);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description || '',
      specs: product.specs || '',
      image: product.image
    });
    setImagePreview(product.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.name || !formData.price || !formData.stock || !formData.image) {
      showNotification('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock)
        });
        showNotification('✅ Producto actualizado exitosamente', 'success');
      } else {
        await productService.create({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock)
        });
        showNotification('✅ Producto creado exitosamente', 'success');
      }
      resetForm();
      loadData();
    } catch (error) {
      showNotification('❌ Error: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      category: 'celulares',
      stock: '',
      description: '',
      specs: '',
      image: ''
    });
    setImagePreview('');
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await productService.delete(id);
      showNotification('✅ Producto eliminado exitosamente', 'success');
      loadData();
    } catch (error) {
      showNotification('❌ Error al eliminar producto', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      showNotification('✅ Estado actualizado correctamente', 'success');
      loadData();
    } catch (error) {
      showNotification('❌ Error al actualizar estado', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pendiente', class: 'status-pending' },
      processing: { text: 'Procesando', class: 'status-processing' },
      shipped: { text: 'Enviado', class: 'status-shipped' },
      delivered: { text: 'Entregado', class: 'status-delivered' },
      cancelled: { text: 'Cancelado', class: 'status-cancelled' }
    };
    return badges[status] || badges.pending;
  };

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="container">
        {/* Notificación flotante */}
        {notification.show && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        <div className="admin-header">
          <h1 className="page-title">🛡️ Panel de Administración</h1>
          <p className="page-subtitle">Gestiona tu inventario y pedidos</p>
        </div>
        
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <span className="tab-icon">📦</span>
            <span>Productos</span>
            <span className="tab-badge">{products.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="tab-icon">🛒</span>
            <span>Pedidos</span>
            <span className="tab-badge">{orders.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <span className="tab-icon">📊</span>
            <span>Estadísticas</span>
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando datos...</p>
          </div>
        ) : (
          <>
            {/* TAB DE PRODUCTOS */}
            {activeTab === 'products' && (
              <div className="admin-content">
                <div className="admin-section">
                  <div className="section-header">
                    <h2>
                      {editingProduct ? '✏️ Editar Producto' : '➕ Agregar Nuevo Producto'}
                    </h2>
                    {editingProduct && (
                      <button onClick={resetForm} className="btn-reset">
                        ❌ Cancelar edición
                      </button>
                    )}
                  </div>
                  
                  <form onSubmit={handleSaveProduct} className="admin-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Nombre del Producto *</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Ej: iPhone 15 Pro Max"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Categoría *</label>
                        <select
                          name="category"
                          className="form-control"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="celulares">📱 Celulares</option>
                          <option value="notebooks">💻 Notebooks</option>
                          <option value="tablets">📱 Tablets</option>
                          <option value="accesorios">🎧 Accesorios</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Precio (CLP) *</label>
                        <input
                          type="number"
                          name="price"
                          className="form-control"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="599990"
                          min="0"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Stock Disponible *</label>
                        <input
                          type="number"
                          name="stock"
                          className="form-control"
                          value={formData.stock}
                          onChange={handleInputChange}
                          placeholder="50"
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>URL de Imagen *</label>
                      <input
                        type="url"
                        name="image"
                        className="form-control"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        required
                      />
                      {imagePreview && (
                        <div className="image-preview-container">
                          <p className="preview-label">Vista previa:</p>
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="image-preview"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150?text=Error';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Descripción del Producto</label>
                      <textarea
                        name="description"
                        className="form-control"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe las características principales del producto..."
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label>Especificaciones Técnicas</label>
                      <textarea
                        name="specs"
                        className="form-control"
                        value={formData.specs}
                        onChange={handleInputChange}
                        placeholder="Pantalla: 6.7 pulgadas&#10;Procesador: A17 Pro&#10;RAM: 8GB..."
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">
                        {editingProduct ? '💾 Actualizar Producto' : '✨ Crear Producto'}
                      </button>
                      {editingProduct && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={resetForm}
                        >
                          ❌ Cancelar
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="admin-section">
                  <div className="section-header-with-search">
                    <h2>📦 Lista de Productos ({filteredProducts.length})</h2>
                    <div className="search-box">
                      <input
                        type="text"
                        placeholder="🔍 Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                    </div>
                  </div>
                  
                  <div className="admin-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Imagen</th>
                          <th>Nombre</th>
                          <th>Categoría</th>
                          <th>Precio</th>
                          <th>Stock</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="no-data">
                              {searchTerm ? '🔍 No se encontraron productos' : '📦 No hay productos registrados'}
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map(product => (
                            <tr key={product.id} className="table-row-hover">
                              <td>
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="table-image"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/60?text=Sin+Imagen';
                                  }}
                                />
                              </td>
                              <td className="product-name">{product.name}</td>
                              <td>
                                <span className="category-badge">{product.category}</span>
                              </td>
                              <td className="product-price">${product.price.toLocaleString('es-CL')}</td>
                              <td>
                                <span className={`stock-badge ${product.stock < 10 ? 'stock-low' : 'stock-ok'}`}>
                                  {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'}
                                </span>
                              </td>
                              <td className="table-actions">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="btn btn-small btn-edit"
                                  title="Editar producto"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="btn btn-small btn-danger"
                                  title="Eliminar producto"
                                >
                                  🗑️
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB DE PEDIDOS */}
            {activeTab === 'orders' && (
              <div className="admin-content">
                <div className="admin-section">
                  <h2>🛒 Gestión de Pedidos ({orders.length})</h2>
                  <div className="orders-admin-list">
                    {orders.length === 0 ? (
                      <div className="no-data-card">
                        <p>📭 No hay pedidos registrados</p>
                      </div>
                    ) : (
                      orders.map(order => (
                        <div key={order.id} className="order-admin-card">
                          <div className="order-admin-header">
                            <div>
                              <h3>Pedido #{order.orderNumber}</h3>
                              <p>👤 Cliente: <strong>{order.user?.name}</strong></p>
                              <p>📅 Fecha: {new Date(order.createdAt).toLocaleDateString('es-CL', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}</p>
                            </div>
                            <div className="order-admin-total">
                              ${order.total.toLocaleString('es-CL')}
                            </div>
                          </div>

                          <div className="order-admin-status">
                            <label>Estado del pedido:</label>
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className={`status-select ${getStatusBadge(order.status).class}`}
                            >
                              <option value="pending">⏳ Pendiente</option>
                              <option value="processing">⚙️ Procesando</option>
                              <option value="shipped">🚚 Enviado</option>
                              <option value="delivered">✅ Entregado</option>
                              <option value="cancelled">❌ Cancelado</option>
                            </select>
                          </div>

                          <div className="order-admin-items">
                            <strong>📦 Productos del pedido:</strong>
                            <ul>
                              {order.items.map((item, index) => (
                                <li key={index}>
                                  <span className="item-name">{item.product?.name}</span>
                                  <span className="item-quantity">x{item.quantity}</span>
                                  <span className="item-price">${(item.price * item.quantity).toLocaleString('es-CL')}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB DE ESTADÍSTICAS */}
            {activeTab === 'stats' && (
              <div className="admin-content">
                <div className="admin-section">
                  <h2>📊 Estadísticas del Negocio</h2>
                  <div className="stats-grid">
                    <div className="stat-card stat-products">
                      <div className="stat-icon">📦</div>
                      <div className="stat-info">
                        <h3>{products.length}</h3>
                        <p>Productos Totales</p>
                        <span className="stat-detail">
                          {products.filter(p => p.stock > 0).length} disponibles
                        </span>
                      </div>
                    </div>

                    <div className="stat-card stat-orders">
                      <div className="stat-icon">🛒</div>
                      <div className="stat-info">
                        <h3>{orders.length}</h3>
                        <p>Pedidos Totales</p>
                        <span className="stat-detail">
                          {orders.filter(o => o.status === 'pending').length} pendientes
                        </span>
                      </div>
                    </div>

                    <div className="stat-card stat-revenue">
                      <div className="stat-icon">💰</div>
                      <div className="stat-info">
                        <h3>
                          ${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString('es-CL')}
                        </h3>
                        <p>Ventas Totales</p>
                        <span className="stat-detail">Ingresos acumulados</span>
                      </div>
                    </div>

                    <div className="stat-card stat-average">
                      <div className="stat-icon">📊</div>
                      <div className="stat-info">
                        <h3>
                          ${orders.length > 0 
                            ? Math.round(orders.reduce((sum, order) => sum + order.total, 0) / orders.length).toLocaleString('es-CL')
                            : 0}
                        </h3>
                        <p>Ticket Promedio</p>
                        <span className="stat-detail">Por pedido</span>
                      </div>
                    </div>
                  </div>

                  {/* Estadísticas adicionales */}
                  <div className="additional-stats">
                    <div className="stat-row">
                      <div className="stat-item">
                        <span className="stat-label">🏆 Producto más vendido:</span>
                        <span className="stat-value">Por implementar</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">📉 Stock bajo (menos de 10):</span>
                        <span className="stat-value stat-alert">
                          {products.filter(p => p.stock < 10 && p.stock > 0).length} productos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;