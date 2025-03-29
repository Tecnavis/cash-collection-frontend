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
            <th>Customer Name</th>
            <th>Scheme Name</th>
            <th>Scheme Total Amount</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{new Date(transaction.created_at).toLocaleString()}</td>
        
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

