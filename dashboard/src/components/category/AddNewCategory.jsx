import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from "../../api";
import Cookies from 'js-cookie';

const AddNewScheme = () => {
    const [schemeData, setSchemeData] = useState({
        scheme_number: '',
        name: '',
        total_amount: '',
        collection_frequency: '',
        installment_amount: '',
        start_date: '',
        end_date: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSchemeData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await axios.post(`${BASE_URL}/cashcollection/schemes/create/`, schemeData, {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("access_token")}`,
                },
        });

            setSuccess(true);
            setSchemeData({
                scheme_number: '',
                name: '',
                total_amount: '',
                collection_frequency: '',
                installment_amount: '',
                start_date: '',
                end_date: ''
            });
        } catch (err) {
            setError('Failed to create scheme. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="col-xxl-4 col-md-5">
            <div className="panel">
                <div className="panel-header">
                    <h5>Add New Scheme</h5>
                </div>
                <div className="panel-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label"> Number</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-sm"
                                    name="scheme_number"
                                    value={schemeData.scheme_number}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label"> Name</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-sm"
                                    name="name"
                                    value={schemeData.name}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Total Amount</label>
                                <input 
                                    type="number" 
                                    className="form-control form-control-sm"
                                    name="total_amount"
                                    value={schemeData.total_amount}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Collection Frequency</label>
                                <select 
                                    className="form-control form-control-sm"
                                    name="collection_frequency"
                                    value={schemeData.collection_frequency}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Frequency</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Installment Amount</label>
                                <input 
                                    type="number" 
                                    className="form-control form-control-sm"
                                    name="installment_amount"
                                    value={schemeData.installment_amount}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Start Date</label>
                                <input 
                                    type="date" 
                                    className="form-control form-control-sm"
                                    name="start_date"
                                    value={schemeData.start_date}
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
                                    value={schemeData.end_date}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <div className="col-12 d-flex justify-content-end">
                                <button className="btn btn-sm btn-primary" type="submit" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Scheme'}
                                </button>
                            </div>
                        </div>
                    </form>
                    {error && <p className="text-danger mt-2">{error}</p>}
                    {success && <p className="text-success mt-2">Scheme added successfully!</p>}
                </div>
            </div>
        </div>
    );
};

export default AddNewScheme;
