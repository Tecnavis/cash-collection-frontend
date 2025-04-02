import React, { useContext, useState } from "react";
import { Form } from "react-bootstrap";
import { DigiContext } from "../../context/DigiContext";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { BASE_URL } from "../../api";
import * as XLSX from "xlsx"; 
import Cookies from "js-cookie";

const AllTransactionHeader = ({ onSearch }) => {
  const { headerBtnOpen, handleHeaderBtn, handleHeaderReset, headerRef } =
    useContext(DigiContext);

  const downloadTransactionsPDF = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cashcollection/cashcollection/bycustomer/`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
        }
      );
      const transactions = response.data;

      const doc = new jsPDF();
      doc.setFontSize(12);
      doc.text("Transaction Report", doc.internal.pageSize.getWidth() / 2, 10, { align: "center" });

      const columns = [
        "Collected At",
        "Customer Name",
        "Scheme",
        "Amount",
        "Payment Method",
        "Created By",
      ];

      const rows = transactions.map((transaction) => [
        new Date(transaction.created_at).toLocaleString(),
        transaction.customer_name,
        transaction.scheme_name || "N/A",
        `Rs ${transaction.amount}`,
        transaction.payment_method,
        transaction.created_by_name || "Unknown",
      ]);

      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 20,
      });

      doc.save("Transactions_Report.pdf");
    } catch (error) {
      console.error("Error generating Transactions PDF:", error);
    }
  };

  const downloadTransactionsExcel = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cashcollection/cashcollection/bycustomer/`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
        }
      );
      const transactions = response.data;

      if (transactions.length === 0) {
        alert("No transactions available to export.");
        return;
      }

      const exportData = transactions.map((transaction) => ({
        "Collected At": new Date(transaction.created_at).toLocaleString(),
        "Customer Name": transaction.customer_name,
        "Scheme": transaction.scheme_name || "N/A",
        "Amount": `Rs ${transaction.amount}`,
        "Payment Method": transaction.payment_method,
        "Created By": transaction.created_by || "Unknown",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const colWidths = [
        { wpx: 150 }, 
        { wpx: 200 }, 
        { wpx: 200 }, 
        { wpx: 100 }, 
        { wpx: 150 }, 
        { wpx: 150 }, 
      ];
      ws["!cols"] = colWidths;
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Transaction Data");
      XLSX.writeFile(wb, "Transactions_Report.xlsx");
    } catch (error) {
      console.error("Error exporting Transactions Excel:", error);
    }
  };

  return (
    <div className="panel-header">
      <h5> Transactions List </h5>
      <div className="btn-box d-flex flex-wrap gap-2">
        <div id="tableSearch">
          <Form.Control
            type="text"
            placeholder="Search transactions..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={downloadTransactionsPDF}>
          Export as PDF
        </button>
        <button className="btn btn-success" onClick={downloadTransactionsExcel}>
          Export as Excel
        </button>
      </div>
    </div>
  );
};

export default AllTransactionHeader;
