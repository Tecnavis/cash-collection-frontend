import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../api";

const UnpaidPurchase = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/financials/transactions_list/`);
      const filteredTransactions = response.data.filter(
        (transaction) => (transaction.payment_status === "unpaid" || transaction.payment_status === "partially_paid") &&
        transaction.transaction_type === "purchase"
      );
      console.log("Filtered Transactions:", filteredTransactions);
      setTransactions(filteredTransactions);
      
    } catch (error) {
      setError("Error fetching transactions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="col-lg-6">
      <div className="panel">
        <div className="panel-header">
          <h5>Unpaid🔴Partially Paid🔶 Purchase</h5>
        </div>
        <div className="panel-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Username</th>
                <th>Sale Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.transaction_id}</td>
                    <td>{transaction.partner?.first_name || "N/A"}</td>
                    <td>{new Date(transaction.sale_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}</td>
                    <td className={transaction.payment_status === "unpaid" ? "text-danger" : "text-warning"}>
                      {transaction.payment_status === "unpaid" ? "🔴" : "🔶"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No unpaid or partially paid transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UnpaidPurchase;
