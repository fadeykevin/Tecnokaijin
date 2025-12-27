import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { authService } from '../services/api';
import './Navbar.css';

function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  
  // Obtener información del usuario
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  const isAdmin = authService.isAdmin();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo">
          TECNOKAIYU
        </Link>

        {/* Links de navegación */}
        <ul className="nav-links">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/products">Productos</Link></li>
          <li><Link to="/orders">Mis pedidos</Link></li>
        </ul>

        {/* Sección derecha: Usuario o Login/Registro */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              {/* Información del usuario logueado */}
              <div className="user-profile">
                <div className="user-info">
                  <span className="user-name">{currentUser.name}</span>
                  <span className={`user-badge ${isAdmin ? 'admin' : 'client'}`}>
                    {isAdmin ? '👨‍💼 Administrador' : '👤 Cliente'}
                  </span>
                </div>
              </div>

              {/* Botón Panel Admin (solo si es admin) */}
              {isAdmin && (
                <Link to="/admin" className="admin-btn">
                  📊 Panel
                </Link>
              )}

              {/* Carrito */}
              <Link to="/cart" className="cart-icon">
                🛒 <span>{cart.length}</span>
              </Link>

              {/* Botón Cerrar Sesión */}
              <button onClick={handleLogout} className="logout-btn">
                🚪 Salir
              </button>
            </>
          ) : (
            <>
              {/* Botones de Login y Registro cuando NO está logueado */}
              <Link to="/login" className="auth-btn login-btn">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="auth-btn register-btn">
                Crear Cuenta
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;