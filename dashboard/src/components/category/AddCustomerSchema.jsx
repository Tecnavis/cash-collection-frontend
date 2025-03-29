import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";
import ReactSelect from 'react-select'; 

const AddCashCollection = () => {
    const [formData, setFormData] = useState({
        scheme: "",
        start_date: "",
        end_date: "",
        customer: "",  
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Function to handle scheme selection
    const handleSchemeSelect = (e) => {
        const schemeId = parseInt(e.target.value, 10);
        const selectedScheme = schemes.find(scheme => scheme.id === schemeId);

        if (selectedScheme) {
            setFormData({
                ...formData,
                scheme: schemeId,
                start_date: selectedScheme.start_date,
                end_date: selectedScheme.end_date
            });
        }
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
            await axios.post(`${BASE_URL}/cashcollection/cashcollection/create/`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("access_token")}`,
                },
            });

            setSuccess(true);
            setFormData({ scheme: "", start_date: "", end_date: "", customer: "" });
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
                            <div className="col-12">
                                <label className="form-label">Scheme</label>
                                <select
                                    className="form-control form-control-sm"
                                    name="scheme"
                                    value={formData.scheme}
                                    onChange={handleSchemeSelect}
                                    required
                                >
                                    <option value="">Select Scheme</option>
                                    {schemes.map((scheme) => (
                                        <option key={scheme.id} value={scheme.id}>
                                            {scheme.name} ({scheme.scheme_number})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Customer</label>
                                <ReactSelect
                                    className="form-control form-control-sm"
                                    name="customer"
                                    value={customers.find((c) => c.id === formData.customer) || null}
                                    options={customers.map((customer) => ({
                                        value: customer.id,
                                        label: `${customer.user.first_name} ${customer.user.last_name} (${customer.user.email}(${customer.profile_id})`,
                                    }))}
                                    placeholder="Select Customer"
                                    onChange={(selectedOption) =>
                                        handleInputChange("customer", selectedOption ? selectedOption.value : "")
                                    }
                                    isSearchable={true} // Enables search
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Start Date</label>
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label">End Date</label>
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
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
