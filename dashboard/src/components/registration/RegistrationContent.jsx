import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Footer from '../footer/Footer';
import { DigiContext } from '../../context/DigiContext';
import { BASE_URL } from "../../api";

const RegistrationContent = () => {
    const { passwordVisible, togglePasswordVisibility } = useContext(DigiContext);
    const navigate = useNavigate(); // Initialize navigate

    // State for form inputs
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        role: 'secondary_admin', // Default role
        password: '',
    });

    // State to store error messages
    const [errorMessage, setErrorMessage] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); 

        try {
            const response = await axios.post(`${BASE_URL}/users/register/`, formData);
            console.log('Registration successful:', response.data);
            alert('User registered successfully');
            navigate('/'); 
        } catch (error) {
            console.error('Error registering user:', error.response?.data || error.message);
            setErrorMessage(error.response?.data?.detail || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="main-content login-panel">
            <div className="login-body">
                <div className="top d-flex justify-content-between align-items-center">
                    <div className="logo">
                        <img src="assets/images/logo-big.png" alt="Logo" />
                    </div>
                    <Link to="/login"><i className="fa-duotone fa-sign-in"></i></Link>
                </div>
                <div className="bottom">
                    <h3 className="panel-title">Registration</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group mb-30">
                            <span className="input-group-text"><i className="fa-regular fa-user"></i></span>
                            <input 
                                type="text" 
                                name="username"
                                className="form-control" 
                                placeholder="Username" 
                                value={formData.username} 
                                onChange={handleChange} 
                                required
                            />
                        </div>
                        <div className="input-group mb-30">
                            <span className="input-group-text"><i className="fa-regular fa-envelope"></i></span>
                            <input 
                                type="email" 
                                name="email"
                                className="form-control" 
                                placeholder="Email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required
                            />
                        </div>
                        <div className="input-group mb-30">
                            <span className="input-group-text"><i className="fa-regular fa-phone"></i></span>
                            <input 
                                type="tel" 
                                name="phone"
                                className="form-control" 
                                placeholder="Phone Number" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                required
                            />
                        </div>
                        {/* Role Dropdown */}
                        <div className="input-group mb-30">
                            <span className="input-group-text"><i className="fa-solid fa-user"></i></span>
                            <select 
                                name="role" 
                                className="form-control" 
                                value={formData.role} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="secondary_admin">Secondary Admin</option>
                                <option value="customer">Customer</option>
                                <option value="vendor">Vendor</option>
                            </select>
                        </div>
                        <div className="input-group mb-20">
                            <span className="input-group-text"><i className="fa-regular fa-lock"></i></span>
                            <input 
                                type={passwordVisible ? 'text' : 'password'} 
                                name="password"
                                className="form-control rounded-end" 
                                placeholder="Password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required
                            />
                            <Link role="button" className="password-show" onClick={togglePasswordVisibility}>
                                <i className="fa-duotone fa-eye"></i>
                            </Link>
                        </div>
                        {errorMessage && <p className="text-danger">{errorMessage}</p>} 
                        <button className="btn btn-primary w-100 login-btn" type="submit">Sign up</button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RegistrationContent;
