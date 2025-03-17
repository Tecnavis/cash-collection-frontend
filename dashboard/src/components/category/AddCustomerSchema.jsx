// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { BASE_URL } from "../../api";
// import Cookies from "js-cookie";

// const AddCashCollection = () => {
//     const [formData, setFormData] = useState({
//         scheme: "",
//         start_date: "",
//         end_date: "",
//         customer: "",
//     });

//     const [schemes, setSchemes] = useState([]);
//     const [customer, setCustomer] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(false);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [schemesRes, customerRes] = await Promise.all([
//                     axios.get(`${BASE_URL}/cashcollection/schemes/`, {
//                         headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
//                     }),
//                     axios.get(`${BASE_URL}/partner/customers/`, {
//                         headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
//                     }),
//                 ]);
//                 setSchemes(schemesRes.data);
//                 setCustomers(customersRes.data);
//             } catch (err) {
//                 setError("Failed to load data. Please refresh.");
//             }
//         };
//         fetchData();
//     }, []);

//     // Handle input changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);
//         setSuccess(false);

//         if (new Date(formData.start_date) >= new Date(formData.end_date)) {
//             setError("Start date must be before end date.");
//             setLoading(false);
//             return;
//         }

//         try {
//             await axios.post(`${BASE_URL}/cashcollection/cashcollection/create/`, formData, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${Cookies.get("access_token")}`,
//                 },
//             });

//             setSuccess(true);
//             setFormData({ scheme: "", start_date: "", end_date: "", customers:"" });
//         } catch (err) {
//             setError("Failed to create collection. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="col-xxl-5 col-md-6">
//             <div className="panel">
//                 <div className="panel-header">
//                     <h5>Add New Cash Collection</h5>
//                 </div>
//                 <div className="panel-body">
//                     <form onSubmit={handleSubmit}>
//                         <div className="row g-3">
//                             {/* Scheme Selection */}
//                             <div className="col-12">
//                                 <label className="form-label">Scheme</label>
//                                 <select
//                                     className="form-control form-control-sm"
//                                     name="scheme"
//                                     value={formData.scheme}
//                                     onChange={handleChange}
//                                     required
//                                 >
//                                     <option value="">Select Scheme</option>
//                                     {schemes.map((scheme) => (
//                                         <option key={scheme.id} value={scheme.id}>
//                                             {scheme.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="col-12">
//                                 <label className="form-label">Customers</label>
//                                 <select
//                                     className="form-control form-control-sm"
//                                     name="customers"
//                                     value={formData.customers}
//                                     onChange={handleChange}
//                                     required
//                                 >
//                                     <option value="">Select Customer</option>
//                                     {customers.map((customer) => (
//                                         <option key={customer.id} value={customer.id}>
//                                             {customer.user.first_name} {customer.user.last_name} ({customer.user.email})
//                                         </option>
//                                     ))}
//                                 </select>

//                             </div>

//                             {/* Start Date */}
//                             <div className="col-12">
//                                 <label className="form-label">Start Date</label>
//                                 <input
//                                     type="date"
//                                     className="form-control form-control-sm"
//                                     name="start_date"
//                                     value={formData.start_date}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>

//                             {/* End Date */}
//                             <div className="col-12">
//                                 <label className="form-label">End Date</label>
//                                 <input
//                                     type="date"
//                                     className="form-control form-control-sm"
//                                     name="end_date"
//                                     value={formData.end_date}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
                            
//                             {/* Submit Button */}
//                             <div className="col-12 d-flex justify-content-end">
//                                 <button className="btn btn-sm btn-primary" type="submit" disabled={loading}>
//                                     {loading ? "Saving..." : "Save Collection"}
//                                 </button>
//                             </div>
//                         </div>
//                     </form>

//                     {/* Success & Error Messages */}
//                     {error && <p className="text-danger mt-2">{error}</p>}
//                     {success && <p className="text-success mt-2">Collection added successfully!</p>}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddCashCollection;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";

const AddCashCollection = () => {
    const [formData, setFormData] = useState({
        scheme: "",
        start_date: "",
        end_date: "",
        customer: "",  // Changed from customers to customer
    });

    const [schemes, setSchemes] = useState([]);
    const [customers, setCustomers] = useState([]); // Fixed variable name
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [schemesRes, customersRes] = await Promise.all([  // Fixed variable name
                    axios.get(`${BASE_URL}/cashcollection/schemes/`, {
                        headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
                    }),
                    axios.get(`${BASE_URL}/partner/customers/`, {
                        headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
                    }),
                ]);
                setSchemes(schemesRes.data);
                setCustomers(customersRes.data);  // Fixed variable name
            } catch (err) {
                setError("Failed to load data. Please refresh.");
            }
        };
        fetchData();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
            setFormData({ scheme: "", start_date: "", end_date: "", customer: "" }); // Changed from customers to customer
        } catch (err) {
            console.error("Error details:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Failed to create collection. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="col-xxl-5 col-md-6">
            <div className="panel">
                <div className="panel-header">
                    <h5>Add New Cash Collection</h5>
                </div>
                <div className="panel-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            {/* Scheme Selection */}
                            <div className="col-12">
                                <label className="form-label">Scheme</label>
                                <select
                                    className="form-control form-control-sm"
                                    name="scheme"
                                    value={formData.scheme}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Scheme</option>
                                    {schemes.map((scheme) => (
                                        <option key={scheme.id} value={scheme.id}>
                                            {scheme.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12">
                                <label className="form-label">Customer</label>
                                <select
                                    className="form-control form-control-sm"
                                    name="customer"  // Changed from customers to customer
                                    value={formData.customer}  // Changed from customers to customer
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Customer</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.user.first_name} {customer.user.last_name} ({customer.user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Start Date */}
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

                            {/* End Date */}
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
                            
                            {/* Submit Button */}
                            <div className="col-12 d-flex justify-content-end">
                                <button className="btn btn-sm btn-primary" type="submit" disabled={loading}>
                                    {loading ? "Saving..." : "Save Collection"}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Success & Error Messages */}
                    {error && <p className="text-danger mt-2">{error}</p>}
                    {success && <p className="text-success mt-2">Collection added successfully!</p>}
                </div>
            </div>
        </div>
    );
};

export default AddCashCollection;