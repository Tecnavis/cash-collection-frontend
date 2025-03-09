import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { Eye } from "react-bootstrap-icons";
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../api";


const PurchaseReportTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Payment Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [vatType, setVatType] = useState("standard");

  // Payment History Modal States
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);
  const [payments, setPayments] = useState([]);

  // Delete Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/financials/transactions_list/`);
      setTransactions(response.data);
    } catch (error) {
      setError("Error fetching transactions");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNowClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!paymentAmount || !paymentMode) return;
    
    try {
      await axios.post(`${BASE_URL}/financials/payments/${selectedTransaction.id}/`, {
        transaction_id: selectedTransaction.id, 
        amount: paymentAmount,
        payment_mode: paymentMode,
        vat_type: vatType,
        
      });
      fetchTransactions();
      setShowPaymentModal(false);
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const handleDeleteClick = (transaction) => {
    setCurrentTransaction(transaction);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = async () => {
    if (!currentTransaction || !currentTransaction.id) return;
    try {
      await axios.delete(`${BASE_URL}/financials/transactions/${currentTransaction.id}/delete/`);
      fetchTransactions();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting transaction", error);
    }
  };

  const fetchPayments = async (transactionId) => {
    try {
      
      const response = await axios.get(`${BASE_URL}/financials/transactions/${transactionId}/payments/`);
      setPayments(response.data);
      setShowPaymentsModal(true);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="panel">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Name</th>
            <th>Service</th>
            <th>Payment Status</th>
            {/* <th>Payment Mode</th> */}
            <th>Purchase Date</th>
            <th>Service Price</th>
            <th>Quantity</th>
            <th>Tax Amount</th>
            <th>Remaining Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions
            .filter((transaction) => transaction.transaction_type === "sale")
            .map((transaction) => (
              <tr key={transaction.id}>
                <td>
                  <Link 
                    to={`/invoice/${transaction.id}`} 
                    className="text-primary text-decoration-none"
                  >
                    {transaction.transaction_id}
                  </Link>
                </td>
                <td>
                  {transaction.partner ? (
                    <>
                      <strong>{transaction.partner.first_name} {transaction.partner.last_name}</strong>
                      <br />
                      📞 {transaction.partner.contact_number}
                      <br />
                      {/* ✉️ {transaction.partner.email} */}
                    </>
                  ) : "N/A"}
                </td>
                <td>{transaction.service_name}</td>
                <td>{transaction.payment_status}</td>
                <td>{transaction.sale_date}</td>
                <td>Rs {transaction.service_price}</td>
                <td>{transaction.quantity}</td>
                <td>{transaction.vat_amount}</td>
                <td>Rs {transaction.remaining_amount}</td>
                <td>
                  <Button 
                    className="btn btn-primary me-2" 
                    onClick={() => handlePayNowClick(transaction)} 
                    disabled={parseFloat(transaction.remaining_amount) === 0}
                  >
                    Pay Now
                  </Button>
                  <Button variant="info" className="me-2" onClick={() => fetchPayments(transaction.id)}>
                    <Eye />
                  </Button>
                  <Button variant="primary" onClick={() => handleDeleteClick(transaction)}>
                    <i className="fa fa-trash"></i>
                  </Button>
                </td>
              </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter Payment Amount</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                max={selectedTransaction?.remaining_amount || "0"}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Payment Mode</Form.Label>
              <Form.Select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="">Select Payment Mode</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirmPayment}>Confirm</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPaymentsModal} onHide={() => setShowPaymentsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Payments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {payments.length > 0 ? (
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Amount</th>
                  <th>Payment Mode</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.payment_id}>
                    <td>{payment.payment_id}</td>
                    <td>Rs {payment.amount}</td>
                    <td>{payment.payment_mode}</td>
                    <td>{payment.payment_date}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No payments found.</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this purchase?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteSubmit}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PurchaseReportTable;






