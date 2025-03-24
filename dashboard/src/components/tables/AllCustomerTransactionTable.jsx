import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Modal, Button } from "react-bootstrap";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";

const AllCustomerTransactionTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cashcollection/customer-scheme-payments/`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );

      // Group data by customer
      const groupedCustomers = response.data.reduce((acc, item) => {
        const existingCustomer = acc.find((c) => c.customer_name === item.customer_name);
        if (existingCustomer) {
          existingCustomer.schemes.push({
            scheme_name: item.scheme_name,
            scheme_total_amount: item.scheme_total_amount,
            payment_history: item.payment_history,
          });
        } else {
          acc.push({
            customer_name: item.customer_name,
            customer_contact: item.customer_contact,
            schemes: [
              {
                scheme_name: item.scheme_name,
                scheme_total_amount: item.scheme_total_amount,
                payment_history: item.payment_history,
              },
            ],
          });
        }
        return acc;
      }, []);

      setCustomers(groupedCustomers);
    } catch (error) {
      setError("Error fetching transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (scheme) => {
    setSelectedScheme(scheme);
    setShowModal(true);
  };

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="panel">
      <h4>Customer Transactions</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Contact</th>
            <th>Joined Schemes</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={index}>
              <td>{customer.customer_name}</td>
              <td>{customer.customer_contact}</td>
              <td>
                {customer.schemes.map((scheme, idx) => (
                  <div key={idx}>
                    <Button
                      variant="link"
                      onClick={() => handleShowModal(scheme)}
                      style={{ textDecoration: "none", fontWeight: "bold" }}
                    >
                      {scheme.scheme_name}
                    </Button>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Payment History Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Payment History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedScheme ? (
            <div>
              <h5>{selectedScheme.scheme_name}</h5>
              <p><strong>Total Amount:</strong> ₹{selectedScheme.scheme_total_amount}</p>
              {selectedScheme.payment_history.length > 0 ? (
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedScheme.payment_history.map((payment, index) => (
                      <tr key={index}>
                        <td>₹{payment.amount}</td>
                        <td>{payment.payment_method}</td>
                        <td>
                          {new Date(payment.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No payment history available.</p>
              )}
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllCustomerTransactionTable;
