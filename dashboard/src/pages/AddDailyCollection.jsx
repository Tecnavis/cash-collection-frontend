import React, { useState } from "react";
import AddNewBreadcrumb from "../components/breadcrumb/AddNewBreadcrumb";
import axios from "axios";
import { BASE_URL } from "../api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const CollectionForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "credit", // Default to credit
    date: new Date().toISOString().split('T')[0], // Default to today
    amount: "",
    narration: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { amount, date } = formData;
    
    if (!date) {
      setMessage("Date is required.");
      return false;
    }
    
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setMessage("Please enter a valid amount greater than zero.");
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
      await axios.post(`${BASE_URL}/cashcollection/collections/create/`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });

      setMessage("Collection entry created successfully!");
      setFormData({
        type: "credit",
        date: new Date().toISOString().split('T')[0],
        amount: "",
        narration: "",
      });

      setTimeout(() => {
        setMessage("");
        // Navigate to the collection list page
        navigate("/dailyCollection");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error creating collection entry.");
      console.error("API Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCollections = () => {
    navigate("/dailyCollection");
  };

  return (
    <div className="main-content">
      <AddNewBreadcrumb link="/dailyCollection" title="Add Daily Collection" />
      <div className="row">
        <div className="col-12">
          <div className="panel">
            <div className="panel-header d-flex justify-content-between align-items-center">
              <h5>Daily Collection Entry</h5>
              <button 
                className="btn btn-primary btn-sm" 
                onClick={handleViewCollections}
              >
                View Collections
              </button>
            </div>
            <div className="panel-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-sm-12">
                    <label className="form-label">Transaction Type</label>
                    <div className="d-flex">
                      <div className="form-check me-4">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="creditRadio"
                          name="type"
                          value="credit"
                          checked={formData.type === "credit"}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="creditRadio">
                          Credit
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="debitRadio"
                          name="type"
                          value="debit"
                          checked={formData.type === "debit"}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="debitRadio">
                          Debit
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      className="form-control"
                      value={formData.amount}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-sm-12">
                    <label className="form-label">Narration</label>
                    <textarea
                      name="narration"
                      className="form-control"
                      value={formData.narration}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Collection"}
                  </button>
                </div>
              </form>
              {message && (
                <div className={`alert alert-info mt-3`} role="alert">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionForm;