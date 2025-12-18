import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../footer/Footer';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { BASE_URL } from "../../api";

const LoginContent2 = () => {
  
  const [formData, setFormData] = useState({
    phone_number: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await fetch(`${BASE_URL}/users/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.phone_number, // 🔥 IMPORTANT
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      Cookies.set('access_token', data.access_token, { expires: 1 });
      Cookies.set('refresh_token', data.refresh_token, { expires: 7 });
      Cookies.set('user_role', data.role.toUpperCase(), { expires: 1 });
      Cookies.set('user_id', data.user_id, { expires: 1 });

      window.dispatchEvent(new Event('auth-change'));

      let redirectPath = '/dashboard';

      const role = data.role.toUpperCase();
      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        redirectPath = '/dash';
      } else if (role === 'STAFF') {
        redirectPath = '/hrmDashboard';
      } else if (role === 'CUSTOMER') {
        redirectPath = '/customerDashboard';
      }

      navigate(redirectPath);
    } else {
      setError(data.detail || 'Invalid phone number or password');
    }
  } catch (err) {
    setError('Something went wrong. Please try again.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="main-content login-panel login-panel-2">
      <h3 className="panel-title">Login</h3>
      <div className="login-body login-body-2">
        <div className="top d-flex justify-content-between align-items-center">
          <div className="logo">
            {/* <img src="assets/images/neo1.png" alt="Logo" /> */}
            <img src="assets/images/neo1.png" alt="Logo" className="img-fluid" style={{ maxWidth: '100px' }} />
          </div>
          <Link to="/"><i className="fa-duotone fa-house-chimney"></i></Link>
        </div>
        <div className="bottom">
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-30">
              <input
                type="tel"
                className="form-control"
                placeholder="Phone number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
              <span className="input-group-text"><i className="fa-regular fa-phone"></i></span>
            </div>
            <div className="input-group mb-20">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="input-group-text password-toggle" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                {showPassword ? 
                  <i className="fa-regular fa-eye-slash"></i> : 
                  <i className="fa-regular fa-eye"></i>
                }
              </span>
            </div>

            {error && <p className="text-danger">{error}</p>}

            <button type="submit" className="btn btn-primary w-100 login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginContent2;