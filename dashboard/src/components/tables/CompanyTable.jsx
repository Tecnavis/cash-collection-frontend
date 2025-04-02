import React, { useState } from "react";
import AddNewBreadcrumb from "../../components/breadcrumb/AddNewBreadcrumb";
import axios from "axios";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";

const AllCustomerTable = () => {
  const [formData, setFormData] = useState({
    profile_id: "",
    user: {
      first_name: "",
      last_name: "",
      email: "",
      contact_number: "",
      password: "",
    },
    shop_name: "",
    secondary_contact: "",
    address: "",
    other_info: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["first_name", "last_name", "email", "contact_number", "password"].includes(name)) {
      // Update user object separately
      setFormData((prevData) => ({
        ...prevData,
        user: { ...prevData.user, [name]: value },
      }));
    } else {
      // Update other fields normally
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const { email, contact_number } = formData.user;
    const { secondary_contact, profile_id } = formData;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!profile_id.trim()) {
      setMessage("Profile ID is required.");
      return false;
    }
    if (!emailRegex.test(email)) {
      setMessage("Invalid email format.");
      return false;
    }
    if (!phoneRegex.test(contact_number) ) {
      setMessage("Phone numbers must be 10-15 digits.");
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

      setMessage("Customer profile created successfully!");
      setFormData({
        profile_id: "",
        user: {
          first_name: "",
          last_name: "",
          email: "",
          contact_number: "",
          password: "",
        },
        shop_name: "",
        secondary_contact: "",
        address: "",
        other_info: "",
      });

      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error creating customer profile.");
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
                    <input type="text" name="profile_id" className="form-control" value={formData.profile_id} onChange={handleChange} required />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Shop Name</label>
                    <input type="text" name="shop_name" className="form-control" value={formData.shop_name} onChange={handleChange} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">First Name</label>
                    <input type="text" name="first_name" className="form-control" value={formData.user.first_name} onChange={handleChange} required />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Last Name</label>
                    <input type="text" name="last_name" className="form-control" value={formData.user.last_name} onChange={handleChange} required />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Contact Number</label>
                    <input type="tel" name="contact_number" className="form-control" value={formData.user.contact_number} onChange={handleChange} required />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Secondary Contact</label>
                    <input type="tel" name="secondary_contact" className="form-control" value={formData.secondary_contact} onChange={handleChange} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" value={formData.user.email} onChange={handleChange} required />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Password</label>
                    <input type="password" name="password" className="form-control" value={formData.user.password} onChange={handleChange} required />
                  </div>
                  <div className="col-sm-12">
                    <label className="form-label">Address</label>
                    <textarea name="address" className="form-control" value={formData.address} onChange={handleChange} />
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
    </div>
  );
};

export default AllCustomerTable;
