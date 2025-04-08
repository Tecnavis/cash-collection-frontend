import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Modal, Button } from "react-bootstrap";
import { BASE_URL } from "../api";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

const WelcomeBanner = ({ customerName }) => (
  <div className="flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4 rounded-2xl shadow-md mb-6">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2 }}
      className="backdrop-blur-md bg-white/30 shadow-xl rounded-3xl p-6 md:p-10 text-center w-full border border-white/40"
    >
      <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 mb-2">
        Welcome back, {customerName}!
      </h1>
      <p className="text-black text-md md:text-lg font-medium">
        Track your schemes and payments with ease 💸
      </p>
    </motion.div>
  </div>
);

const CustomerDashboard = () => {
  const customerId = Cookies.get("user_id");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (customerId) {
      fetchCustomerTransactions();
    }
  }, [customerId]);

  const fetchCustomerTransactions = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cashcollection/customer-scheme-payment/`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );

      const groupedCustomers = response.data.reduce((acc, item) => {
        let customer = acc.find(
          (c) => c.customer_details.id === item.customer_details.id
        );

        if (!customer) {
          customer = {
            customer_details: item.customer_details,
            schemes: [],
          };
          acc.push(customer);
        }

        let scheme = customer.schemes.find(
          (s) => s.scheme_name === item.scheme_name
        );

        if (!scheme) {
          scheme = {
            scheme_name: item.scheme_name,
            scheme_total_amount: item.scheme_total_amount,
            payment_history: [],
          };
          customer.schemes.push(scheme);
        }

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
  if (!customers || customers.length === 0)
    return <p>No customer data found.</p>;

  return (
    <div className="panel p-3">
      <WelcomeBanner
        customerName={customers[0]?.customer_details?.first_name || "Customer"}
      />

      <h4>Customer Scheme Overview</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Contact</th>
            <th>Scheme Name</th>
            <th>Total Scheme Amount</th>
            <th>Total Paid</th>
            <th>View Details</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cust, idx) =>
            cust.schemes.map((scheme, schemeIdx) => {
              const paidAmount = scheme.payment_history.reduce(
                (sum, payment) => sum + parseFloat(payment.amount),
                0
              );

              return (
                <tr key={`${idx}-${schemeIdx}`}>
                  <td>
                    {cust.customer_details.first_name}{" "}
                    {cust.customer_details.last_name} -{" "}
                    {cust.customer_details.shop_name}
                  </td>
                  <td>{cust.customer_details.contact_number}</td>
                  <td>{scheme.scheme_name}</td>
                  <td>₹{scheme.scheme_total_amount}</td>
                  <td>₹{paidAmount}</td>
                  <td>
                    <Button
                      variant="info"
                      onClick={() => handleShowModal(scheme)}
                      size="sm"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      {/* Modal for viewing scheme details */}
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
                  <strong>Total Amount:</strong> ₹
                  {selectedScheme.scheme_total_amount}
                </p>
                <p>
                  <strong>Total Paid:</strong> ₹
                  {selectedScheme.payment_history.reduce(
                    (sum, payment) => sum + parseFloat(payment.amount),
                    0
                  )}
                </p>
                <p>
                  <strong>Remaining:</strong> ₹
                  {selectedScheme.scheme_total_amount -
                    selectedScheme.payment_history.reduce(
                      (sum, payment) => sum + parseFloat(payment.amount),
                      0
                    )}
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
                            {new Date(payment.date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
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

export default CustomerDashboard;
