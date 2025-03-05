import React, { useState } from 'react';
import { SignupAPI } from '../API/ApiCalling';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';
import { FaSpinner } from 'react-icons/fa';

function Signup() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function sendSignupDataToApi() {
        setLoading(true);
        try {
            await SignupAPI({ fullname, email, phone, password });
            navigate('/');
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='signup-container'>
            <div className='signup-box'>
                <h3>Sign Up</h3>
                <div className='signup-form'>
                    <input type="text" placeholder='Full Name' required onChange={(e) => setFullname(e.target.value)} />
                    <input type="email" placeholder='Email' required onChange={(e) => setEmail(e.target.value)} />
                    <input type="number" placeholder='Phone Number' required onChange={(e) => setPhone(e.target.value)} />
                    <input type="password" placeholder='Password' required onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className='signup-btn' onClick={sendSignupDataToApi} disabled={loading}>
                    {loading ? <FaSpinner className="spinner" /> : 'Sign Up'}
                </button>
                <p className="login-link">Already have an account? <Link to="/">Log in</Link></p>
            </div>
        </div>
    );
}

export default Signup;
