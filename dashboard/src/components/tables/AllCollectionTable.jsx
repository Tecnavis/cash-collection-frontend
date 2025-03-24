import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { Eye, Pencil, Trash } from "react-bootstrap-icons";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";  

const AllCollectionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
 

  useEffect(() => {
    fetchTransactions();
  }, []);
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cashcollection/cashcollections/`, {
        headers: {
          "Authorization": `Bearer ${Cookies.get("access_token")}`,
        },
      });
      setTransactions(response.data);
    } catch (error) {
      setError("Error fetching transactions");
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="panel">

<Table striped bordered hover>
        <thead>
          <tr>
          <th>Collected At</th>
            {/* <th>ID</th> */}
            <th>Customer Name</th>
            <th>Scheme Name</th>
           
            <th>Scheme Total Amount</th>
            <th>Start Date</th>
            <th>End Date</th>
           
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{new Date(transaction.created_at).toLocaleString()}</td>
              {/* <td>{transaction.id}</td> */}
              <td>{transaction.customer_name}</td>
              <td>{transaction.scheme_name}</td>
              
              <td>Rs {transaction.scheme_total_amount}</td>
              <td>{transaction.start_date}</td>
              <td>{transaction.end_date}</td>
            </tr>
          ))}
        </tbody>
      </Table>   
    </div>
  );
};
export default AllCollectionTable;













// const [showPaymentModal, setShowPaymentModal] = useState(false);
// const [showEditModal, setShowEditModal] = useState(false);
// const [showDeleteModal, setShowDeleteModal] = useState(false);

// const [paymentMode, setPaymentMode] = useState("");
// const [payments, setPayments] = useState([]);
// const [showPaymentsModal, setShowPaymentsModal] = useState(false);

  // const fetchPayments = async (transactionId) => {
  //   try {
  //     const response = await axios.get(`${BASE_URL}/cashcollection/cashcollections/${transactionId}/details/`, {
  //       headers: {
  //         "Authorization": `Bearer ${Cookies.get("access_token")}`,
  //       },
  //     });
  //     setPayments(response.data);
  //     setShowPaymentsModal(true);
  //   } catch (error) {
  //     console.error("Error fetching payments:", error);
  //   }
  // };

  // const handlePayNowClick = (transaction) => {
  //   setSelectedTransaction(transaction);
  //   setShowPaymentModal(true);
  // };

  // const handleConfirmPayment = async () => {
  //   if (!paymentAmount || !paymentMethod) return;
  //   try {
  //     await axios.post(`${BASE_URL}/financials/payments/${selectedTransaction.id}/`, {
  //       amount: paymentAmount,
  //       payment_method: paymentMethod,
  //     });
  //     fetchTransactions();
  //     setShowPaymentModal(false);
  //   } catch (error) {
  //     console.error("Error processing payment:", error);
  //   }
  // };

  // const handleEditClick = (transaction) => {
  //   setSelectedTransaction(transaction);
  //   setPaymentAmount(transaction.amount);
  //   setPaymentMethod(transaction.payment_method);
  //   setShowEditModal(true);
  // };

  // const handleDeleteClick = (transaction) => {
  //   setSelectedTransaction(transaction);
  //   setShowDeleteModal(true);
  // };

  // const handleDeleteSubmit = async () => {
  //   try {
  //     await axios.delete(`${BASE_URL}/cashcollection/cashcollections/${selectedTransaction.id}/delete`);
  //     fetchTransactions();
  //     setShowDeleteModal(false);
  //   } catch (error) {
  //     console.error("Error deleting transaction", error);
  //   }
  // };
{/* <td>
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
                </td> */}
 {/* Payment Modal */}
      {/* <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
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
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="">Select Payment Method</option>
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
      </Modal> */}

    {/* <Modal show={showPaymentsModal} onHide={() => setShowPaymentsModal(false)} centered>
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
      </Modal> */}

      {/* Delete Confirmation Modal */}
      {/* <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this purchase?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteSubmit}>Delete</Button>
        </Modal.Footer>
      </Modal> */}