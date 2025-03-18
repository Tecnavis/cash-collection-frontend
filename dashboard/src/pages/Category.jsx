// import React, { useContext, useState } from "react";
// import { Form, Button } from "react-bootstrap";
// // import { DigiContext } from "../../context/DigiContext";
// import { Link } from "react-router-dom";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import axios from "axios";
// import { BASE_URL } from "../api";
// import * as XLSX from "xlsx"; 
// import Cookies from "js-cookie";
// import Footer from '../components/footer/Footer'
// import AddNewCategory from '../components/category/AddNewCategory'
// import AllCategory from '../components/category/AllCategory'

// const CategoryMainContent = () => {
//   const downloadSalesExcel = async () => {
//     try {
//       const token = Cookies.get("access_token");  
//       const response = await axios.get(`${BASE_URL}/cashcollection/schemes/`, {
//           headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`
//           }
//       });
//       const transactions = response.data;

//       if (transactions.length === 0) {
//         alert("No data available to export.");
//         return;
//       }

//       const exportData = transactions
//         .map((transaction) => ({
//           "Scheme Number": transaction.scheme_number,
//           "Name": transaction.name,
//           "Total Amount": transaction.total_amount,
//           "Collection freequency": transaction.collection_frequency || "N/A",
//           "Installment Amount": `Rs ${transaction.installment_amount}`|| "N/A",
//           // "Remaining Amount": `Rs ${transaction.remaining_amount}`,
//           "Start Date": transaction.start_date,
//           "End Date": transaction.end_date || "N/A",
//         }));

//       const ws = XLSX.utils.json_to_sheet(exportData);

//       const colWidths = [
//         { wpx: 100 }, 
//         { wpx: 150 },
//         { wpx: 200 }, 
//         { wpx: 100 }, 
//         { wpx: 100 }, 
//         { wpx: 150 },
//         { wpx: 100 }, 
//         { wpx: 150 }, 
//       ];

//       ws['!cols'] = colWidths; 

     
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Sales Data");

//       XLSX.writeFile(wb, "Schema_Report.xlsx");
//     } catch (error) {
//       console.error("Error exporting Schema Report Excel:", error);
//     }
//   };
//   const uploadSalesExcel = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
  
//     const formData = new FormData();
//     formData.append("excel_file", file);  
  
//     try {
//       const response = await axios.post(
//         `${BASE_URL}/cashcollections/import-excel/`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//              "Authorization": `Bearer ${Cookies.get("access_token")}` 
//           },
//         }
//       );
//       alert("scheme data imported successfully!");
//     } catch (error) {
//       console.error("Error uploading sales data:", error.response?.data || error);
//       alert("Error uploading sales data");
//     }
//   };
  
//   return (
//     <div className="main-content">
//         <div className="dashboard-breadcrumb dashboard-panel-header mb-30">
//             <h2>Schemes</h2>
//             <Button className="btn btn-sm btn-info ms-2 text-white" onClick={downloadSalesExcel}>
//             <i className="fa-light fa-file-excel"></i>Excel
//           </Button>

//           <input type="file" accept=".xlsx, .xls" onChange={uploadSalesExcel} className="d-none" id="uploadExcel" />
//           <label htmlFor="uploadExcel" className="btn btn-sm btn-primary ms-2 text-white">
//             <i className="fa-light fa-upload"></i> Import
//           </label>
//         </div>


//         <div className="row g-4">
//             <AddNewCategory/>
//             <AllCategory/>
//         </div>

//         <Footer/>
//     </div>
//   )
// }

// export default CategoryMainContent

import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { BASE_URL } from "../api";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";
import Footer from '../components/footer/Footer';
import AddNewCategory from '../components/category/AddNewCategory';
import AllCategory from '../components/category/AllCategory';

const CategoryMainContent = () => {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const downloadSalesExcel = async () => {
    try {
      const token = Cookies.get("access_token");  
      const response = await axios.get(`${BASE_URL}/cashcollection/schemes/`, {
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
          }
      });
      const transactions = response.data;

      if (transactions.length === 0) {
        alert("No data available to export.");
        return;
      }

      const exportData = transactions.map((transaction) => ({
        "Scheme Number": transaction.scheme_number,
        "Name": transaction.name,
        "Total Amount": transaction.total_amount,
        "Collection Frequency": transaction.collection_frequency || "N/A",
        "Installment Amount": `Rs ${transaction.installment_amount}` || "N/A",
        "Start Date": transaction.start_date,
        "End Date": transaction.end_date || "N/A",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      ws['!cols'] = [
        { wpx: 100 }, { wpx: 150 }, { wpx: 200 }, { wpx: 100 },
        { wpx: 100 }, { wpx: 150 }, { wpx: 100 }, { wpx: 150 }
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Schemes Report");
      XLSX.writeFile(wb, "Schema_Report.xlsx");
    } catch (error) {
      console.error("Error exporting Schema Report Excel:", error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadSalesExcel = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("excel_file", file);

    try {
      await axios.post(
        `${BASE_URL}/cashcollections/import-excel/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${Cookies.get("access_token")}`
          },
        }
      );
      alert("Scheme data imported successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Error uploading sales data:", error.response?.data || error);
      alert("Error uploading sales data");
    }
  };

  return (
    <div className="main-content">
      <div className="dashboard-breadcrumb dashboard-panel-header mb-30">
        <h2>Schemes</h2>
        <Button className="btn btn-sm btn-info ms-2 text-white" onClick={downloadSalesExcel}>
          <i className="fa-light fa-file-excel"></i> Excel
        </Button>
        <Button className="btn btn-sm btn-primary ms-2 text-white" onClick={handleShowModal}>
          <i className="fa-light fa-upload"></i> Import
        </Button>
      </div>
      
      <div className="row g-4">
        <AddNewCategory />
        <AllCategory />
      </div>

      <Footer />

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Import Scheme Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please use the following template format:</p>
          <div style={{ overflowX: "auto" }}>
            <table className="table table-bordered text-nowrap">
              <thead>
                <tr>
                  <th>Scheme Number</th>
                  <th>Name</th>
                  <th>Total Amount</th>
                  <th>Collection Frequency</th>
                  <th>Installment Amount</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>12345</td>
                  <td>Sample Scheme</td>
                  <td>10000</td>
                  <td>Monthly</td>
                  <td>Rs 1000</td>
                  <td>2025-01-01</td>
                  <td>2026-01-01</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Form.Group>
            <Form.Label>Upload Excel File</Form.Label>
            <Form.Control type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={uploadSalesExcel}>Import</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategoryMainContent;
