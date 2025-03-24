import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";

const AllCustomerTransactionTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      setCustomers(response.data); 
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
            <th>Customer Name</th>
            <th>Contact</th>
            <th>Scheme Name</th>
            <th>Payment History</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) =>
            customer.payment_history.length > 0 ? (
              <tr key={customer.customer_name + customer.scheme_name}>
                <td>{customer.customer_name}</td>
                <td>{customer.customer_contact}</td>
                <td>{customer.scheme_name}</td>
                <td>
                  <ul style={{ padding: 0, margin: 0, listStyleType: "none" }}>
                    {customer.payment_history.map((payment, index) => (
                      <li key={index}>
                        ₹{payment.amount} - {payment.payment_method} (
                        {new Date(payment.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                        )
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AllCustomerTransactionTable;
