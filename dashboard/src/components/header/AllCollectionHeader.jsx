import React, { useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { DigiContext } from "../../context/DigiContext";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { BASE_URL } from "../../api";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";

const AllCollectionHeader = ({ onSearch }) => {
  const { headerBtnOpen, handleHeaderBtn, handleHeaderReset, headerRef } =
    useContext(DigiContext);
    

  const downloadCollectionPDF = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cashcollection/cashcollections/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
      const data = response.data;

      const doc = new jsPDF();
      doc.setFontSize(10);
      doc.text("Cash Collection Report", doc.internal.pageSize.getWidth() / 2, 10, { align: "center" });

      const columns = [
        "Joined Date",
        "Customer Name",
        "Scheme Name",
        "Total Amount",
        "Start Date",
        "End Date",
      ];

      const rows = data.map((item) => [
        new Date(item.created_at).toLocaleString(),
        `${item.customer_details.shop_name} - ${item.customer_details.first_name} ${item.customer_details.last_name}`,
        item.scheme_name,
        `Rs ${item.scheme_total_amount}`,
        item.start_date,
        item.end_date,
      ]);

      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 20,
      });

      doc.save("Cash_Collection_Report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const downloadCollectionExcel = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cashcollection/cashcollections/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
      const data = response.data;

      if (data.length === 0) {
        alert("No data available to export.");
        return;
      }

      const exportData = data.map((item) => ({
        "Joined Date": new Date(item.created_at).toLocaleString(),
        "Customer Name": `${item.customer_details.shop_name} - ${item.customer_details.first_name} ${item.customer_details.last_name}`,
        "Scheme Name": item.scheme_name,
        "Total Amount": `Rs ${item.scheme_total_amount}`,
        "Start Date": item.start_date,
        "End Date": item.end_date,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      ws["!cols"] = [
        { wpx: 140 },
        { wpx: 200 },
        { wpx: 160 },
        { wpx: 130 },
        { wpx: 120 },
        { wpx: 120 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Cash Collection");

      XLSX.writeFile(wb, "Cash_Collection_Report.xlsx");
    } catch (error) {
      console.error("Error exporting Excel:", error);
    }
  };

  return (
    <div className="panel-header">
      <h5>Schemewise Customer</h5>
      <div className="btn-box d-flex flex-wrap gap-2">
        <div id="tableSearch">
        <Form.Control
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => onSearch(e.target.value)}
                  style={{ width: "250px" }}
                />
        </div>
        <div className="btn-box">
          <Button className="btn btn-sm btn-success ms-2" onClick={downloadCollectionPDF}>
            <i className="fa fa-download"></i> PDF
          </Button>
          <Button className="btn btn-sm btn-info ms-2 text-white" onClick={downloadCollectionExcel}>
            <i className="fa fa-file-excel"></i> Excel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AllCollectionHeader;
