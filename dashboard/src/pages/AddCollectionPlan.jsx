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
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [customerSchemes, setCustomerSchemes] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [uniqueSchemes, setUniqueSchemes] = useState([]);
  const [selectedSchemeTotal, setSelectedSchemeTotal] = useState(0);
  const [baseAmount, setBaseAmount] = useState(204000); // Base amount set to 204000
  const [multiplier, setMultiplier] = useState(1); // Default multiplier

  useEffect(() => {
    fetchCustomerSchemes();
  }, []);

  const fetchCustomerSchemes = async () => {
    try {
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
    } catch (error) {
      console.error("Error fetching schemes:", error);
      setMessage("Failed to load customer schemes. Please refresh the page.");
      setMessageType("error");
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
  const handleCustomerSelect = (selectedOption) => {
    if (selectedOption) {
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
      
      setFormData({ ...formData, customer: selectedOption.value });
    } else {
      setFormData({ ...formData, customer: "" });
      setMultiplier(1);
      setSelectedSchemeTotal(baseAmount);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "scheme") {
      const selectedScheme = uniqueSchemes.find((s) => s.scheme === Number(value));
      setFormData({ ...formData, scheme: value, customer: "" });
      setFilteredCustomers(customerSchemes.filter((cs) => cs.scheme === Number(value)));
      
      // Reset the scheme total to the base amount initially
      setBaseAmount(selectedScheme ? parseFloat(selectedScheme.scheme_total_amount) : 204000);
      setSelectedSchemeTotal(selectedScheme ? parseFloat(selectedScheme.scheme_total_amount) : 204000);
      setMultiplier(1);
    } else if (name === "amount") {
      // Prevent amount from exceeding total scheme amount
      const amountValue = parseFloat(value);
      if (amountValue > selectedSchemeTotal) {
        setMessage(`Amount cannot exceed total scheme amount of ${selectedSchemeTotal}`);
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

    if (Number(formData.amount) > selectedSchemeTotal) {
      setMessage(`Amount cannot exceed total scheme amount of ${selectedSchemeTotal}`);
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
      setFormData({
        customer: "",
        scheme: "",
        amount: "",
        collection_date: new Date().toISOString().split("T")[0],
        notes: "",
      });
      setFilteredCustomers([]);
      setMultiplier(1);
      setSelectedSchemeTotal(204000);

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
                      />
                    {!formData.scheme && <small className="text-muted">Select a scheme first</small>}
                  </div>

                  {formData.scheme && (
                    <div className="col-lg-4 col-sm-6">
                      <label className="form-label">Total Scheme Amount (Base: {baseAmount} × {multiplier})</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={selectedSchemeTotal}
                        readOnly
                      />
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
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Adding..." : "Add Collection Entry"}
                  </button>
                </div>
              </form>
              {message && (
                <p className={`mt-2 text-${messageType === "success" ? "success" : "danger"}`}>
                  {message}
                </p>
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