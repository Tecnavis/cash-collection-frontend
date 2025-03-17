import React, { useState, useEffect } from "react";
import Footer from "../components/footer/Footer";
import AddNewBreadcrumb from "../components/breadcrumb/AddNewBreadcrumb";
import axios from "axios";
import { BASE_URL } from "../api";
import Cookies from "js-cookie";

const AddCollectionPlan = () => {
  const [formData, setFormData] = useState({
    customer: "",
    collection_schema: "",
    amount_collected: "",
    collection_date: new Date().toISOString().split("T")[0], 
    collector: "", 
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [customers, setCustomers] = useState([]);
  const [schemas, setSchemas] = useState([]);

  useEffect(() => {
    fetchCustomers();
    fetchSchemas();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/customers/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchSchemas = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/collection-schemas/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
      setSchemas(response.data);
    } catch (error) {
      console.error("Error fetching schemas:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.customer || !formData.collection_schema || !formData.amount_collected) {
      setMessage("All fields except notes are required.");
      return false;
    }
    if (isNaN(formData.amount_collected) || Number(formData.amount_collected) <= 0) {
      setMessage("Amount must be a valid number greater than 0.");
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
      await axios.post(`${BASE_URL}/cash-collection/`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });

      setMessage("Collection entry added successfully!");
      setFormData({
        customer: "",
        collection_schema: "",
        amount_collected: "",
        collection_date: new Date().toISOString().split("T")[0],
        collector: "",
        notes: "",
      });

      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error adding collection entry."
      );
      console.error("API Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <AddNewBreadcrumb link="/collections" title={"Add Collection Entry"} />
      <div className="row">
        <div className="col-12">
          <div className="panel">
            <div className="panel-header">
              <h5>Add Collection Entry</h5>
            </div>
            <div className="panel-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                <div className="col-lg-4 col-sm-6">
                    <label className="form-label">Collection Schema</label>
                    <select
                      name="collection_schema"
                      className="form-control form-control-sm"
                      value={formData.collection_schema}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Schema</option>
                      {schemas.map((schema) => (
                        <option key={schema.id} value={schema.id}>
                          {schema.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-lg-4 col-sm-6">
                    <label className="form-label">Customer</label>
                    <select
                      name="customer"
                      className="form-control form-control-sm"
                      value={formData.customer}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Customer</option>
                      {customers.map((cust) => (
                        <option key={cust.id} value={cust.id}>
                          {cust.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* <div className="col-lg-4 col-sm-6">
                    <label className="form-label">Collection Schema</label>
                    <select
                      name="collection_schema"
                      className="form-control form-control-sm"
                      value={formData.collection_schema}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Schema</option>
                      {schemas.map((schema) => (
                        <option key={schema.id} value={schema.id}>
                          {schema.name}
                        </option>
                      ))}
                    </select>
                  </div> */}

                  <div className="col-lg-4 col-sm-6">
                    <label className="form-label">Amount Collected</label>
                    <input
                      type="number"
                      name="amount_collected"
                      className="form-control form-control-sm"
                      value={formData.amount_collected}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  
                  <div className="col-lg-4 col-sm-6">
                    <label className="form-label">Amount Remaining</label>
                    <input
                      type="number"
                      name="amount_collected"
                      className="form-control form-control-sm"
                      value={formData.amount_collected}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-lg-4 col-sm-6">
                    <label className="form-label">Collection Date</label>
                    <input
                      type="date"
                      name="collection_date"
                      className="form-control form-control-sm"
                      value={formData.collection_date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-lg-4 col-sm-6">
                    <label className="form-label">Notes (Optional)</label>
                    <textarea
                      name="notes"
                      className="form-control form-control-sm"
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Collection Entry"}
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

export default AddCollectionPlan;
