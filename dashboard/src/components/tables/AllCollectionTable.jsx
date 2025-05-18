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
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataPerPage] = useState(300);
  const [dataList, setDataList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const token = Cookies.get("access_token");
      
      // Fetch both transactions and schemes data
      const [transactionsResponse, schemesResponse] = await Promise.all([
        axios.get(`${BASE_URL}/cashcollection/cashcollections/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/cashcollection/schemes/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      // Store the schemes data
      setSchemes(schemesResponse.data);
      
      // Process transactions with the scheme data
      processTransactions(transactionsResponse.data, schemesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };
  
  // Extract customer number from name (e.g., "Customer 3" returns 3)
  const extractCustomerNumber = (name) => {
    const match = name.match(/\d+$/);
    if (match) {
      return parseInt(match[0]);
    }
    return 1; // Default multiplier if no number found
  };

  // Get the scheme total amount from schemes data
  const getSchemeAmount = (schemeName, schemesData) => {
    const scheme = schemesData.find(s => s.name === schemeName);
    return scheme ? parseFloat(scheme.total_amount) : 0;
  };

  const processTransactions = (data, schemesData) => {
    const formattedTransactions = data.map((transaction, index) => {
      const customerFullName = `${transaction.customer_details.shop_name} - ${transaction.customer_details.first_name} ${transaction.customer_details.last_name}`;
      
      // Get customer multiplier
      const customerNumber = extractCustomerNumber(customerFullName);
      
      // Get base scheme amount
      const baseSchemeAmount = getSchemeAmount(transaction.scheme_name, schemesData);
      
      // Calculate total scheme amount
      const calculatedSchemeAmount = baseSchemeAmount * customerNumber;
      
      return {
        ...transaction,
        serialNumber: index + 1,
        showDropdown: false,
        base_scheme_amount: baseSchemeAmount,
        scheme_total_amount: calculatedSchemeAmount,
        customerNumber: customerNumber
      };
    });

    setTransactions(formattedTransactions);
    setDataList(formattedTransactions);
    
    // Calculate total pages
    const calculatedTotalPages = Math.ceil(formattedTransactions.length / dataPerPage);
    setTotalPages(calculatedTotalPages || 1);
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
                    </td>
                    <td>{transaction.scheme_name}</td>
                    <td>Rs {transaction.scheme_total_amount ? transaction.scheme_total_amount.toLocaleString() : "0"}</td>
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
                <p><strong>Base Amount:</strong> Rs {selectedTransaction.base_scheme_amount?.toLocaleString() || "0"}</p>
                <p><strong>Total Amount:</strong> Rs {selectedTransaction.scheme_total_amount?.toLocaleString() || "0"}</p>
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
