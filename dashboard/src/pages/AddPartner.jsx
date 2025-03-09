import React, { useState } from "react";
import Footer from "../components/footer/Footer";
import AddNewBreadcrumb from "../components/breadcrumb/AddNewBreadcrumb";
import axios from "axios";
import { BASE_URL } from "../api";
import Cookies from "js-cookie";

const AddPartner = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    secondary_contact: "",
    company_name: "",
    partner_type: "customer", 
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const breadcrumbLink = formData.partner_type === "vendor" ? "/supplier" : "/allCustomer";


  const validateForm = () => {
    const { email, contact_number } = formData;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!emailRegex.test(email)) {
      setMessage("Invalid email format.");
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
      await axios.post(`${BASE_URL}/partner/partners/create/`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });

      setMessage("User profile created successfully!");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        contact_number: "",
        secondary_contact: "",
        company_name: "",
        partner_type: "customer",
      });

      setTimeout(() => setMessage(""), 5000); 
    } catch (error) {
      setMessage(error.response?.data?.message || "Error creating user profile.");
      console.error("API Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <AddNewBreadcrumb link={breadcrumbLink} title={"Add Partner"} />
      <div className="row">
        <div className="col-12">
          <div className="panel">
            <div className="panel-header">
              <h5>Create Partner Profile</h5>
            </div>
            <div className="panel-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-xxl-3 col-lg-4 col-sm-6">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      className="form-control form-control-sm"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-xxl-3 col-lg-4 col-sm-6">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      className="form-control form-control-sm"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-xxl-3 col-lg-4 col-sm-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-sm"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-xxl-3 col-lg-4 col-sm-6">
                    <label className="form-label">Contact Number</label>
                    <input
                      type="tel"
                      name="contact_number"
                      className="form-control form-control-sm"
                      value={formData.contact_number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <input
                    type="secondary_contact"  
                    name="secondary_contact"
                    className="form-control form-control-sm"
                    value={formData.secondary_contact}  
                    onChange={handleChange}
                   
                  />
                  <div className="col-xxl-3 col-lg-4 col-sm-6">
                    <label className="form-label">Company Name (Optional)</label>
                    <input
                      type="text"
                      name="company_name"
                      className="form-control form-control-sm"
                      value={formData.company_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-xxl-3 col-lg-4 col-sm-6">
                    <label className="form-label">Role</label>
                    <select
                      name="partner_type"
                      className="form-control form-control-sm"
                      value={formData.partner_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="customer">Customer</option>
                      <option value="vendor">Vendor</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating..." : "Create Partner"}
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

export default AddPartner;


// saudi contact no validation
// const validateForm = () => {
//   const { email, contact_number } = formData;
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   const saudiPhoneRegex = /^(?:05[0-9]{8}|0[1-9]{2}[0-9]{7})$/;

//   if (!emailRegex.test(email)) {
//     setMessage("Invalid email format.");
//     return false;
//   }
//   if (!saudiPhoneRegex.test(contact_number)) {
//     setMessage("Invalid Saudi contact number. Must start with '05' for mobile or a valid landline code.");
//     return false;
//   }
//   return true;
// };
