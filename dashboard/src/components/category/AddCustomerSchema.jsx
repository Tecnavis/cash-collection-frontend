import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";
import ReactSelect from "react-select";

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        background: "#fff",
        borderColor: state.isFocused ? "#007bff" : "#ced4da",
        minHeight: "38px",
        height: "38px",
        boxShadow: state.isFocused ? "0 0 0 2px rgba(0, 123, 255, 0.25)" : "none",
        "&:hover": {
            borderColor: "#007bff",
        },
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "#6c757d",
        fontSize: "14px",
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#007bff" : state.isFocused ? "#e9f5ff" : "#fff",
        color: state.isSelected ? "#fff" : "#333",
        padding: "10px",
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "#333",
        fontSize: "14px",
    }),
};

const AddCashCollection = () => {
    const [formData, setFormData] = useState({
        scheme: null,
        start_date: "",
        end_date: "",
        customer: null,
    });

    const [schemes, setSchemes] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [schemesRes, customersRes] = await Promise.all([
                    axios.get(`${BASE_URL}/cashcollection/schemes/`, {
                        headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
                    }),
                    axios.get(`${BASE_URL}/partner/customers/`, {
                        headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
                    }),
                ]);
                setSchemes(schemesRes.data);
                setCustomers(customersRes.data);
            } catch (err) {
                setError("Failed to load data. Please refresh.");
            }
        };
        fetchData();
    }, []);

    const handleSchemeSelect = (selectedOption) => {
        if (selectedOption) {
            const selectedScheme = schemes.find((scheme) => scheme.id === selectedOption.value);
            setFormData({
                ...formData,
                scheme: selectedOption, // Storing entire object for displaying selected name
                start_date: selectedScheme?.start_date || "",
                end_date: selectedScheme?.end_date || "",
            });
        } else {
            setFormData({ ...formData, scheme: null, start_date: "", end_date: "" });
        }
    };

    const handleCustomerSelect = (selectedOption) => {
        setFormData((prev) => ({ ...prev, customer: selectedOption || null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (new Date(formData.start_date) >= new Date(formData.end_date)) {
            setError("Start date must be before end date.");
            setLoading(false);
            return;
        }

        try {
            await axios.post(
                `${BASE_URL}/cashcollection/cashcollection/create/`,
                {
                    scheme: formData.scheme?.value, // Sending only ID
                    customer: formData.customer?.value, // Sending only ID
                    start_date: formData.start_date,
                    end_date: formData.end_date,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookies.get("access_token")}`,
                    },
                }
            );
            setSuccess(true);
            setFormData({ scheme: null, start_date: "", end_date: "", customer: null });
        } catch (err) {
            console.error("Error details:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Failed to create collection. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="col-xxl-4 col-md-5">
            <div className="panel">
                <div className="panel-header">
                    <h5>Add New Cash Collection</h5>
                </div>
                <div className="panel-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            {/* Scheme Dropdown with Search */}
                            <div className="col-12">
                                <label className="form-label">Scheme</label>
                                <ReactSelect
                                    styles={customStyles}
                                    value={formData.scheme}
                                    options={schemes.map((scheme) => ({
                                        value: scheme.id,
                                        label: `${scheme.name} (${scheme.scheme_number})`,
                                    }))}
                                    placeholder="Select Scheme"
                                    onChange={handleSchemeSelect}
                                    isSearchable={true}
                                />
                            </div>

                            {/* Customer Dropdown with Search */}
                            <div className="col-12">
                                <label className="form-label">Customer</label>
                                <ReactSelect
                                    styles={customStyles}
                                    value={formData.customer}
                                    options={customers.map((customer) => ({
                                        value: customer.id,
                                        label: `${customer.user.first_name} ${customer.user.last_name} (${customer.user.email} - ${customer.profile_id})`,
                                    }))}
                                    placeholder="Select Customer"
                                    onChange={handleCustomerSelect}
                                    isSearchable={true}
                                />
                            </div>

                            {/* Start Date */}
                            <div className="col-12">
                                <label className="form-label">Start Date</label>
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    required
                                />
                            </div>

                            {/* End Date */}
                            <div className="col-12">
                                <label className="form-label">End Date</label>
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="col-12 d-flex justify-content-end">
                                <button className="btn btn-sm btn-primary" type="submit" disabled={loading}>
                                    {loading ? "Saving..." : "Save Collection"}
                                </button>
                            </div>
                        </div>
                    </form>
                    {error && <p className="text-danger mt-2">{error}</p>}
                    {success && <p className="text-success mt-2">Collection added successfully!</p>}
                </div>
            </div>
        </div>
    );
};

export default AddCashCollection;
