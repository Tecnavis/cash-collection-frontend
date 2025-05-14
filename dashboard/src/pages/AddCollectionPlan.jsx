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
    payment_method: "cash", // Default payment method
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [customerSchemes, setCustomerSchemes] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [uniqueSchemes, setUniqueSchemes] = useState([]);
  const [selectedSchemeTotal, setSelectedSchemeTotal] = useState(0);
  const [baseAmount, setBaseAmount] = useState(204000);
  const [multiplier, setMultiplier] = useState(1);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    fetchCustomerSchemes();
  }, []);

  // Update balance amount whenever relevant values change
  useEffect(() => {
    const currentAmount = formData.amount ? parseFloat(formData.amount) || 0 : 0;
    const balance = selectedSchemeTotal - totalPaidAmount - currentAmount;
    setBalanceAmount(balance);
  }, [totalPaidAmount, selectedSchemeTotal, formData.amount]);

  const fetchCustomerSchemes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/cashcollection/customer-schemes/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });

      setCustomerSchemes(response.data);

      // Extract unique schemes
      const schemes = Array.from(new Set(response.data.map((scheme) => scheme.scheme))).map(
        (schemeId) => response.data.find((s) => s.scheme === schemeId)
      );
      setUniqueSchemes(schemes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching schemes:", error);
      setMessage("Failed to load customer schemes. Please refresh the page.");
      setMessageType("error");
      setLoading(false);
    }
  };

  // Fetch payment history for a specific customer and scheme using the CustomerSchemePaymentSerializer
  const fetchPaymentHistory = async (customerId, schemeId) => {
    try {
      setLoading(true);
      // Get all scheme payments through the customer_scheme_payment_list endpoint
      const response = await axios.get(`${BASE_URL}/cashcollection/customer-scheme-payments/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
      
      // Find the payments for the specific customer and scheme
      const customerPayments = response.data.filter(payment => {
        return payment.customer_details && 
               payment.customer_details.id === parseInt(customerId) && 
               payment.scheme_name && 
               payment.scheme_name === uniqueSchemes.find(s => s.scheme === parseInt(schemeId))?.scheme_name;
      });
      
      if (customerPayments.length > 0) {
        const paymentHistoryData = customerPayments[0].payment_history || [];
        
        // Sort payment history by date (most recent first)
        const sortedPaymentHistory = [...paymentHistoryData].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
        setPaymentHistory(sortedPaymentHistory);
        
        // Calculate total paid amount from payment history
        const totalPaid = paymentHistoryData.reduce(
          (sum, payment) => sum + parseFloat(payment.amount), 
          0
        );
        
        setTotalPaidAmount(totalPaid);
      } else {
        // No payment history found
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
  
  // Extract the multiplier from customer name and update the total scheme amount
  const handleCustomerSelect = async (selectedOption) => {
    if (selectedOption) {
      const customerId = selectedOption.value;
      const customerName = selectedOption.label;
      
      // Extract the number after the name (e.g., "vin 2" -> 2)
      const nameMatch = customerName.match(/(\w+)\s+(\d+)/);
      
      if (nameMatch && nameMatch[2]) {
        const extractedMultiplier = parseInt(nameMatch[2], 10);
        setMultiplier(extractedMultiplier || 1);
        setSelectedSchemeTotal(baseAmount * extractedMultiplier);
      } else {
        setMultiplier(1);
        setSelectedSchemeTotal(baseAmount);
      }
      
      setFormData({ ...formData, customer: customerId });
      
      // Fetch payment history for this customer and scheme
      if (formData.scheme) {
        await fetchPaymentHistory(customerId, formData.scheme);
      }
    } else {
      setFormData({ ...formData, customer: "" });
      setMultiplier(1);
      setSelectedSchemeTotal(baseAmount);
      setTotalPaidAmount(0);
      setPaymentHistory([]);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "scheme") {
      const selectedScheme = uniqueSchemes.find((s) => s.scheme === Number(value));
      setFormData({ ...formData, scheme: value, customer: "" });
      setFilteredCustomers(customerSchemes.filter((cs) => cs.scheme === Number(value)));
      
      // Reset the scheme total to the base amount initially
      const schemeAmount = selectedScheme ? parseFloat(selectedScheme.scheme_total_amount) : 204000;
      setBaseAmount(schemeAmount);
      setSelectedSchemeTotal(schemeAmount);
      setMultiplier(1);
      setTotalPaidAmount(0);
      setPaymentHistory([]);
    } else if (name === "amount") {
      // Calculate current remaining balance
      const remainingBalance = selectedSchemeTotal - totalPaidAmount;
      const amountValue = parseFloat(value);
      
      if (amountValue > remainingBalance) {
        setMessage(`Amount cannot exceed remaining balance of ${remainingBalance.toFixed(2)}`);
        setMessageType("error");
      } else {
        setMessage("");
      }
      
      setFormData({ ...formData, [name]: value });
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

    const remainingBalance = selectedSchemeTotal - totalPaidAmount;
    if (Number(formData.amount) > remainingBalance) {
      setMessage(`Amount cannot exceed remaining balance of ${remainingBalance.toFixed(2)}`);
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
      
      // Temporarily store the submitted amount for current display
      const submittedAmount = parseFloat(formData.amount);
      
      // Add the new payment to the payment history (optimistically)
      const newPayment = {
        amount: submittedAmount,
        payment_method: formData.payment_method,
        date: new Date().toISOString()
      };
      
      setPaymentHistory([newPayment, ...paymentHistory]);
      
      // Update UI with new total paid amount
      setTotalPaidAmount(prevTotal => prevTotal + submittedAmount);
      
      // Reset the form but maintain customer and scheme selection
      setFormData({
        customer: formData.customer,
        scheme: formData.scheme, 
        amount: "", 
        collection_date: new Date().toISOString().split("T")[0],
        payment_method: "cash",
        notes: "",
      });
      
      // Refresh payment history from the server to get the official record
      if (formData.customer && formData.scheme) {
        await fetchPaymentHistory(formData.customer, formData.scheme);
      }

      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      console.error("API Error:", error.response?.data);
    
      // Show specific validation message if available
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

                  {formData.scheme && (
                    <div className="col-lg-4 col-sm-6">
                      <label className="form-label">Total Scheme Amount (Base: {baseAmount.toFixed(2)} × {multiplier})</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={selectedSchemeTotal.toFixed(2)}
                        readOnly
                      />
                    </div>
                  )}

                  {formData.customer && formData.scheme && (
                    <div className="col-lg-4 col-sm-6">
                      <label className="form-label">Total Paid Amount</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={totalPaidAmount.toFixed(2)}
                        readOnly
                      />
                      <small className="text-muted">Already collected payments</small>
                    </div>
                  )}

                  {formData.customer && formData.scheme && (
                    <div className="col-lg-4 col-sm-6">
                      <label className="form-label">Balance Amount (After Current Payment)</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={balanceAmount.toFixed(2)}
                        readOnly
                      />
                      <small className="text-muted">Remaining balance after current payment</small>
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
                    {formData.customer && formData.scheme && (
                      <small className="text-muted">
                        Max amount: {(selectedSchemeTotal - totalPaidAmount).toFixed(2)}
                      </small>
                    )}
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
                            <td colSpan="1"><strong>Total Paid</strong></td>
                            <td colSpan="2"><strong>{totalPaidAmount.toFixed(2)}</strong></td>
                          </tr>
                          <tr className="table-light">
                            <td colSpan="1"><strong>Remaining Balance</strong></td>
                            <td colSpan="2"><strong>{(selectedSchemeTotal - totalPaidAmount).toFixed(2)}</strong></td>
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