import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import "./UserNavbar.css";
import { useDispatch } from 'react-redux';
import { LogoutData } from "../Redux/UserSlice";
import { Link, useNavigate } from 'react-router-dom';

function UserNavbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const dispatch = useDispatch()
    const Navigate = useNavigate()

    const handleLogout = () => {
        dispatch(LogoutData())
        window.location.reload()
    };

    return (
        <nav className="navbar">
            <div className="inner_navbar">
                <div className="logo">
                    <Link to="/">MyBrand</Link>
                </div>

                <div className={`nav-links ${menuOpen ? "active" : ""}`}>
                    <Link to="/">Home</Link>
                    <Link to="/AddProduct">Add-Products</Link>
                    <button className="logout-btn" onClick={handleLogout}>
                        <FiLogOut className="logout-icon" /> Logout
                    </button>
                </div>

                <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </div>
            </div>
        </nav>
    );
}

export default UserNavbar;
