// import React, { useState } from 'react'
// import ProductDataTab from './ProductDataTab'
// import PurchaseData from './PurchaseData'

// const PurchasesData = () => {
//     const [productDataBtn,SetProductDataBtn] = useState(false)

//     const handleProductDataBtn = () => {
//         SetProductDataBtn(!productDataBtn)
//     }
//   return (
//     <div className="panel mb-30">
//         <div className="panel-header">
//             <h5>Purchase Details</h5>
//             {/* <div className="btn-box d-flex gap-2">
//                 <button className="btn btn-sm btn-icon btn-outline-primary panel-close" onClick={handleProductDataBtn}><i className="fa-light fa-angle-up"></i></button>
//             </div> */}
//         </div>
//         <div className={`panel-body ${productDataBtn? 'd-none':''}`}>
//            {/* <ProductDataTab/> */}
//            <PurchaseData/>
//         </div>
//     </div>
//   )
// }

// export default PurchasesData




// import React, { useState, useEffect } from 'react';
// import { Form, Button } from 'react-bootstrap';
// import axios from 'axios';

// const PurchasesData = () => {
//   const [services, setServices] = useState([]);
//   const [formData, setFormData] = useState({
//     customer: '',
//     service: '',
//     amount_paid: '',
//     payment_status: 'pending',
//     payment_mode: '',
//     tax_rate: 'none',
//     sale_date: new Date().toISOString().split('T')[0],
//     remarks: '',
//     total_amount: '',
//     transaction_type: 'sale',
//   });

//   const PAYMENT_STATUS_CHOICES = [
//     { value: "paid", label: "Paid" },
//     { value: "unpaid", label: "Unpaid" },
//     { value: "completely_paid", label: "Completely Paid" },
//     { value: "pending", label: "Pending" }
//   ];

//   const PAYMENT_MODE_CHOICES = [
//     { value: "cash", label: "Cash" },
//     { value: "cheque", label: "Cheque" },
//     { value: "upi", label: "UPI" },
//     { value: "other", label: "Other" }
//   ];

//   const TAX_CHOICES = [
//     { value: "GST_5", label: "5% GST" },
//     { value: "GST_12", label: "12% GST" },
//     { value: "GST_18", label: "18% GST" },
//     { value: "GST_28", label: "28% GST" },
//     { value: "none", label: "No Tax" }
//   ];

//   const TRANSACTION_TYPE_CHOICES = [
//     { value: "sale", label: "Sale" },
//     { value: "purchase", label: "Purchase" }
//   ];

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/api/v1/services/');
//         setServices(response.data);
//       } catch (error) {
//         console.error('Error fetching services:', error);
//       }
//     };
//     fetchServices();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://127.0.0.1:8000/api/v1/transactions/', formData);
//       alert('Transaction created successfully!');
//       setFormData({
//         customer: '',
//         service: '',
//         amount_paid: '',
//         payment_status: 'pending',
//         payment_mode: '',
//         tax_rate: 'none',
//         sale_date: new Date().toISOString().split('T')[0],
//         remarks: '',
//         total_amount: '',
//         transaction_type: 'sale',
//       });
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert('Failed to create transaction.');
//     }
//   };

//   return (
//     <div className="panel">
//       <form onSubmit={handleSubmit}>
//         {/* Customer (Text Input) */}
//         <div className="row g-3 mb-3">
//           <label htmlFor="customer" className="col-md-2 col-form-label col-form-label-sm">Customer</label>
//           <div className="col-md-6">
//             <input 
//               type="text" 
//               className="form-control form-control-sm" 
//               id="customer" 
//               name="customer" 
//               value={formData.customer} 
//               onChange={handleInputChange} 
//               placeholder="Enter customer name"
//             />
//           </div>
//         </div>

//         {/* Service */}
//         <div className="row g-3 mb-3">
//           <label htmlFor="service" className="col-md-2 col-form-label col-form-label-sm">Service</label>
//           <div className="col-md-6">
//             <select id="service" name="service" className="form-control form-control-sm" value={formData.service} onChange={handleInputChange}>
//               <option value="">Select Service</option>
//               {services.map((service) => (
//                 <option key={service.id} value={service.id}>{service.name}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Amount Paid */}
//         <div className="row g-3 mb-3">
//           <label htmlFor="amount_paid" className="col-md-2 col-form-label col-form-label-sm">Amount Paid</label>
//           <div className="col-md-6">
//             <input 
//               type="number" 
//               className="form-control form-control-sm" 
//               id="amount_paid" 
//               name="amount_paid" 
//               value={formData.amount_paid} 
//               onChange={handleInputChange} 
//             />
//           </div>
//         </div>

//         {/* Payment Status */}
//         <div className="row g-3 mb-3">
//           <label htmlFor="payment_status" className="col-md-2 col-form-label col-form-label-sm">Payment Status</label>
//           <div className="col-md-6">
//             <select id="payment_status" name="payment_status" className="form-control form-control-sm" value={formData.payment_status} onChange={handleInputChange}>
//               {PAYMENT_STATUS_CHOICES.map((status) => (
//                 <option key={status.value} value={status.value}>{status.label}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Payment Mode */}
//         <div className="row g-3 mb-3">
//           <label htmlFor="payment_mode" className="col-md-2 col-form-label col-form-label-sm">Payment Mode</label>
//           <div className="col-md-6">
//             <select id="payment_mode" name="payment_mode" className="form-control form-control-sm" value={formData.payment_mode} onChange={handleInputChange}>
//               {PAYMENT_MODE_CHOICES.map((mode) => (
//                 <option key={mode.value} value={mode.value}>{mode.label}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Tax Rate */}
//         <div className="row g-3 mb-3">
//           <label htmlFor="tax_rate" className="col-md-2 col-form-label col-form-label-sm">Tax Rate</label>
//           <div className="col-md-6">
//             <select id="tax_rate" name="tax_rate" className="form-control form-control-sm" value={formData.tax_rate} onChange={handleInputChange}>
//               {TAX_CHOICES.map((tax) => (
//                 <option key={tax.value} value={tax.value}>{tax.label}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="row g-3">
//           <div className="col-md-10 offset-md-2">
//             <Button type="submit" className="btn btn-primary btn-sm">Create Transaction</Button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default  PurchasesData;
