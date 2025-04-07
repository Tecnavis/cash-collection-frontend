import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { DigiContext } from "../../context/DigiContext";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { BASE_URL } from "../../api";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";
import { DateRangePicker, DefinedRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const AllTransactionHeader = ({ onSearch }) => {
  const {
    inputValue,
    handleInputChange,
    handleDateRangeSelection,
    showDatePicker,
    setShowDatePicker,
    selectedDateRange,
    handleDateRangeChange,
    smallDevice,
  } = useContext(DigiContext);

  const ref = useRef(null);

  // Close date picker when clicked outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [setShowDatePicker]);

  // Filter function using selectedDateRange
  const filterTransactions = (transactions) => {
    if (!selectedDateRange?.[0]) return transactions;

    const { startDate, endDate } = selectedDateRange[0];

    return transactions.filter((transaction) => {
      const createdAt = new Date(transaction.created_at);
      return createdAt >= new Date(startDate) && createdAt <= new Date(endDate);
    });
  };

  const downloadTransactionsPDF = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cashcollection/cashcollection/bycustomer/`, {
        headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
      });
      const transactions = filterTransactions(response.data);

      const doc = new jsPDF();
      doc.setFontSize(12);
      doc.text("Transaction Report", doc.internal.pageSize.getWidth() / 2, 10, { align: "center" });

      const columns = ["Collected At", "Customer Name", "Scheme", "Amount", "Payment Method", "Created By"];
      const rows = transactions.map((transaction) => [
        new Date(transaction.created_at).toLocaleString(),
        transaction.customer_name,
        transaction.scheme_name || "N/A",
        `Rs ${transaction.amount}`,
        transaction.payment_method,
        transaction.created_by_name || "Unknown",
      ]);

      doc.autoTable({ head: [columns], body: rows, startY: 20 });
      doc.save("Transactions_Report.pdf");
    } catch (error) {
      console.error("Error generating Transactions PDF:", error);
    }
  };

  const downloadTransactionsExcel = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cashcollection/cashcollection/bycustomer/`, {
        headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
      });
      const transactions = filterTransactions(response.data);

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
      ws["!cols"] = [{ wpx: 150 }, { wpx: 200 }, { wpx: 200 }, { wpx: 100 }, { wpx: 150 }, { wpx: 150 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Transaction Data");
      XLSX.writeFile(wb, "Transactions_Report.xlsx");
    } catch (error) {
      console.error("Error exporting Transactions Excel:", error);
    }
  };

  return (
    <div className="panel-header">
      <h5>Transactions List</h5>
      <div className="btn-box d-flex flex-wrap gap-2 align-items-center" ref={ref}>
        <Form.Control
          type="text"
          placeholder="Search transactions..."
          onChange={(e) => onSearch(e.target.value)}
          style={{ width: "250px" }}
        />

        <div className="input-group dashboard-filter" style={{ position: "relative" }}>
          <input
            type="text"
            className="form-control"
            name="basic"
            placeholder="Select date range"
            value={inputValue}
            onChange={handleInputChange}
            style={{ pointerEvents: "none", width: "200px" }}
          />
          <label className="input-group-text" onClick={handleDateRangeSelection} style={{ cursor: "pointer" }}>
            <i className="fa fa-calendar-days"></i>
          </label>
          {showDatePicker && (
            <div className="date-picker-container dashboard-date-picker">
              {smallDevice ? (
                <DefinedRange
                  ranges={selectedDateRange}
                  onChange={handleDateRangeChange}
                  editableDateInputs={true}
                  moveRangeOnFirstSelection={false}
                  className="date-range-picker"
                />
              ) : (
                <DateRangePicker
                  ranges={selectedDateRange}
                  onChange={handleDateRangeChange}
                  editableDateInputs={true}
                  moveRangeOnFirstSelection={false}
                  className="date-range-picker"
                />
              )}
            </div>
          )}
        </div>

        <Button className="btn btn-sm btn-success ms-2" onClick={downloadTransactionsPDF}>
          <i className="fa fa-download"></i> PDF
        </Button>
        <Button className="btn btn-sm btn-info ms-2 text-white" onClick={downloadTransactionsExcel}>
          <i className="fa fa-file-excel"></i> Excel
        </Button>
      </div>
    </div>
  );
};

export default AllTransactionHeader;
