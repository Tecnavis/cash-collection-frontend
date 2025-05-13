import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";
import AllTransactionsHeader from "../header/AllTransactionHeader";

const AllTransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Add states for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [editFormData, setEditFormData] = useState({
    amount: "",
    payment_method: ""
  });
  
  // Add state for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  
  // Add state for alerts
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    onFilterChange(selectedFilter);
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cashcollection/cashcollection/bycustomer/`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      setTransactions(response.data);
      setFilteredTransactions(response.data);
    } catch (error) {
      setError("Error fetching transactions");
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredTransactions(transactions);
    } else {
      const filteredData = transactions.filter((transaction) =>
        `${transaction.customer_name || ""} ${transaction.scheme_name || ""} ${transaction.created_by || ""}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      setFilteredTransactions(filteredData);
    }
  };

  const calculateTotalAmount = () => {
    return filteredTransactions.reduce(
      (total, item) => total + parseFloat(item.amount || 0),
      0
    ).toFixed(2);
  };
  
  // Handle edit button click
  const handleEditClick = (transaction) => {
    setCurrentTransaction(transaction);
    setEditFormData({
      amount: transaction.amount,
      payment_method: transaction.payment_method.toLowerCase() // Convert to lowercase to match backend values
    });
    setShowEditModal(true);
  };
  
  // Handle form field changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };
  
  // Display alert message
  const displayAlert = (message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
    
    // Hide alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };
  
  // Handle update submission
  const handleUpdateTransaction = async () => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/cashcollection/cashcollection/bycustomer/${currentTransaction.id}/`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      // Update the transactions in state
      const updatedTransactions = transactions.map(tx => 
        tx.id === currentTransaction.id ? { ...tx, ...editFormData } : tx
      );
      
      setTransactions(updatedTransactions);
      setFilteredTransactions(updatedTransactions);
      setShowEditModal(false);
      
      displayAlert("Transaction updated successfully!", "success");
    } catch (error) {
      console.error("Error updating transaction:", error);
      displayAlert("Failed to update transaction. Please try again.", "danger");
    }
  };
  
  // Handle delete button click
  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteModal(true);
  };
  
  // Handle delete confirmation
  const handleDeleteTransaction = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/cashcollection/cashcollection/bycustomer/${transactionToDelete.id}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      
      // Remove the deleted transaction from state
      const updatedTransactions = transactions.filter(
        tx => tx.id !== transactionToDelete.id
      );
      
      setTransactions(updatedTransactions);
      setFilteredTransactions(updatedTransactions);
      setShowDeleteModal(false);
      
      displayAlert("Transaction deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      displayAlert("Failed to delete transaction. Please try again.", "danger");
    }
  };

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="panel">
      <AllTransactionsHeader onSearch={handleSearch} />
      
      {showAlert && (
        <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Collected At</th>
            <th>Customer Name</th>
            <th>Scheme</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Created By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{new Date(transaction.created_at).toLocaleString()}</td>
              <td>{transaction.customer_name || transaction.customer?.name || "N/A"}</td>
              <td>{transaction.scheme_name || transaction.scheme?.name || "N/A"}</td>
              <td>Rs {transaction.amount}</td>
              <td>{transaction.payment_method}</td>
              <td>{transaction.created_by || "Unknown"}</td>
              <td>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="me-2" 
                  onClick={() => handleEditClick(transaction)}
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => handleDeleteClick(transaction)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold", backgroundColor: "#f8f9fa" }}>
            <td colSpan="3">Total</td>
            <td>Rs {calculateTotalAmount()}</td>
            <td colSpan="3"></td>
          </tr>
        </tbody>
      </Table>
      
      {/* Edit Transaction Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Display customer name as read-only */}
            <Form.Group className="mb-3">
              <Form.Label>Customer</Form.Label>
              <Form.Control
                type="text"
                value={currentTransaction?.customer_name || ""}
                disabled
              />
              <Form.Text className="text-muted">
                Customer name cannot be edited
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={editFormData.amount}
                onChange={handleEditFormChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Control
                as="select"
                name="payment_method"
                value={editFormData.payment_method}
                onChange={handleEditFormChange}
              >
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="upi">UPI</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateTransaction}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this transaction for {transactionToDelete?.customer_name || "this customer"}?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteTransaction}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllTransactionTable;