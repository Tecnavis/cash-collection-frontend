import React, { useState } from "react";
import Footer from "../../components/footer/Footer";
import AddNewBreadcrumb from "../../components/breadcrumb/AddNewBreadcrumb";
import axios from "axios";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";

const AllCustomerTable = () => {
  const [formData, setFormData] = useState({
    profileId: "",
    username: "",
    first_name: "",
    last_name: "",
    contact_number: "",
    secondary_contact: "",
    email: "",
    password: "",
    other_info: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { email, contact_number, password } = formData;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!emailRegex.test(email)) {
      setMessage("Invalid email format.");
      return false;
    }
    if (!password || password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return false;
    }
    if (!phoneRegex.test(contact_number)) {
      setMessage("Phone number must be 10-15 digits.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/partner/customers/create/`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });

      setMessage("User profile created successfully!");
      setFormData({
        profileId: "",
        shop_name: "",
        first_name: "",
        last_name: "",
        contact_number: "",
        secondary_contact: "",
        email: "",
        password: "",
        other_info: "",
      });

      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error creating user profile."
      );
      console.error("API Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <AddNewBreadcrumb link="/allCustomer" title="Add Customer" />
      <div className="row">
        <div className="col-12">
          <div className="panel">
            <div className="panel-header">
              <h5>Create Customer Profile</h5>
            </div>
            <div className="panel-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label">Profile ID</label>
                    <input type="text" name="profileId" className="form-control" value={formData.profileId} onChange={handleChange} required />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Shop Name</label>
                    <input type="text" name="shop_name" className="form-control" value={formData.shop_name} onChange={handleChange} required />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">First Name</label>
                    <input type="text" name="first_name" className="form-control" value={formData.first_name} onChange={handleChange} required />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Last Name</label>
                    <input type="text" name="last_name" className="form-control" value={formData.last_name} onChange={handleChange} required />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Contact Number</label>
                    <input type="tel" name="contact_number" className="form-control" value={formData.contact_number} onChange={handleChange} required />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Secondary Contact</label>
                    <input type="tel" name="secondary_contact" className="form-control" value={formData.secondary_contact} onChange={handleChange} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Email Address</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Password</label>
                    <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                  </div>
                  <div className="col-sm-12">
                    <label className="form-label">Other Info</label>
                    <textarea name="other_info" className="form-control" value={formData.other_info} onChange={handleChange} />
                  </div>
                </div>
                <div className="mt-3">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating..." : "Create Customer"}
                  </button>
                </div>
              </form>
              {message && <p className="mt-2 text-info">{message}</p>}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllCustomerTable;
