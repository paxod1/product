import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserTokenRequest } from '../AxiosCreate';
import './ProductUpdate.css';
import UserNavbar from './UserNavbar';

function UpdateProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        productname: '',
        productnum: '',
        productEx: '',
        productservice: ''
    });

    useEffect(() => {
        fetchProductDetails();
    }, []);

    const fetchProductDetails = async () => {
        try {
            const response = await UserTokenRequest.get(`/product/getproduct/${id}`);
            const data = response.data;
            setProduct({
                productname: data.productname,
                productnum: data.productnum,
                productEx: data.productEx.split('T')[0],
            });
        } catch (error) {
            console.error('Error fetching product:', error.response?.data || error.message);
            alert('Failed to load product details');
        }
    };

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await UserTokenRequest.put(`/product/update/${id}`, product);
            alert('Product updated successfully!');
            navigate('/');
        } catch (error) {
            console.error('Error updating product:', error.response?.data || error.message);
            alert('Failed to update product');
        }
    };

    return (
        <div>
            <UserNavbar />
            <div className="update-product-container">

                <h2>Update Product</h2>
                <form onSubmit={handleSubmit}>
                    <label>Product Name:</label>
                    <input type="text" name="productname" value={product.productname} onChange={handleChange} required />

                    <label>Product Number:</label>
                    <input type="text" name="productnum" value={product.productnum} onChange={handleChange} required />

                    <label>Expiry Date:</label>
                    <input type="date" name="productEx" value={product.productEx} onChange={handleChange} required />

                    <button type="submit" className="save-btn">Update Product</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateProduct;
