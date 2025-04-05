import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { DigiContext } from "../../context/DigiContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";
import { Form } from "react-bootstrap";

const AllCustomerTransactionHeader = ({ onSearch }) => {
  const { headerBtnOpen, handleHeaderBtn, handleHeaderReset, headerRef } = useContext(DigiContext);

  const fetchAndGroupTransactions = async () => {
    const response = await axios.get(`${BASE_URL}/cashcollection/customer-scheme-payments/`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("access_token")}`,
      },
    });
    const grouped = response.data.reduce((acc, item) => {
      const customerId = item.customer_details.id;
      if (!acc[customerId]) {
        acc[customerId] = {
          customer: item.customer_details,
          schemes: {},
        };
      }
      if (!acc[customerId].schemes[item.scheme_name]) {
        acc[customerId].schemes[item.scheme_name] = {
          total: item.scheme_total_amount,
          payments: [],
        };
      }

      item.payment_history.forEach((p) => {
        if (!acc[customerId].schemes[item.scheme_name].payments.find(pay => pay.date === p.date && pay.amount === p.amount)) {
          acc[customerId].schemes[item.scheme_name].payments.push(p);
        }
      });

      return acc;
    }, {});

    return grouped;
  };

  const downloadAllPDF = async () => {
    const grouped = await fetchAndGroupTransactions();
    const pdf = new jsPDF();

    let y = 10;
    pdf.setFontSize(12);
    pdf.text("All Customer Transactions", 105, y, { align: "center" });
    y += 10;

    Object.values(grouped).forEach((entry, idx) => {
      const { customer, schemes } = entry;
      pdf.setFontSize(10);
      pdf.text(`Customer: ${customer.first_name} ${customer.last_name} - ${customer.shop_name}`, 10, y);
      y += 6;
      pdf.text(`Contact: ${customer.contact_number}`, 10, y);
      y += 6;

      Object.entries(schemes).forEach(([schemeName, scheme]) => {
        pdf.text(`Scheme: ${schemeName}`, 10, y);
        y += 6;

        const headers = [["Amount", "Method", "Date"]];
        const data = scheme.payments.map(p => [p.amount, p.payment_method, new Date(p.date).toLocaleDateString("en-IN")]);

        pdf.autoTable({
          startY: y,
          head: headers,
          body: data,
          theme: "grid",
          styles: { fontSize: 8 },
          margin: { left: 10, right: 10 },
        });

        y = pdf.autoTable.previous.finalY + 10;
        pdf.text(`Total Paid: ₹${scheme.payments.reduce((sum, p) => sum + parseFloat(p.amount), 0)}`, 10, y);
        y += 6;
        pdf.text(`Remaining: ₹${scheme.total - scheme.payments.reduce((sum, p) => sum + parseFloat(p.amount), 0)}`, 10, y);
        y += 10;

        // Add new page if nearing bottom
        if (y > 260) {
          pdf.addPage();
          y = 10;
        }
      });

      pdf.line(10, y, 200, y); // separator
      y += 10;
    });

    pdf.save("All_Customer_Transactions.pdf");
  };

  const downloadExcel = async () => {
    const grouped = await fetchAndGroupTransactions();
    const rows = [];

    Object.values(grouped).forEach((entry) => {
      const { customer, schemes } = entry;

      Object.entries(schemes).forEach(([schemeName, scheme]) => {
        scheme.payments.forEach((payment) => {
          rows.push({
            Customer: `${customer.first_name} ${customer.last_name}`,
            Shop: customer.shop_name,
            Contact: customer.contact_number,
            Scheme: schemeName,
            Amount: payment.amount,
            Method: payment.payment_method,
            Date: new Date(payment.date).toLocaleDateString("en-IN"),
            Total: scheme.total,
            Paid: scheme.payments.reduce((sum, p) => sum + parseFloat(p.amount), 0),
            Remaining: scheme.total - scheme.payments.reduce((sum, p) => sum + parseFloat(p.amount), 0),
          });
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "Customer_Transactions.xlsx");
  };

  return (
      <div className="panel-header">
          <h5>Customerwise Report</h5>
          <div className="btn-box d-flex flex-wrap gap-2">
            <div id="tableSearch">
            <Form.Control
                      type="text"
                      placeholder="Search"
                      onChange={(e) => onSearch(e.target.value)}
                      style={{ width: "250px" }}
                    />
            </div>
            <div className="btn-box">
                 <Button className="btn btn-sm btn-success ms-2" onClick={downloadAllPDF}>
                          <i className="fa fa-download"></i> PDF
                        </Button>
                        <Button className="btn btn-sm btn-info ms-2 text-white" onClick={downloadExcel}>
                          <i className="fa fa-file-excel"></i> Excel
                      </Button>
            </div>
          </div>
        </div>

  );
};
export default AllCustomerTransactionHeader;

