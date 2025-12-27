import React, { useState, useEffect } from 'react';
import { productService, orderService } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
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
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock)
        });
        alert('✅ Producto actualizado');
      } else {
        await productService.create({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock)
        });
        alert('✅ Producto creado');
      }
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
      loadData();
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await productService.delete(id);
      alert('✅ Producto eliminado');
      loadData();
    } catch (error) {
      alert('❌ Error al eliminar producto');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      alert('✅ Estado actualizado');
      loadData();
    } catch (error) {
      alert('❌ Error al actualizar estado');
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <h1 className="page-title">🛡️ Panel de Administración</h1>
        
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            📦 Productos
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            🛒 Pedidos
          </button>
          <button
            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Estadísticas
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando...</p>
          </div>
        ) : (
          <>
            {activeTab === 'products' && (
              <div className="admin-content">
                <div className="admin-section">
                  <h2>{editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
                  <form onSubmit={handleSaveProduct} className="admin-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Nombre *</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={formData.name}
                          onChange={handleInputChange}
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
                          <option value="celulares">Celulares</option>
                          <option value="notebooks">Notebooks</option>
                          <option value="tablets">Tablets</option>
                          <option value="accesorios">Accesorios</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Precio *</label>
                        <input
                          type="number"
                          name="price"
                          className="form-control"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Stock *</label>
                        <input
                          type="number"
                          name="stock"
                          className="form-control"
                          value={formData.stock}
                          onChange={handleInputChange}
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
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Descripción</label>
                      <textarea
                        name="description"
                        className="form-control"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label>Especificaciones</label>
                      <textarea
                        name="specs"
                        className="form-control"
                        value={formData.specs}
                        onChange={handleInputChange}
                        rows="2"
                      ></textarea>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">
                        {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
                      </button>
                      {editingProduct && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
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
                          }}
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="admin-section">
                  <h2>Lista de Productos ({products.length})</h2>
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
                        {products.map(product => (
                          <tr key={product.id}>
                            <td>
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="table-image"
                              />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>${product.price.toLocaleString('es-CL')}</td>
                            <td>{product.stock}</td>
                            <td className="table-actions">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="btn btn-small btn-secondary"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="btn btn-small btn-danger"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="admin-content">
                <h2>Gestión de Pedidos ({orders.length})</h2>
                <div className="orders-admin-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-admin-card">
                      <div className="order-admin-header">
                        <div>
                          <h3>Pedido #{order.orderNumber}</h3>
                          <p>Cliente: {order.user?.name}</p>
                          <p>Fecha: {new Date(order.createdAt).toLocaleDateString('es-CL')}</p>
                        </div>
                        <div className="order-admin-total">
                          ${order.total.toLocaleString('es-CL')}
                        </div>
                      </div>

                      <div className="order-admin-status">
                        <label>Estado:</label>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="processing">Procesando</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </div>

                      <div className="order-admin-items">
                        <strong>Productos:</strong>
                        <ul>
                          {order.items.map((item, index) => (
                            <li key={index}>
                              {item.product?.name} x{item.quantity} - ${(item.price * item.quantity).toLocaleString('es-CL')}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="admin-content">
                <h2>Estadísticas del Negocio</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                      <h3>{products.length}</h3>
                      <p>Productos Totales</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🛒</div>
                    <div className="stat-info">
                      <h3>{orders.length}</h3>
                      <p>Pedidos Totales</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                      <h3>
                        ${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString('es-CL')}
                      </h3>
                      <p>Ventas Totales</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-info">
                      <h3>
                        ${orders.length > 0 
                          ? Math.round(orders.reduce((sum, order) => sum + order.total, 0) / orders.length).toLocaleString('es-CL')
                          : 0}
                      </h3>
                      <p>Ticket Promedio</p>
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