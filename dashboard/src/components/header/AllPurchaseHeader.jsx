import React, { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { DigiContext } from "../../context/DigiContext";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx"; 
import axios from "axios";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";

const AllPurchaseHeader = () => {
  const { headerBtnOpen, handleHeaderBtn, handleHeaderReset, headerRef } =
    useContext(DigiContext);

  const [checkboxes, setCheckboxes] = useState({
    showProducts: true,
    showPublished: true,
    showStock: true,
    showPrice: true,
    showSales: true,
    showRating: true,
  });

  const handleChange = (e) => {
    const { id } = e.target;
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [id]: !prevCheckboxes[id],
    }));
  };

  const downloadPurchasePDF = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/financials/transactions_list/`);
      const transactions = response.data;

      const doc = new jsPDF();
      doc.setFontSize(10);
      doc.text("Purchase Report", doc.internal.pageSize.getWidth() / 2, 10, { align: "center" });

      const columns = [
        "Transaction ID",
        "Username",
        "Service",
        "Price",
        "Total Paid",
        "Remaining Amount",
        "Sale Date",
        "Payment Modes",
      ];

      const rows = transactions
        .filter((transaction) => transaction.transaction_type === "purchase")
        .map((transaction) => {
          const paymentModes = transaction.payments
            ?.map((payment) => payment.payment_mode)
            .join(", ") || "N/A";

          return [
            transaction.transaction_id,
            transaction.username,
            transaction.service_name,
            `Rs ${transaction.service_price}`,
            `Rs ${transaction.total_paid}`,
            `Rs ${transaction.remaining_amount}`,
            transaction.sale_date,
            paymentModes,
          ];
        });

      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 20,
      });

      doc.save("Purchase_Report.pdf");
    } catch (error) {
      console.error("Error generating purchase PDF:", error);
    }
  };


  const exportToExcel = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/financials/transactions_list/`);
      const transactions = response.data;
  
      if (transactions.length === 0) {
        alert("No data available to export.");
        return;
      }
  
      const exportData = transactions
        .filter((transaction) => transaction.transaction_type === "purchase")
        .map((transaction) => {
          const paymentModes = transaction.payments
            ?.map((payment) => payment.payment_mode)
            .join(", ") || "N/A";
  
          return {
            "Transaction ID": transaction.transaction_id,
            "Username": transaction.username,
            "Service": transaction.service_name,
            "Price": `Rs ${transaction.service_price}`,
            "Total Paid": `Rs ${transaction.total_paid}`,
            "Remaining Amount": `Rs ${transaction.remaining_amount}`,
            "Sale Date": transaction.sale_date,
            "Payment Modes": paymentModes,
          };
        });
  
      const ws = XLSX.utils.json_to_sheet(exportData);
  
      const colWidths = [
        { wpx: 120 }, 
        { wpx: 150 }, 
        { wpx: 200 }, 
        { wpx: 100 },
        { wpx: 100 }, 
        { wpx: 150 },
        { wpx: 120 }, 
        { wpx: 180 }, 
      ];
  
      ws["!cols"] = colWidths; 
  
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Purchases");
  
      XLSX.writeFile(wb, "Purchase_Report.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  const uploadSalesExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("excel_file", file);  
  
    try {
      const response = await axios.post(
        `${BASE_URL}/financials/import_excel_purchase/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
             "Authorization": `Bearer ${Cookies.get("access_token")}` 
          },
        }
      );
      console.log("Response:", response.data);
      alert("Sales data imported successfully!");
    } catch (error) {
      console.error("Error uploading sales data:", error.response?.data || error);
      alert("Error uploading sales data");
    }
  };
  
  return (
    <div className="panel-header">
      <h5>Purchases</h5>
      <div className="btn-box d-flex flex-wrap gap-2">
        <div id="tableSearch">
          <Form.Control type="text" placeholder="Search..." />
        </div>
        <div className="btn-box">
          <Link to="/addSales" className="btn btn-sm btn-primary">
            <i className="fa-light fa-plus"></i> Add New
          </Link>
          <Button className="btn btn-sm btn-success ms-2" onClick={downloadPurchasePDF}>
            <i className="fa fa-download"></i> PDF
          </Button>
          <Button className="btn btn-sm btn-info ms-2 text-white" onClick={exportToExcel}>
            <i className="fa fa-file-excel"></i> Excel
          </Button>

          <input type="file" accept=".xlsx, .xls" onChange={uploadSalesExcel} className="d-none" id="uploadExcel" />
          <label htmlFor="uploadExcel" className="btn btn-sm btn-primary ms-2 text-white">
            <i className="fa-light fa-upload"></i> Import
          </label>

        </div>
      </div>
    </div>
  );
};

export default AllPurchaseHeader;

