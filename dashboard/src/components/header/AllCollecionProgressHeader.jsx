import React from "react";
import { Form, Button } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";
import { BASE_URL } from "../../api";

const AllCollectionProgressHeader = ({ onSearch }) => {
  const downloadCollectionPDF = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cashcollection/customer-schemes/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });

      const data = response.data || [];

      const doc = new jsPDF();
      doc.setFontSize(12);
      doc.text("Customer Payment Report", doc.internal.pageSize.getWidth() / 2, 10, {
        align: "center",
      });

      const columns = [
        "Customer",
        "Scheme",
        "Total Amount",
        "Installment Amount",
        "Total Paid",
        "Installments (Paid/Total)",
      ];

      const rows = data.map((item) => {
        const name = `${item.customer_details?.first_name || ""} ${item.customer_details?.last_name || ""}`;
        const totalInstallments = (item.installments_paid || 0) + (item.installments_remaining || 0);
        const paid = item.installments_paid || 0;

        return [
          name,
          item.scheme_name || "—",
          `₹${item.scheme_total_amount || 0}`,
          `₹${item.installment_amount || 0}`,
          `₹${item.total_paid || 0}`,
          `${paid}/${totalInstallments}`,
        ];
      });

      doc.autoTable({ head: [columns], body: rows, startY: 20 });
      doc.save("Customer_Payment_Report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const downloadCollectionExcel = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cashcollection/customer-schemes/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });

      const data = response.data || [];
      if (data.length === 0) {
        alert("No data available to export.");
        return;
      }

      const exportData = data.map((item) => {
        const name = `${item.customer_details?.first_name || ""} ${item.customer_details?.last_name || ""}`;
        const totalInstallments = (item.installments_paid || 0) + (item.installments_remaining || 0);
        const paid = item.installments_paid || 0;

        return {
          Customer: name,
          Scheme: item.scheme_name || "—",
          "Total Amount": `₹${item.scheme_total_amount || 0}`,
          "Installment Amount": `₹${item.installment_amount || 0}`,
          "Total Paid": `₹${item.total_paid || 0}`,
          "Installments (Paid/Total)": `${paid}/${totalInstallments}`,
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      worksheet["!cols"] = [
        { wpx: 180 },
        { wpx: 160 },
        { wpx: 130 },
        { wpx: 150 },
        { wpx: 130 },
        { wpx: 170 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Payments");

      XLSX.writeFile(workbook, "Customer_Payment_Report.xlsx");
    } catch (error) {
      console.error("Error exporting Excel:", error);
    }
  };

  return (
    <div className="panel-header">
      <h5>Customer Payments Status</h5>
      <div className="btn-box d-flex flex-wrap gap-2 align-items-center">
        <Form.Control
          type="text"
          placeholder="Search..."
          onChange={(e) => onSearch(e.target.value)}
          style={{ width: "250px" }}
        />
        <Button className="btn btn-sm btn-success ms-2" onClick={downloadCollectionPDF}>
          <i className="fa fa-download me-1"></i> PDF
        </Button>
        <Button className="btn btn-sm btn-info ms-2 text-white" onClick={downloadCollectionExcel}>
          <i className="fa fa-file-excel me-1"></i> Excel
        </Button>
      </div>
    </div>
  );
};

export default AllCollectionProgressHeader;
