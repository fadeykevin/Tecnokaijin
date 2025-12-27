import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p style={{ padding: 20 }}>Cargando productos...</p>;
  }

  return (
    <div className="products-page container">
      <h1 style={{ marginBottom: '1.5rem' }}>
        Productos ({products.length})
      </h1>

      <div className="products-grid">
        {products.map(product => (
          <div className="product-card" key={product.id}>
            <div className="image-wrapper">
              <img src={product.image} alt={product.name} />
            </div>

            <div className="product-info">
              <h3>{product.name}</h3>
              <p>${product.price.toLocaleString('es-CL')}</p>

              <div className="card-footer">
                <strong>
                  ${product.price.toLocaleString('es-CL')}
                </strong>

                <Link to={`/products/${product.id}`} className="btn">
                  Ver
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
