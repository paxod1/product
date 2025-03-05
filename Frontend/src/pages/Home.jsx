import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserTokenRequest } from '../AxiosCreate';
import './Home.css';
import UserNavbar from './UserNavbar';
import { useSelector } from 'react-redux';

function Home() {
  const [products, setProducts] = useState([]);
  const [expiredProducts, setExpiredProducts] = useState([]);
  const navigate = useNavigate();

  const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);
  const userid = logininfom?.id;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await UserTokenRequest.post(`/product/AllProduct/${userid}`);
      const allProducts = response.data;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expired = allProducts.filter(product => new Date(product.productEx) < today);
      const active = allProducts.filter(product => new Date(product.productEx) >= today);

      setProducts(active);
      setExpiredProducts(expired);
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await UserTokenRequest.delete(`/product/deleteProduct/${id}`);
      alert('Product deleted successfully');
      setProducts(products.filter((product) => product._id !== id));
      setExpiredProducts(expiredProducts.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error.response?.data || error.message);
      alert('Failed to delete product');
    }
  };

  return (
    <div>
      <UserNavbar />
      <div className="home-container">
        <h2 className="title">Product List</h2>

        <div className="product-section">
          <h3 className="sub-title">Available Products</h3>
          <div className="product-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <div className="product-card" key={product._id}>
                  <div className="card-content">
                    <h3>{product.productname}</h3>
                    <p><strong>Product Number:</strong> {product.productnum}</p>
                    <p><strong>Expiry Date:</strong> {new Date(product.productEx).toLocaleDateString()}</p>
                  </div>
                  <div className="card-actions">
                    <button
                      className="update-btn"
                      onClick={() => navigate(`/update-product/${product._id}`)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-products">No active products found.</p>
            )}
          </div>
        </div>

        <div className="product-section expired-products">
          <h3 className="sub-title expired-title">Expired Products</h3>
          <div className="product-grid">
            {expiredProducts.length > 0 ? (
              expiredProducts.map((product) => (
                <div className="product-card expired-card" key={product._id}>
                  <div className="card-content">
                    <h3>{product.productname}</h3>
                    <p><strong>Product Number:</strong> {product.productnum}</p>
                    <p><strong>Expiry Date:</strong> {new Date(product.productEx).toLocaleDateString()}</p>
                  </div>
                  <div className="card-actions">
                    <button
                      className="update-btn"
                      onClick={() => navigate(`/update-product/${product._id}`)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-products">No expired products.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
