import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { BASE_URL } from "../../api";

const PurchaseData = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [transactionId, setTransactionId] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [paymentData, setPaymentData] = useState({
        transaction: '',
        amount: '',
    });
    
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        contact_number: "",
        service: "",
        amount_paid: "",
        payment_status: "pending",
        payment_mode: "cash",
        sale_date: new Date().toISOString().split("T")[0],
        remarks: "",
        quantity: 1,
        transaction_type: "sale",
        billing_address: "",
        payments: [],
        country: "saudi",
        vat_type: "",
        
    });

    const PAYMENT_STATUS_CHOICES = [
        { value: "paid", label: "Paid" },
        { value: "unpaid", label: "Unpaid" },
        { value: "completely_paid", label: "Completely Paid" },
        { value: "pending", label: "Pending" },
    ];

    const PAYMENT_MODE_CHOICES = [
        { value: "cash", label: "Cash" },
        { value: "cheque", label: "Cheque" },
        { value: "upi", label: "UPI" },
        { value: "other", label: "Other" },
    ];
    
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/services/services/`);
                setServices(response.data);
            } catch (error) {
                console.error("Error fetching services:", error);
                setErrorMessage("Error fetching services. Please try again later.");
            }
        };
        fetchServices();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);

        const amountPaid = parseFloat(formData.amount_paid) || 0;
        const quantity = parseInt(formData.quantity, 10) || 1;

        if (isNaN(amountPaid) || isNaN(quantity)) {
            setErrorMessage("Please enter valid numbers for Amount Paid and Quantity.");
            return;
        }

        try {
           

        const transactionResponse = await axios.post(
        `${BASE_URL}/financials/transactions/`,{
            username: formData.username,
            email: formData.email,      
            contact_number: formData.contact_number,
            billing_address: formData.billing_address,
            service: formData.service,
            quantity: quantity,
            payment_status: formData.payment_status,
            payment_mode: formData.payment_mode, 
            vat_type: formData.vat_type, 
            transaction_type: formData.transaction_type,
            sale_date: formData.sale_date,
            remarks: formData.remarks
        });

        if (amountPaid > 0) {
            try {
                console.log("Sending Payment Data:", {
                    transaction: transactionResponse.data.transaction_id,
                    amount: parseFloat(amountPaid),  // Send as float
                    payment_mode: formData.payment_mode,
                    payment_date: formData.sale_date
                });
                await axios.post(`${BASE_URL}/financials/payments/create/`, {
                    transaction: transactionResponse.data.transaction_id,
                    amount: parseFloat(amountPaid),
                    payment_mode: formData.payment_mode,
                    payment_date: formData.sale_date
                });
        
            } catch (paymentError) {
                console.error("Payment Error:", paymentError.response?.data);
                setErrorMessage("Transaction created but payment failed: " + 
                    (paymentError.response?.data?.detail || "Payment creation failed"));
                return;
            }
        }
        
        setTransactionId(transactionResponse.data.transaction_id);
        setSuccessMessage(`Transaction created successfully! ID: ${transactionResponse.data.transaction_id}`);

            setFormData({
                username: "",
                email: "",
                contact_number: "",
                service: "",
                amount_paid: "",
                payment_status: "pending",
                payment_mode: "cash",
                sale_date: new Date().toISOString().split("T")[0],
                remarks: "",
                quantity: 1,
                transaction_type: "sale",
                billing_address: "",
                payments: [],
                country: "saudi",
                vat_type: "",
            });

            setSelectedService(null);
        } catch (error) {
            console.error("Error submitting form:", error);
            setErrorMessage("Failed to create transaction. Please check the details and try again.");
        }
    };

    return (
        <div className="panel">
            <form onSubmit={handleSubmit}>
           
            <div className="row g-3 mb-3">
                    <label htmlFor="username" className="col-md-2 col-form-label col-form-label-sm">
                        Username
                    </label>
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter username"
                        />
                    </div>
                </div>
                <div className="row g-3 mb-3">
                    <label htmlFor="email" className="col-md-2 col-form-label col-form-label-sm">
                        Email
                    </label>
                    <div className="col-md-6">
                        <input
                            type="email"
                            className="form-control form-control-sm"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email"
                        />
                    </div>
                </div>

                <div className="row g-3 mb-3">
                    <label htmlFor="contact_number" className="col-md-2 col-form-label col-form-label-sm">
                        Contact Number
                    </label>
                    <div className="col-md-6">
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            id="contact_number"
                            name="contact_number"
                            value={formData.contact_number}
                            onChange={handleInputChange}
                            placeholder="Enter contact number"
                        />
                    </div>
                </div>


                <div className="row g-3 mb-3">
                    <label htmlFor="billing_address" className="col-md-2 col-form-label col-form-label-sm">
                        Billing Address
                    </label>
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            id="billing_address"
                            name="billing_address"
                            value={formData.billing_address}
                            onChange={handleInputChange}
                            placeholder="Billing address"
                        />
                    </div>
                </div>
                <div className="row g-3 mb-3">
                    <label htmlFor="transaction_type" className="col-md-2 col-form-label col-form-label-sm">
                        Transaction Type
                    </label>
                    <div className="col-md-6">
                        <select
                            id="transaction_type"
                            name="transaction_type"
                            className="form-control form-control-sm"
                            value={formData.transaction_type || ""}
                            onChange={handleInputChange}
                        >
                            <option value="sale">Sale</option>
                            <option value="purchase">Purchase</option>
                        </select>
                    </div>
                </div>

                <div className="row g-3 mb-3">
                    <label htmlFor="service" className="col-md-2 col-form-label col-form-label-sm">
                        Services
                    </label>
                    <div className="col-md-6">
                        <select
                            id="service"
                            name="service"
                            className="form-control form-control-sm"
                            value={selectedService ? selectedService.id : ""}
                            onChange={(e) => {
                                const serviceId = e.target.value;
                                const foundService = services.find(s => s.id === parseInt(serviceId, 10));
                                setSelectedService(foundService);
                                setFormData({ ...formData, service: serviceId });
                            }}
                        >
                            <option value="">Select Service</option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

<div className="row g-3 mb-3">
    <label htmlFor="country" className="col-md-2 col-form-label col-form-label-sm">
        Country
    </label>
    <div className="col-md-6">
        <select
            id="country"
            name="country"
            className="form-control form-control-sm"
            value={formData.country}
            onChange={(e) => {
                const selectedCountry = e.target.value;
                setFormData({ ...formData, country: selectedCountry, vat_type: "" });
            }}
        >
            <option value="">Select Country</option>
            <option value="india">India</option>
            <option value="saudi">Saudi Arabia</option>
        </select>
    </div>
</div>

{formData.country && (
    <div className="row g-3 mb-3">
        <label htmlFor="vat_type" className="col-md-2 col-form-label col-form-label-sm">
            {formData.country === "india" ? "GST Rate" : "VAT Rate"}
        </label>
        <div className="col-md-6">
            <select
                id="vat_type"
                name="vat_type"
                className="form-control form-control-sm"
                value={formData.vat_type}
                onChange={(e) => setFormData({ ...formData, vat_type: e.target.value })}
            >
                <option value="">Select {formData.country === "india" ? "GST" : "VAT"}</option>
                {(formData.country === "india"
                    ? [
                        { value: "GST_5", label: "5% GST" },
                        { value: "GST_12", label: "12% GST" },
                        { value: "GST_18", label: "18% GST" },
                        { value: "GST_28", label: "28% GST" },
                    ]
                    : [
                        { value: "standard", label: "Standard VAT (15%)" },
                        { value: "zero_rated", label: "Zero-Rated VAT (0%)" },
                        { value: "exempt", label: "Exempt VAT (No VAT Applied)" },
                    ]
                ).map((vat) => (
                    <option key={vat.value} value={vat.value}>
                        {vat.label}
                    </option>
                ))}
            </select>
        </div>
    </div>
)}

                <div className="row g-3 mb-3">
                    <label htmlFor="payment_status" className="col-md-2 col-form-label col-form-label-sm">
                        Payment Status
                    </label>
                    <div className="col-md-6">
                        <select
                            id="payment_status"
                            name="payment_status"
                            className="form-control form-control-sm"
                            value={formData.payment_status}
                            onChange={handleInputChange}
                        >
                            {PAYMENT_STATUS_CHOICES.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="row g-3 mb-3">
                    <label htmlFor="payment_mode" className="col-md-2 col-form-label col-form-label-sm">
                        Payment Mode
                    </label>
                    <div className="col-md-6">
                        <select
                            id="payment_mode"
                            name="payment_mode"
                            className="form-control form-control-sm"
                            value={formData.payment_mode}
                            onChange={handleInputChange}
                        >
                            {PAYMENT_MODE_CHOICES.map((mode) => (
                                <option key={mode.value} value={mode.value}>
                                    {mode.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>    

                <div className="row g-3 mb-3">
                    <label htmlFor="remarks" className="col-md-2 col-form-label col-form-label-sm">
                        Remarks
                    </label>
                    <div className="col-md-6">
                        <textarea
                            className="form-control form-control-sm"
                            id="remarks"
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="Enter any remarks"
                        />
                    </div>
                </div>
                <div className="row g-3 mb-3">
                    <label htmlFor="service_price" className="col-md-2 col-form-label col-form-label-sm">
                        Service Total Price
                    </label>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            id="service_price"
                            value={selectedService ? selectedService.total_price : ''}
                            readOnly
                        />
                    </div>
                </div>

                <div className="row g-3 mb-3">
                    <label htmlFor="amount_paid" className="col-md-2 col-form-label col-form-label-sm">
                        Amount Paid
                    </label>
                    <div className="col-md-6">
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            id="amount_paid"
                            name="amount_paid"
                            value={formData.amount_paid || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="row g-3 mb-3">
                    <label htmlFor="quantity" className="col-md-2 col-form-label col-form-label-sm">
                        Quantity
                    </label>
                    <div className="col-md-6">
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            min="1"
                        />
                    </div>
                </div>

                <Button type="submit" className="btn btn-primary">
                    Submit
                </Button>
            </form>

            {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
        </div>
    );
};

export default PurchaseData;