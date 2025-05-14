import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
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
  

  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [editFormData, setEditFormData] = useState({
    amount: "",
    payment_method: ""
  });
  
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  
  
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataPerPage] = useState(300);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    
    const indexOfLastItem = currentPage * dataPerPage;
    const indexOfFirstItem = indexOfLastItem - dataPerPage;
    const currentData = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
    
    
    setTotalPages(Math.ceil(filteredTransactions.length / dataPerPage));
  }, [currentPage, filteredTransactions, dataPerPage]);

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    
    
    if (selectedFilter === "all") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(transaction => 
        transaction.payment_method.toLowerCase() === selectedFilter.toLowerCase()
      );
      setFilteredTransactions(filtered);
    }
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
      setTotalPages(Math.ceil(response.data.length / dataPerPage));
    } catch (error) {
      setError("Error fetching transactions");
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); 
    
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
  
  
  const handleViewClick = (transaction) => {
    setCurrentTransaction(transaction);
    setShowViewModal(true);
  };
  
  
  const handleEditClick = (transaction) => {
    setCurrentTransaction(transaction);
    setEditFormData({
      amount: transaction.amount,
      payment_method: transaction.payment_method.toLowerCase() 
    });
    setShowEditModal(true);
  };
  
  
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };
  
  
  const displayAlert = (message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
    
    
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };
  
  
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
  
  
  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteModal(true);
  };
  
  
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

  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  
  const getCurrentTransactions = () => {
    const indexOfLastItem = currentPage * dataPerPage;
    const indexOfFirstItem = indexOfLastItem - dataPerPage;
    return filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  };

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>{error}</p>;

  const currentTransactions = getCurrentTransactions();

  return (
    <div className="panel">
      <AllTransactionsHeader onSearch={handleSearch} />
      
      {showAlert && (
        <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      )}

      <div className="mb-3">
        <Form.Group className="mb-3">
          <Form.Label>Filter by Payment Method:</Form.Label>
          <Form.Control
            as="select"
            value={filter}
            onChange={handleFilterChange}
            className="form-select"
          >
            <option value="all">All</option>
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="upi">UPI</option>
          </Form.Control>
        </Form.Group>
      </div>

      <OverlayScrollbarsComponent>
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
            {currentTransactions.length > 0 ? (
              currentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.created_at).toLocaleString()}</td>
                  <td>{transaction.customer_name || transaction.customer?.name || "N/A"}</td>
                  <td>{transaction.scheme_name || transaction.scheme?.name || "N/A"}</td>
                  <td>Rs {transaction.amount}</td>
                  <td>{transaction.payment_method}</td>
                  <td>{transaction.created_by || "Unknown"}</td>
                  <td>
                    <i
                      className="fa-light fa-eye text me-3 cursor-pointer"
                      style={{ fontSize: "18px" }}
                      onClick={() => handleViewClick(transaction)}
                    ></i>
                    <i
                      className="fa-light fa-pen-nib text me-3 cursor-pointer"
                      style={{ fontSize: "18px" }}
                      onClick={() => handleEditClick(transaction)}
                    ></i>
                    <i
                      className="fa-light fa-trash-can text cursor-pointer"
                      style={{ fontSize: "18px" }}
                      onClick={() => handleDeleteClick(transaction)}
                    ></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No transactions found</td>
              </tr>
            )}
            <tr style={{ fontWeight: "bold", backgroundColor: "#f8f9fa" }}>
              <td colSpan="3">Total</td>
              <td>Rs {calculateTotalAmount()}</td>
              <td colSpan="3"></td>
            </tr>
          </tbody>
        </Table>
      </OverlayScrollbarsComponent>
      
      
      {showViewModal && currentTransaction && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 rounded">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Transaction Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body p-4 text-center">
                <i className="fa-solid fa-receipt fa-4x text-primary mb-3"></i>
                <p><strong>Transaction Date:</strong> {new Date(currentTransaction.created_at).toLocaleString()}</p>
                <p><strong>Customer:</strong> {currentTransaction.customer_name || "N/A"}</p>
                <p><strong>Scheme:</strong> {currentTransaction.scheme_name || "N/A"}</p>
                <p><strong>Amount:</strong> Rs {currentTransaction.amount}</p>
                <p><strong>Payment Method:</strong> {currentTransaction.payment_method}</p>
                <p><strong>Created By:</strong> {currentTransaction.created_by || "Unknown"}</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button type="button" className="btn btn-danger px-4" onClick={() => setShowViewModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      
      {showEditModal && currentTransaction && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Transaction</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <Form>
                  
                  <div className="mb-3">
                    <label className="form-label">Customer</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentTransaction?.customer_name || ""}
                      readOnly
                    />
                    <small className="text-muted">
                      Customer name cannot be edited
                    </small>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      name="amount"
                      value={editFormData.amount}
                      onChange={handleEditFormChange}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select
                      className="form-select"
                      name="payment_method"
                      value={editFormData.payment_method}
                      onChange={handleEditFormChange}
                    >
                      <option value="cash">Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="upi">UPI</option>
                    </select>
                  </div>
                </Form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateTransaction}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && transactionToDelete && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this transaction for {transactionToDelete?.customer_name || "this customer"}?
                This action cannot be undone.
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteTransaction}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      
      <PaginationSection
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        pageNumbers={Array.from({ length: totalPages }, (_, i) => i + 1)}
      />
    </div>
  );
};

export default AllTransactionTable;