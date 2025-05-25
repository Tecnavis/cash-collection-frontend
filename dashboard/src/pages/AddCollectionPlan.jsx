import React, { useState, useEffect } from "react";
import Footer from "../components/footer/Footer";
import AddNewBreadcrumb from "../components/breadcrumb/AddNewBreadcrumb";
import axios from "axios";
import { BASE_URL } from "../api";
import Cookies from "js-cookie";
import ReactSelect from "react-select";

const AddCollectionPlan = () => {
  const [formData, setFormData] = useState({
    customer: "",
    scheme: "",
    amount: "",
    collection_date: new Date().toISOString().split("T")[0],
    notes: "",
    payment_method: "cash", 
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [customerSchemes, setCustomerSchemes] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [uniqueSchemes, setUniqueSchemes] = useState([]);
  const [schemes, setSchemes] = useState([]); 
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [currentAmountInput, setCurrentAmountInput] = useState(0);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  
  useEffect(() => {
    const currentAmount = formData.amount ? parseFloat(formData.amount) || 0 : 0;
    setCurrentAmountInput(currentAmount);
  }, [formData.amount]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [customerSchemesResponse, schemesResponse] = await Promise.all([
        axios.get(`${BASE_URL}/cashcollection/customer-schemes/`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }),
        axios.get(`${BASE_URL}/cashcollection/schemes/`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        })
      ]);

      setCustomerSchemes(customerSchemesResponse.data);
      setSchemes(schemesResponse.data);

      
      const uniqueSchemesList = Array.from(
        new Set(customerSchemesResponse.data.map((scheme) => scheme.scheme))
      ).map((schemeId) => customerSchemesResponse.data.find((s) => s.scheme === schemeId));
      
      setUniqueSchemes(uniqueSchemesList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Failed to load customer schemes. Please refresh the page.");
      setMessageType("error");
      setLoading(false);
    }
  };

  
  const fetchPaymentHistory = async (customerId, schemeId) => {
    try {
      setLoading(true);
      
      const response = await axios.get(`${BASE_URL}/cashcollection/customer-scheme-payments/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
      
      
      const customerPayments = response.data.filter(payment => {
        return payment.customer_details && 
               payment.customer_details.id === parseInt(customerId) && 
               payment.scheme_name && 
               payment.scheme_name === uniqueSchemes.find(s => s.scheme === parseInt(schemeId))?.scheme_name;
      });
      
      if (customerPayments.length > 0) {
        const paymentHistoryData = customerPayments[0].payment_history || [];
        
        
        const sortedPaymentHistory = [...paymentHistoryData].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
        setPaymentHistory(sortedPaymentHistory);
        
        
        const totalPaid = paymentHistoryData.reduce(
          (sum, payment) => sum + parseFloat(payment.amount), 
          0
        );
        
        setTotalPaidAmount(totalPaid);
      } else {
        
        setPaymentHistory([]);
        setTotalPaidAmount(0);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      setTotalPaidAmount(0);
      setPaymentHistory([]);
      setLoading(false);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "38px",
      fontSize: "14px",
    }),
  };
  
  
  const handleCustomerSelect = async (selectedOption) => {
    if (selectedOption) {
      const customerId = selectedOption.value;
      
      setFormData({ ...formData, customer: customerId });
      
      
      if (formData.scheme) {
        await fetchPaymentHistory(customerId, formData.scheme);
      }
    } else {
      setFormData({ ...formData, customer: "" });
      setTotalPaidAmount(0);
      setPaymentHistory([]);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "scheme") {
      
      setFormData({ ...formData, scheme: value, customer: "" });
      setFilteredCustomers(customerSchemes.filter((cs) => cs.scheme === Number(value)));
      
      
      setTotalPaidAmount(0);
      setPaymentHistory([]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    if (!formData.customer || !formData.scheme || !formData.amount) {
      setMessage("All fields except notes are required.");
      setMessageType("error");
      return false;
    }

    if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      setMessage("Amount must be a valid number greater than 0.");
      setMessageType("error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      await axios.post(
        `${BASE_URL}/cashcollection/cashcollection/bycustomer/create/`,
        {
          customer: formData.customer,
          scheme: formData.scheme,
          amount: formData.amount,
          collection_date: formData.collection_date,
          payment_method: formData.payment_method,
          notes: formData.notes,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );

      setMessage("Collection entry added successfully!");
      setMessageType("success");
      
      
      const submittedAmount = parseFloat(formData.amount);
      
      
      const newPayment = {
        amount: submittedAmount,
        payment_method: formData.payment_method,
        date: new Date().toISOString()
      };
      
      setPaymentHistory([newPayment, ...paymentHistory]);
      
      
      setTotalPaidAmount(prevTotal => prevTotal + submittedAmount);
      
      
      setFormData({
        customer: formData.customer,
        scheme: formData.scheme, 
        amount: "", 
        collection_date: new Date().toISOString().split("T")[0],
        payment_method: "cash",
        notes: "",
      });
      
      
      if (formData.customer && formData.scheme) {
        await fetchPaymentHistory(formData.customer, formData.scheme);
      }

      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      console.error("API Error:", error.response?.data);
    
      
      const backendErrors = error.response?.data;
      if (backendErrors?.non_field_errors && Array.isArray(backendErrors.non_field_errors)) {
        setMessage(backendErrors.non_field_errors[0]);
      } else if (typeof backendErrors === "string") {
        setMessage(backendErrors);
      } else {
        setMessage("Error adding collection entry.");
      }
    
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="main-content">
      <AddNewBreadcrumb link="/collections" title="Add Collection Entry" />
      <div className="row">
        <div className="col-12">
          <div className="panel">
            <div className="panel-header">
              <h5>Add Collection Entry</h5>
            </div>
            <div className="panel-body">
              {loading && <div className="alert alert-info">Loading data...</div>}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-lg-4 col-sm-6">
                    <label className="form-label">Collection Scheme</label>
                    <select
                      name="scheme"
                      className="form-control form-control-sm"
                      value={formData.scheme}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Select Scheme</option>
                      {uniqueSchemes.map((scheme) => (
                        <option key={scheme.scheme} value={scheme.scheme}>
                          {scheme.scheme_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-lg-4 col-sm-6">
                    <label className="form-label">Customer</label>
                    <ReactSelect
                        styles={customStyles}
                        value={
                          filteredCustomers
                            .map(customer => ({
                              value: customer.customer,
                              label: `(${customer.customer_details.profile_id}) - ${
                                customer.customer_details.shop_name ? customer.customer_details.shop_name + " - " : ""
                              }${customer.customer_details.first_name} ${customer.customer_details.last_name} (${customer.customer_details.contact_number})`
                            }))
                            .find(option => option.value === formData.customer) || null
                        }
                        options={filteredCustomers.map(customer => ({
                          value: customer.customer,
                          label: `(${customer.customer_details.profile_id}) - ${
                            customer.customer_details.shop_name ? customer.customer_details.shop_name + " - " : ""
                          }${customer.customer_details.first_name} ${customer.customer_details.last_name} (${customer.customer_details.contact_number})`
                        }))}
                        placeholder="Select Customer"
                        onChange={handleCustomerSelect}
                        isSearchable={true}
                        isDisabled={!formData.scheme || loading}
                      />
                    {!formData.scheme && <small className="text-muted">Select a scheme first</small>}
                  </div>

                  {formData.customer && formData.scheme && (
                    <div className="col-lg-4 col-sm-6">
                      <label className="form-label">Total Paid Amount</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={(totalPaidAmount + currentAmountInput).toFixed(2)}
                        readOnly
                        style={{ backgroundColor: '#e9ecef', fontWeight: 'bold' }}
                      />
                      <small className="text-success">
                        Previous: {totalPaidAmount.toFixed(2)} + Current: {currentAmountInput.toFixed(2)}
                      </small>
                    </div>
                  )}

                  <div className="col-lg-4 col-sm-6">
                    <label className="form-label">Amount Collected</label>
                    <input
                      type="number"
                      name="amount"
                      className="form-control form-control-sm"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Enter collection amount"
                      required
                      disabled={loading || !formData.customer}
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
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="col-lg-4 col-sm-6">
                    <label className="form-label">Payment Method</label>
                    <select
                      name="payment_method"
                      className="form-control form-control-sm"
                      value={formData.payment_method}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="cash">Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="upi">UPI</option>
                    </select>
                  </div>
                  
                  <div className="col-lg-4 col-sm-6">
                    <label className="form-label">Notes (Optional)</label>
                    <textarea
                      name="notes"
                      className="form-control form-control-sm"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Add any relevant notes here"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                {paymentHistory.length > 0 && (
                  <div className="mt-4">
                    <h6>Payment History</h6>
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Payment Method</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentHistory.map((payment, index) => (
                            <tr key={index}>
                              <td>{new Date(payment.date).toLocaleDateString()}</td>
                              <td>{parseFloat(payment.amount).toFixed(2)}</td>
                              <td>{payment.payment_method || "Cash"}</td>
                            </tr>
                          ))}
                          <tr className="table-info">
                            <td colSpan="1"><strong>Total Paid (Previous)</strong></td>
                            <td colSpan="2"><strong>{totalPaidAmount.toFixed(2)}</strong></td>
                          </tr>
                          {currentAmountInput > 0 && (
                            <tr className="table-warning">
                              <td colSpan="1"><strong>Current Entry</strong></td>
                              <td colSpan="2"><strong>{currentAmountInput.toFixed(2)}</strong></td>
                            </tr>
                          )}
                          <tr className="table-success">
                            <td colSpan="1"><strong>New Total</strong></td>
                            <td colSpan="2"><strong>{(totalPaidAmount + currentAmountInput).toFixed(2)}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                <div className="mt-3">
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={loading || !formData.customer || !formData.scheme || !formData.amount}
                  >
                    {loading ? "Adding..." : "Add Collection Entry"}
                  </button>
                </div>
              </form>
              {message && (
                <div className={`alert mt-3 ${messageType === "success" ? "alert-success" : "alert-danger"}`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddCollectionPlan;