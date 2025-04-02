import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";
import AllTransactionHeader from "../header/AllTransactionHeader";

const AllTransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      setFilteredTransactions(response.data); 
    } catch (error) {
      setError("Error fetching transactions");
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
        `${transaction.customer_name} ${transaction.scheme_name} ${transaction.created_by}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      setFilteredTransactions(filteredData);
    }
  };

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="panel">
      <AllTransactionHeader onSearch={handleSearch} />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Collected At</th>
            <th>Customer Name</th>
            <th>Scheme</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Created By</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{new Date(transaction.created_at).toLocaleString()}</td>
              <td>{transaction.customer_name}</td>
              <td>{transaction.scheme_name || "N/A"}</td>
              <td>Rs {transaction.amount}</td>
              <td>{transaction.payment_method}</td>
              <td>{transaction.created_by || "Unknown"}</td> {/* Fix this */}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AllTransactionTable;
