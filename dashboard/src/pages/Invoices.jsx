import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { BASE_URL } from "../api";
import Cookies from 'js-cookie';

const InvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .invoice-container, .invoice-container * {
          visibility: visible;
        }
        .invoice-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .btn-box {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getAuthHeader = () => {
    const token = Cookies.get('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchInvoiceData();
  }, [id]);

  const fetchInvoiceData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/financials/transactions/${id}/`, {
        headers: { ...getAuthHeader() }
      });
      setInvoiceData(response.data);
      
      if (response.data.created_by) {
        fetchCreatorDetails(response.data.created_by);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      setLoading(false);
    }
  };

  const fetchCreatorDetails = async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/users/${userId}/`, {
        headers: { ...getAuthHeader() }
      });
      setCreatorData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching creator details:", error);
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Invoice-${invoiceData.transaction_id}`;
    window.print();
    document.title = originalTitle;
  };

  if (loading) return <div>Loading...</div>;
  if (!invoiceData) return <div>Invoice not found</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div className="dashboard-breadcrumb dashboard-panel-header mb-30">
        <div className="d-flex justify-content-between align-items-center">
          <h2>Invoice # <strong>{invoiceData.transaction_id}</strong></h2>
        </div>
      </div>

      {/* Invoice section */}
      <div className="panel rounded-0 invoice-container" style={{ border: '1px solid #ddd', padding: '20px', backgroundColor: '#fff' }}>
        <div className="panel-body invoice">
          <div className="invoice-body">
            <div className="info-card-wrap mb-30">
              <div className="row">
                <div className="col-md-6">
                  <div className="info-card">
                    <h3>Customer Details:</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      <li><span>Name:</span> {invoiceData.partner.first_name}{invoiceData.partner.last_name}</li>
                      <li><span>Email:</span> {invoiceData.partner.email}</li>
                      <li><span>Phone:</span> {invoiceData.partner.contact_number}</li>
                      <li><span>Transaction ID:</span> {invoiceData.transaction_id}</li>
                      <li><span>Purchase Date:</span> {invoiceData.sale_date}</li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="info-card">
                    <h3>Invoice Details:</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      <li><span>Service:</span> {invoiceData.service_name}</li>
                      <li><span>Payment Mode:</span> {invoiceData.payments?.[0]?.payment_mode || "N/A"}</li>
                      <li><span>Payment Status:</span> {invoiceData.payment_status}</li>
                      <li><span>Created By:</span> {creatorData ? creatorData.email : `User ID: ${invoiceData.created_by}`}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-responsive mb-30">
              <table className="table table-bordered mb-0 invoice-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f4f4f4' }}>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Service</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Amount</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Quantity</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tax Rate</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tax Amount</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{invoiceData.service_name}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>Rs {invoiceData.service_price}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{invoiceData.quantity}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{invoiceData.vat_rate || "N/A"}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>Rs {invoiceData.vat_amount || 0}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>Rs {invoiceData.total_service_amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mb-30">
              <h3 className="mb-3">Payment History</h3>
              <div className="table-responsive">
                <table className="table table-bordered mb-0">
                  <thead>
                    <tr>
                      <th>Payment ID</th>
                      <th>Date</th>
                      <th>Paid Amount</th>
                      <th>Payment Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.payments && invoiceData.payments.length > 0 ? (
                      invoiceData.payments.map((payment) => (
                        <tr key={payment.payment_id}>
                          <td>{payment.payment_id}</td>
                          <td>{payment.payment_date}</td>
                          <td>Rs {payment.amount}</td>
                          <td className="text-capitalize">{payment.payment_mode}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">No payment records found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="total-payment-area row justify-content-end mb-30">
              <div className="col-md-4">
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li className="d-flex justify-content-between fw-bold">
                    Remaining Amount:<span>Rs {invoiceData.remaining_amount}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="panel-body border-top">
          <div className="btn-box d-flex justify-content-end gap-2">
            <button className="btn btn-sm btn-primary" onClick={handlePrint}>
              <i className="fa-light fa-print"></i> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
