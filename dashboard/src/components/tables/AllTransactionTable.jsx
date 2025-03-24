import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";

const AllTransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

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
            <th>Customer ID</th>
            <th>Scheme</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Created By</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{new Date(transaction.created_at).toLocaleString()}</td>
              <td>{transaction.customer_name}</td>
              <td>{transaction.scheme_name}</td>
              <td>Rs {transaction.amount}</td>
              <td>{transaction.payment_method}</td>
              <td>{transaction.created_by}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AllTransactionTable;
