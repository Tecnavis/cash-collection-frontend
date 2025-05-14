import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";
import AllCollectionHeader from "../header/AllCollectionHeader";

const AllCollectionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataPerPage] = useState(300);
  const [dataList, setDataList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [originalTransaction, setOriginalTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const BASE_AMOUNT = 204000; 

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  
  const extractMultiplierFromName = (customerName) => {
    
    const match = customerName.match(/\d+/);
    if (match) {
      return parseInt(match[0]);
    }
    return 1; 
  };

  
  const calculateSchemeTotalAmount = (customerName) => {
    const multiplier = extractMultiplierFromName(customerName);
    return BASE_AMOUNT * multiplier;
  };

  const fetchTransactions = async () => {
    try {
      const token = Cookies.get("access_token");
      const response = await axios.get(`${BASE_URL}/cashcollection/cashcollections/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedTransactions = response.data.map((transaction, index) => {
        
        const customerFullName = `${transaction.customer_details.shop_name} - ${transaction.customer_details.first_name} ${transaction.customer_details.last_name}`;
        
        
        const calculatedAmount = calculateSchemeTotalAmount(customerFullName);
        
        return {
          ...transaction,
          serialNumber: index + 1,
          showDropdown: false,
          
          original_scheme_total_amount: transaction.scheme_total_amount,
          scheme_total_amount: calculatedAmount,
          
          multiplier: extractMultiplierFromName(customerFullName)
        };
      });

      setTransactions(formattedTransactions);
      setDataList(formattedTransactions);
      
      
      const calculatedTotalPages = Math.ceil(formattedTransactions.length / dataPerPage);
      setTotalPages(calculatedTotalPages || 1);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Error fetching transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setDataList(transactions);
    } else {
      const filteredData = transactions.filter((transaction) => {
        const customerName = `${transaction.customer_details.first_name} ${transaction.customer_details.last_name}`.toLowerCase();
        const shopName = transaction.customer_details.shop_name?.toLowerCase() || "";
        const schemeName = transaction.scheme_name?.toLowerCase() || "";
        const createdBy = transaction.created_by?.toLowerCase() || "";
        
        return customerName.includes(query.toLowerCase()) ||
               shopName.includes(query.toLowerCase()) ||
               schemeName.includes(query.toLowerCase()) ||
               createdBy.includes(query.toLowerCase());
      });
      setDataList(filteredData);
    }
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  
  const getStartingIndex = () => {
    return (currentPage - 1) * dataPerPage;
  };

  const currentData = dataList.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <AllCollectionHeader onSearch={handleSearch} />
      <OverlayScrollbarsComponent>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Joined Date</th>
              <th>Customer Name</th>
              <th>Scheme Name</th>
              <th>Scheme Total Amount</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((transaction, index) => {
                const customerFullName = `${transaction.customer_details.shop_name} - ${transaction.customer_details.first_name} ${transaction.customer_details.last_name}`;
                return (
                  <tr key={transaction.id || index}>
                    <td>{getStartingIndex() + index + 1}</td>
                    <td>{new Date(transaction.created_at).toLocaleString()}</td>
                    <td>
                      {customerFullName}
                      {/* {transaction.multiplier > 1 && <span className="text-primary ms-1">(×{transaction.multiplier})</span>} */}
                    </td>
                    <td>{transaction.scheme_name}</td>
                    <td>Rs {transaction.scheme_total_amount.toLocaleString()}</td>
                    <td>{transaction.start_date}</td>
                    <td>{transaction.end_date}</td>
                    <td>
                      <i
                        className="fa-light fa-eye text me-3 cursor-pointer"
                        style={{ fontSize: "18px" }}
                        onClick={() => handleViewTransaction(transaction)}
                      ></i>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No transactions found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </OverlayScrollbarsComponent>

      {/* View Transaction Modal */}
      {showModal && selectedTransaction && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 rounded">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Transaction Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4 text-center">
                <i className="fa-solid fa-file-invoice fa-4x text-primary mb-3"></i>
                <p><strong>Customer:</strong> {selectedTransaction.customer_details.shop_name} - {selectedTransaction.customer_details.first_name} {selectedTransaction.customer_details.last_name}</p>
                <p><strong>Scheme Name:</strong> {selectedTransaction.scheme_name || "N/A"}</p>
                {/* <p><strong>Base Amount:</strong> Rs {BASE_AMOUNT.toLocaleString()}</p> */}
                {/* <p><strong>Multiplier:</strong> {selectedTransaction.multiplier}</p> */}
                <p><strong>Total Amount:</strong> Rs {selectedTransaction.scheme_total_amount.toLocaleString()}</p>
                <p><strong>Start Date:</strong> {selectedTransaction.start_date || "N/A"}</p>
                <p><strong>End Date:</strong> {selectedTransaction.end_date || "N/A"}</p>
                <p><strong>Joined Date:</strong> {new Date(selectedTransaction.created_at).toLocaleString()}</p>
                {selectedTransaction.created_by && (
                  <p><strong>Created By:</strong> {selectedTransaction.created_by}</p>
                )}
              </div>
              <div className="modal-footer justify-content-center">
                <button type="button" className="btn btn-danger px-4" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PaginationSection
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        pageNumbers={Array.from({ length: totalPages }, (_, i) => i + 1)}
      />
    </>
  );
};

export default AllCollectionTable;