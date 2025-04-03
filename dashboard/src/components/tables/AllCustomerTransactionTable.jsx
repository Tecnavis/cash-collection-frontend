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

      // Grouping customers
      const groupedCustomers = response.data.reduce((acc, item) => {
        let customer = acc.find((c) => c.customer_details.id === item.customer_details.id);
        
        if (!customer) {
          customer = {
            customer_details: item.customer_details,
            schemes: [],
          };
          acc.push(customer);
        }

        // Grouping schemes
        let scheme = customer.schemes.find((s) => s.scheme_name === item.scheme_name);

        if (!scheme) {
          scheme = {
            scheme_name: item.scheme_name,
            scheme_total_amount: item.scheme_total_amount,
            payment_history: [],
          };
          customer.schemes.push(scheme);
        }

        // Avoid duplicate payments
        const existingPayments = new Set(
          scheme.payment_history.map((p) => JSON.stringify(p))
        );

        item.payment_history.forEach((payment) => {
          const paymentStr = JSON.stringify(payment);
          if (!existingPayments.has(paymentStr)) {
            scheme.payment_history.push(payment);
            existingPayments.add(paymentStr);
          }
        });

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
              <td>{customer.customer_details.first_name} {customer.customer_details.last_name} -{customer.customer_details.shop_name}</td>
              <td>{customer.customer_details.contact_number}</td>
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
          <Modal.Title>Payment Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              background: "#E5FFE5",
              borderRadius: "8px",
              padding: "20px",
              position: "relative",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {selectedScheme ? (
              <div>
                <h5>{selectedScheme.scheme_name}</h5>
                <p>
                  <strong>Total Amount:</strong> ₹{selectedScheme.scheme_total_amount}
                </p>
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
          </div>
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