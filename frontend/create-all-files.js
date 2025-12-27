const fs = require('fs');

console.log('🚀 Creando todos los archivos de TecnoKaijin...\n');

const files = {
  // ========== COMPONENTES ==========
  'src/components/Navbar.js': `import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { authService } from '../services/api';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚡</span>
          TecnoKaijin
        </Link>
        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>
        <div className={\`navbar-menu \${menuOpen ? 'active' : ''}\`}>
          <ul className="navbar-nav">
            <li className="nav-item"><Link to="/" className="nav-link">Inicio</Link></li>
            <li className="nav-item"><Link to="/products" className="nav-link">Productos</Link></li>
            {user ? (
              <>
                <li className="nav-item"><Link to="/orders" className="nav-link">Mis Pedidos</Link></li>
                {user.role === 'admin' && (
                  <li className="nav-item"><Link to="/admin" className="nav-link admin-link">🛡️ Admin</Link></li>
                )}
                <li className="nav-item"><span className="nav-link user-name">👤 {user.name}</span></li>
                <li className="nav-item"><button onClick={handleLogout} className="nav-link logout-btn">Cerrar Sesión</button></li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link to="/login" className="nav-link">Iniciar Sesión</Link></li>
                <li className="nav-item"><Link to="/register" className="nav-link btn-register">Registrarse</Link></li>
              </>
            )}
            <li className="nav-item">
              <Link to="/cart" className="nav-link cart-link">
                <span className="cart-icon">🛒</span>
                <span className="cart-count">{getCartItemsCount()}</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;`,

  'src/components/Navbar.css': `.navbar {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 700;
  color: white;
  text-decoration: none;
  transition: transform 0.3s ease;
}
.navbar-logo:hover { transform: scale(1.05); }
.logo-icon { font-size: 32px; animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
.navbar-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}
.navbar-toggle span {
  width: 25px;
  height: 3px;
  background: white;
  border-radius: 3px;
}
.navbar-menu { display: flex; }
.navbar-nav {
  display: flex;
  list-style: none;
  gap: 5px;
  align-items: center;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 15px;
}
.nav-link:hover { background: rgba(255, 255, 255, 0.1); }
.btn-register {
  background: white;
  color: #2563eb;
  font-weight: 600;
}
.btn-register:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.admin-link {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.logout-btn { background: rgba(255, 255, 255, 0.1); }
.logout-btn:hover { background: rgba(239, 68, 68, 0.3); }
.user-name { background: rgba(255, 255, 255, 0.15); font-size: 14px; }
.cart-link {
  position: relative;
  background: rgba(255, 255, 255, 0.15);
}
.cart-icon { font-size: 20px; }
.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}
@media (max-width: 768px) {
  .navbar-toggle { display: flex; }
  .navbar-menu {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    padding: 20px;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  .navbar-menu.active { transform: translateX(0); }
  .navbar-nav {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }
  .nav-link {
    width: 100%;
    justify-content: center;
    padding: 12px;
  }
}`,

  'src/components/Footer.js': `import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title"><span className="footer-logo">⚡</span>TecnoKaijin</h3>
          <p className="footer-text">Tu tienda de tecnología de confianza. Los mejores productos electrónicos con garantía y envío seguro.</p>
        </div>
        <div className="footer-section">
          <h4 className="footer-heading">Enlaces Rápidos</h4>
          <ul className="footer-links">
            <li><a href="/">Inicio</a></li>
            <li><a href="/products">Productos</a></li>
            <li><a href="/cart">Carrito</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4 className="footer-heading">Información</h4>
          <ul className="footer-links">
            <li><a href="#!">Sobre Nosotros</a></li>
            <li><a href="#!">Términos y Condiciones</a></li>
            <li><a href="#!">Política de Privacidad</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4 className="footer-heading">Contacto</h4>
          <ul className="footer-contact">
            <li>📧 contacto@tecnokaijin.cl</li>
            <li>📱 +56 9 1234 5678</li>
            <li>📍 Santiago, Chile</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 TecnoKaijin. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;`,

  'src/components/Footer.css': `.footer {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: white;
  padding: 40px 20px 20px;
  margin-top: 60px;
}
.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.footer-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.footer-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 700;
}
.footer-logo { font-size: 32px; }
.footer-text {
  color: #9ca3af;
  line-height: 1.6;
  font-size: 14px;
}
.footer-heading {
  font-size: 18px;
  font-weight: 600;
  color: #f3f4f6;
}
.footer-links, .footer-contact {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-links a {
  color: #9ca3af;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}
.footer-links a:hover {
  color: #2563eb;
  padding-left: 5px;
}
.footer-contact li {
  color: #9ca3af;
  font-size: 14px;
}
.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}`
};

// Escribir todos los archivos
let count = 0;
Object.entries(files).forEach(([filepath, content]) => {
  fs.writeFileSync(filepath, content);
  count++;
  console.log(\`✅ (\${count}/\${Object.keys(files).length}) Creado: \${filepath}\`);
});

console.log(\`\n✨ ¡\${count} archivos creados exitosamente!\n\`);
console.log('📝 Próximos pasos:');
console.log('1. Ejecuta: node create-pages.js');
console.log('2. Luego: npm start\n');