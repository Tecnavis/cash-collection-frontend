import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { Eye, Pencil, Trash } from "react-bootstrap-icons";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";  
import AllCollectionHeader from "../header/AllCollectionHeader";

const AllCollectionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setFilteredTransactions(response.data); 
    } catch (error) {
      setError("Error fetching transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (query.trim() === "") {
      setFilteredTransactions(transactions);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = transactions.filter((transaction) => {
        const customerName = `${transaction.customer_details.first_name} ${transaction.customer_details.last_name}`.toLowerCase();
        const schemeName = transaction.scheme_name?.toLowerCase() || "";
        const createdBy = transaction.created_by?.toLowerCase() || "";
        return (
          customerName.includes(lowerQuery) ||
          schemeName.includes(lowerQuery) ||
          createdBy.includes(lowerQuery)
        );
      });
      setFilteredTransactions(filtered);
    }
  };

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="panel">
      <AllCollectionHeader onSearch={handleSearch} />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Joined Date</th>
            <th>Customer Name</th>
            <th>Scheme Name</th>
            <th>Scheme Total Amount</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{new Date(transaction.created_at).toLocaleString()}</td>
              <td>
                {transaction.customer_details.shop_name} -{" "}
                {transaction.customer_details.first_name}{" "}
                {transaction.customer_details.last_name}
              </td>
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

