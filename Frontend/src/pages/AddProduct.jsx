import React, { useState } from 'react';
import axios from 'axios';
import { UserTokenRequest } from '../AxiosCreate';
import './addproduct.scss';
import { useNavigate } from 'react-router-dom';
import UserNavbar from './UserNavbar';
import { useSelector } from 'react-redux';

function AddProduct() {

    const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);
    console.log("from app.js logininfom", logininfom);

    const userid = logininfom?.id;
    console.log(userid);
    
  

    const Navigate = useNavigate()
    const [product, setProduct] = useState({
        productname: '',
        productnum: '',
        productEx: '',
        userid:userid
    });

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await UserTokenRequest.post("/product/AddNewProduct", product);
            alert("Product Added Successfully!");
            console.log(response.data);
            setProduct({ productname: '', productnum: '', productEx: '' }); 
            Navigate('/')
        } catch (err) {
            if (err.response && err.response.status === 400 && err.response.data.message === "Product number already exists for this user.") {
                alert("Product already exists!");
            } else {
                alert("Failed to add product!");
            }
            console.error(err);
        }
    };

    return (
        <div className="add-product-container">
            <UserNavbar />
            <div className="form-box">
                <h2>Add New Product</h2>
                <form onSubmit={handleSubmit}>
                    <label>Product Name:</label>
                    <input type="text" name="productname" value={product.productname} onChange={handleChange} required />

                    <label>Product Number:</label>
                    <input type="text" name="productnum" value={product.productnum} onChange={handleChange} required />

                    <label>Expiry Date:</label>
                    <input type="date" name="productEx" value={product.productEx} onChange={handleChange} required />

                    <button type="submit" className="submit-btn">Add Product</button>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;
