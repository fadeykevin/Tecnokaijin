import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">
            <span className="footer-logo">⚡</span>
            TecnoKaijin
          </h3>
          <p className="footer-text">
            Tu tienda de tecnología de confianza. Los mejores productos electrónicos con garantía y envío seguro.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Enlaces Rápidos</h4>
          <ul className="footer-links">
            <li><a href="/">Inicio</a></li>
            <li><a href="/products">Productos</a></li>
            <li><a href="/cart">Carrito</a></li>
            <li><a href="/orders">Mis Pedidos</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Información</h4>
          <ul className="footer-links">
            <li><a href="#!">Sobre Nosotros</a></li>
            <li><a href="#!">Términos y Condiciones</a></li>
            <li><a href="#!">Política de Privacidad</a></li>
            <li><a href="#!">Envíos y Devoluciones</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Contacto</h4>
          <ul className="footer-contact">
            <li>📧 contacto@tecnokaijin.cl</li>
            <li>📱 +56 9 1234 5678</li>
            <li>📍 Santiago, Chile</li>
          </ul>
          <div className="footer-social">
            <a href="#!" aria-label="Facebook">📘</a>
            <a href="#!" aria-label="Instagram">📷</a>
            <a href="#!" aria-label="Twitter">🐦</a>
            <a href="#!" aria-label="LinkedIn">💼</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 TecnoKaijin. Todos los derechos reservados. | Desarrollado con ❤️ para UNIACC</p>
      </div>
    </footer>
  );
};

export default Footer;