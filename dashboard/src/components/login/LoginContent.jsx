import React, { useContext, useState } from 'react';
import Footer from '../footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { DigiContext } from '../../context/DigiContext';
import api from '../../api';
import Cookies from 'js-cookie';

const LoginContent = () => {
  const { passwordVisible, togglePasswordVisibility } = useContext(DigiContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone_number: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/users/login/', {
        phone_number: formData.phone_number,
        password: formData.password
      });

      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;

        // Set cookies with secure attributes
        Cookies.set('access_token', access_token, {
          expires: 1,
          secure: window.location.protocol === 'https:',
          sameSite: 'Strict'
        });
        Cookies.set('refresh_token', refresh_token, {
          expires: 7,
          secure: window.location.protocol === 'https:',
          sameSite: 'Strict'
        });

        // Navigate to dashboard or home
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content login-panel">
      <div className="login-body">
        <div className="top d-flex justify-content-between align-items-center">
          <div className="logo">
            <img src="assets/images/logo-big.png" alt="Logo" />
          </div>
        </div>
        <div className="bottom">
          <h3 className="panel-title">Login</h3>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-30">
              <span className="input-group-text">
                <i className="fa-regular fa-user"></i>
              </span>
              <input
                type="tel"
                className="form-control"
                placeholder="Phone number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group mb-20">
              <span className="input-group-text">
                <i className="fa-regular fa-lock"></i>
              </span>
              <input
                type={passwordVisible ? 'text' : 'password'}
                className="form-control rounded-end"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Link
                role="button"
                className="password-show"
                onClick={togglePasswordVisibility}
              >
                <i className="fa-duotone fa-eye"></i>
              </Link>
            </div>

            <div className="d-flex justify-content-between mb-30">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="loginCheckbox"
                />
                <label
                  className="form-check-label text-white"
                  htmlFor="loginCheckbox"
                >
                  Remember Me
                </label>
              </div>
              <Link to="/resetPassword" className="text-white fs-14">
                Forgot Password?
              </Link>
            </div>
            <button
              className="btn btn-primary w-100 login-btn"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginContent;
