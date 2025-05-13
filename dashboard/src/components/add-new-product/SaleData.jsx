import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";
import ReactSelect from "react-select";

const SaleData = () => {
    const [services, setServices] = useState([]);
    const [partners, setPartners] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [transactionId, setTransactionId] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [errors, setErrors] = useState({}); 
    const [quantity, setQuantity] = useState(1);
    const [paymentData, setPaymentData] = useState({
        transaction: '',
        amount: '',
    });
   
    const [formData, setFormData] = useState({
        username: "",
        service: "",
        partner: "", // This will hold the partner ID
        amount_paid: "",
        payment_mode: "cash",
        sale_date: new Date().toISOString().split("T")[0],
        remarks: "",
        quantity: 1,
        transaction_type: "sale",
        billing_address: "",
        country: "saudi",
        vat_type: "",
        discount_amount:"",
    });

    const getAuthHeader = () => {
        const token = Cookies.get('access_token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const PAYMENT_MODE_CHOICES = [
        { value: "cash", label: "Cash" },
        { value: "cheque", label: "Cheque" },
        { value: "upi", label: "UPI" },
        { value: "other", label: "Other" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authHeader = getAuthHeader();
    
                // Fetch services
                const servicesResponse = await axios.get(`${BASE_URL}/services/services/`);
                setServices(servicesResponse.data);
                
                // Fetch all partners with authentication headers
                const partnersResponse = await axios.get(`${BASE_URL}/partner/partner/`, {
                    headers: authHeader
                });
    
                setPartners(partnersResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setErrorMessage("Error fetching necessary data. Please try again later.");
            }
        };
        fetchData();
    }, []);

    
    const filteredPartners = partners.filter(partner => {
        if (formData.transaction_type === "sale") {
            return partner.partner_type === "customer";
        } else {
            return partner.partner_type === "vendor";
        }
    });

    const validateForm = () => {
        let newErrors = {};
    
        if (!formData.partner) {
            newErrors.partner = formData.transaction_type === "sale" 
                ? "Please select a customer" 
                : "Please select a vendor";
        }
        if (!formData.service) {
            newErrors.service = "Please select a service";
        }
        if (!formData.billing_address.trim()) {
            newErrors.billing_address = "Billing address is required";
        }
        if (!formData.country.trim()) {
            newErrors.country = "Country is required";
        }
        if (!formData.transaction_type.trim()) {
            newErrors.transaction_type = "Transaction type is required";
        }
        if (!formData.payment_mode.trim()) {
            newErrors.payment_mode = "Payment mode is required";
        }
        if (!formData.sale_date.trim()) {
            newErrors.sale_date = "Sale date is required";
        }
        if (!formData.vat_type.trim()) {
            newErrors.vat_type = "VAT type is required";
        }
        if (!formData.quantity || formData.quantity <= 0) {
            newErrors.quantity = "Quantity must be at least 1";
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Reset partner selection when transaction type changes
        if (name === "transaction_type") {
            setFormData(prev => ({
                ...prev,
                partner: ""
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        const amountPaid = parseFloat(formData.amount_paid) || 0;
        const quantity = parseInt(formData.quantity, 10) || 1;

        if (isNaN(amountPaid) || isNaN(quantity)) {
            setErrorMessage("Please enter valid numbers for Amount Paid and Quantity.");
            return;
        }

        if (!validateForm()) return;

        try {
            const transactionResponse = await axios.post(
                `${BASE_URL}/financials/transactions/`,
                {
                    billing_address: formData.billing_address,
                    service: formData.service,
                    partner: formData.partner,
                    partner_type: formData.transaction_type === "sale" ? "customer" : "vendor",
                    quantity: quantity,
                    payment_mode: formData.payment_mode,
                    vat_type: formData.vat_type,
                    transaction_type: formData.transaction_type,
                    sale_date: formData.sale_date,
                    remarks: formData.remarks,
                    discount_amount: formData.discount_amount === "" ? 0 : formData.discount_amount,
                },
                {
                    headers: {
                        ...getAuthHeader()
                    }
                }     
            );
            if (amountPaid > 0) {
                try {
                    console.log("Sending Payment Data:", {
                        transaction: transactionResponse.data.transaction_id,
                        amount: parseFloat(amountPaid),
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
                service: "",
                partner: "",
                amount_paid: "",
                payment_mode: "cash",
                sale_date: new Date().toISOString().split("T")[0],
                remarks: "",
                quantity: 1,
                transaction_type: "sale",
                billing_address: "",
                country: "saudi",
                vat_type: "",
                discount_amount: "",
            });
            setSelectedService(null); 

        } catch (error) {
            console.error("Error submitting form:", error);
            // More specific error handling
            if (error.response) {
                setErrorMessage(`Failed to create transaction: ${error.response.data.message || error.response.status}`);
            } else if (error.request) {
                setErrorMessage("Failed to create transaction: No response from server.");
            } else {
                setErrorMessage("Failed to create transaction: A network error occurred.");
            }
        }
    };

    return (
        <div className="panel">
            <form onSubmit={handleSubmit}>

            {Object.keys(errors).length > 0 && (
                <div className="alert alert-danger">
                    <ul>
                        {Object.entries(errors).map(([key, value]) => (
                            <li key={key}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
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

                {/* <div className="row g-3 mb-3">
                    <label htmlFor="partner" className="col-md-2 col-form-label col-form-label-sm">
                        {formData.transaction_type === "sale" ? "Customer" : "Vendor"}
                    </label>
                    <div className="col-md-6">
                    <select
                        id="partner"
                        name="partner"
                        className="form-control form-control-sm"
                        value={formData.partner}
                        onChange={handleInputChange}
                    >
                        <option value="">Select {formData.transaction_type === "sale" ? "Customer" : "Vendor"}</option>
                        {filteredPartners.map((partner) => (
                            <option key={partner.id} value={partner.id}>
                                {partner.first_name} {partner.last_name}
                            </option>
                        ))}
                    </select>

                    </div>
                </div> */}

                <div className="row g-3 mb-3">
                    <label
                        htmlFor="partner"
                        className="col-md-2 col-form-label col-form-label-sm"
                    >
                        {formData.transaction_type === "sale" ? "Customer" : "Vendor"}
                    </label>
                    <div className="col-md-6">
                            <ReactSelect
                                id="partner"
                                name="partner"
                                value={filteredPartners.find((p) => p.id === formData.partner) || null}
                                options={[
                                    ...filteredPartners,
                                    { id: "custom-option", first_name: "Custom", last_name: "Option" }, 
                                ]}
                                placeholder={`Select ${formData.transaction_type === "sale" ? "Customer" : "Vendor"}`}
                                onChange={(selectedOption) => 
                                    handleInputChange({ 
                                        target: { name: "partner", value: selectedOption ? selectedOption.id : "" } 
                                    })
                                }
                                isSearchable={true}
                                getOptionLabel={(option) => `${option.first_name} ${option.last_name}`} 
                                getOptionValue={(option) => option.id} 
                                styles={{
                                    control: (provided, state) => ({
                                        ...provided,
                                        minHeight: "31px",
                                        borderRadius: "4px",
                                        borderColor: state.isFocused ? "#ced4da" : "#ced4da",
                                        boxShadow: "none",
                                        backgroundColor: "white",
                                        "&:hover": { borderColor: "#ced4da" },
                                    }),
                                    valueContainer: (provided) => ({
                                        ...provided,
                                        padding: "0px 5px",
                                    }),
                                    input: (provided) => ({
                                        ...provided,
                                        margin: "0px",
                                        padding: "0px",
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        zIndex: 1050, 
                                    }),
                                }}
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
                    <label htmlFor="discount" className="col-md-2 col-form-label col-form-label-sm">
                        Discount Amount
                    </label>
                    <div className="col-md-4">
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            id="discount"
                            name="discount_amount"
                            value={formData.discount_amount === 0 ? '' : formData.discount_amount}
                            onChange={(e) => {
                                const val = e.target.value;
                                setFormData({ 
                                    ...formData, 
                                    discount_amount: val === '' ? '' : parseFloat(val) || 0 
                                });
                            }}
                            min="0"
                        />
                    </div>
                </div>

                <div className="row g-3 mb-3">
                    <label htmlFor="service_price" className="col-md-2 col-form-label col-form-label-sm">
                        Quantity Based Price (After Discount)
                    </label>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            id="service_price"
                            value={
                                selectedService 
                                    ? Math.max(0, (selectedService.total_price * (formData.quantity || 1)) - (formData.discount_amount || 0))
                                    : ''
                            }
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
                <Button type="submit" className="btn btn-primary">
                    Submit
                </Button>
            </form>

            {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
        </div>
    );
};
export default SaleData;


