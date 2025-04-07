import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import Cookies from "js-cookie";
import { BASE_URL } from "../../api";
import AllCollectionProgressHeader from "../header/AllCollecionProgressHeader";

const AllCollectionProgressTable = () => {
  const [customerSchemes, setCustomerSchemes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomerSchemes();
  }, []);

  const fetchCustomerSchemes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cashcollection/customer-schemes/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
      setCustomerSchemes(response.data);
      setFilteredData(response.data);
    } catch (error) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredData(customerSchemes);
    } else {
      const q = query.toLowerCase();
      const filtered = customerSchemes.filter((item) => {
        const name = `${item.customer_details.first_name} ${item.customer_details.last_name}`.toLowerCase();
        const scheme = item.scheme_name?.toLowerCase() || "";
        return name.includes(q) || scheme.includes(q);
      });
      setFilteredData(filtered);
    }
  };

  const renderInstallmentGrid = (paid = 0, total = 10) => {
    const boxes = [];
    for (let i = 0; i < total; i++) {
      boxes.push(i < paid ? "🟩" : "🟥");
    }
    return boxes.join("");
  };

  const calculateTotalPerScheme = () => {
    const totals = {};
    filteredData.forEach((entry) => {
      const scheme = entry.scheme_name || "Unknown Scheme";
      const paid = entry.total_paid || 0;
      if (totals[scheme]) {
        totals[scheme] += paid;
      } else {
        totals[scheme] = paid;
      }
    });
    return totals;
  };

  const schemeTotals = calculateTotalPerScheme();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="panel">
      <AllCollectionProgressHeader onSearch={handleSearch} />

       {/* Summary of total paid per scheme */}
       <h5 className="mt-4">Total Paid Per Scheme</h5>
      <Table bordered>
        <thead>
          <tr>
            <th>Scheme</th>
            <th>Total Paid</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(schemeTotals).map(([scheme, total]) => (
            <tr key={scheme}>
              <td>{scheme}</td>
              <td>₹{total}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Scheme</th>
            <th>Total</th>
            <th>Installment amount</th>
            <th>Total Paid</th>
            <th>Progress (Installments)</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((entry) => {
            const name = `${entry.customer_details.first_name} ${entry.customer_details.last_name}`;
            const totalInstallments =
              entry.installments_paid + (entry.installments_remaining || 0) || 10;
            const paid = entry.installments_paid || 0;

            return (
              <tr key={entry.id}>
                <td>{name}</td>
                <td>{entry.scheme_name}</td>
                <td>₹{entry.scheme_total_amount}</td>
                <td>₹{entry.installment_amount}</td>
                <td>₹{entry.total_paid}</td>
                <td>
                ({paid}/{totalInstallments} paid) {renderInstallmentGrid(paid, totalInstallments)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default AllCollectionProgressTable;
