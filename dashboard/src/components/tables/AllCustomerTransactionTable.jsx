import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Table, Modal, Button } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import AllCustomerTransactionHeader from "../header/AllCustomerTransactionHeader";
import PaginationSection from "./PaginationSection";

const AllCustomerTransactionTable = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [schemes, setSchemes] = useState([]); // Add state for schemes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataPerPage] = useState(10);
  const pdfRef = useRef(); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch both customer transactions and schemes data
      const [transactionsResponse, schemesResponse] = await Promise.all([
        axios.get(
          `${BASE_URL}/cashcollection/customer-scheme-payments/`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("access_token")}`,
            },
          }
        ),
        axios.get(
          `${BASE_URL}/cashcollection/schemes/`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("access_token")}`,
            },
          }
        )
      ]);

      // Store schemes data
      setSchemes(schemesResponse.data);

      const groupedCustomers = transactionsResponse.data.reduce((acc, item) => {
        let customer = acc.find((c) => c.customer_details.id === item.customer_details.id);

        if (!customer) {
          customer = {
            customer_details: item.customer_details,
            schemes: [],
          };
          acc.push(customer);
        }

        let scheme = customer.schemes.find((s) => s.scheme_name === item.scheme_name);

        if (!scheme) {
          scheme = {
            scheme_name: item.scheme_name,
            scheme_total_amount: item.scheme_total_amount,
            payment_history: [],
          };
          customer.schemes.push(scheme);
        }

        const existingPayments = new Set(
          scheme.payment_history.map((p) => JSON.stringify(p))
        );

        item.payment_history.forEach((payment) => {
          const paymentStr = JSON.stringify(payment);
          if (!existingPayments.has(paymentStr)) {
            scheme.payment_history.push(payment);
            existingPayments.add(paymentStr);
          }
        });

        return acc;
      }, []);

      setCustomers(groupedCustomers);
      setFilteredCustomers(groupedCustomers); 
      setTotalPages(Math.ceil(groupedCustomers.length / dataPerPage));
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Extract customer number from name (e.g., "Customer 3" returns 3)
  const extractCustomerNumber = (customer) => {
    const fullName = `${customer.customer_details.first_name} ${customer.customer_details.last_name}`;
    
    const regex = /(\d+)(?:\s*-|\s*$)/;
    const match = fullName.match(regex);
    
    if (match && match[1]) {
      const number = parseInt(match[1]);
      return number;
    }
    
    return 1; 
  };

  // Get scheme amount from the schemes data
  const getSchemeAmount = (schemeName) => {
    const scheme = schemes.find(s => s.name === schemeName);
    return scheme ? parseFloat(scheme.total_amount) : 0;
  };

  // Calculate scheme total based on scheme amount and customer number
  const calculateSchemeTotal = (schemeName, customer) => {
    const customerNumber = extractCustomerNumber(customer);
    const baseAmount = getSchemeAmount(schemeName);
    return customerNumber * baseAmount;
  };

  const handleShowModal = (scheme, customer) => {
    // Calculate the adjusted total using the scheme's actual base amount
    const customerMultiplier = extractCustomerNumber(customer);
    const baseAmount = getSchemeAmount(scheme.scheme_name);
    const adjustedTotal = customerMultiplier * baseAmount;
    
    // Create an adjusted scheme object with the correct total amount
    const adjustedScheme = {
      ...scheme,
      original_total_amount: scheme.scheme_total_amount,
      scheme_total_amount: adjustedTotal,
      multiplier: customerMultiplier,
      base_amount: baseAmount
    };
    
    setSelectedScheme(adjustedScheme);
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const downloadPDF = async () => {
    const input = pdfRef.current;
    const canvas = await html2canvas(input, {
      scale: 2,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${selectedScheme?.scheme_name}_receipt.pdf`);
  };

  const handleSearch = (query) => {
    if (query.trim() === "") {
      setFilteredCustomers(customers);
      setTotalPages(Math.ceil(customers.length / dataPerPage));
      setCurrentPage(1);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = customers.filter((customer) => {
      const customerName = `${customer.customer_details.first_name} ${customer.customer_details.last_name}`.toLowerCase();
      const shopName = customer.customer_details.shop_name?.toLowerCase() || "";
      const contact = customer.customer_details.contact_number?.toLowerCase() || "";

      const schemeMatch = customer.schemes.some((scheme) =>
        scheme.scheme_name?.toLowerCase().includes(lowerQuery)
      );

      return (
        customerName.includes(lowerQuery) ||
        shopName.includes(lowerQuery) ||
        contact.includes(lowerQuery) ||
        schemeMatch
      );
    });

    setFilteredCustomers(filtered);
    setTotalPages(Math.ceil(filtered.length / dataPerPage));
    setCurrentPage(1);
  };

  // Format currency in Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount).replace('₹', '₹');
  };

  // Pagination handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Calculate current customers to display
  const indexOfLastCustomer = currentPage * dataPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - dataPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="panel">
      <AllCustomerTransactionHeader onSearch={handleSearch} />

      <OverlayScrollbarsComponent>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Contact</th>
              <th>Joined Schemes</th>
              <th>Total Paid Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length > 0 ? (
              currentCustomers.map((customer, index) => (
                <tr key={index}>
                  <td>
                    {customer.customer_details.first_name}{" "}
                    {customer.customer_details.last_name} -{" "}
                    {customer.customer_details.shop_name}
                  </td>
                  <td>{customer.customer_details.contact_number}</td>
                  <td>
                    {customer.schemes.map((scheme, idx) => (
                      <div key={idx}>
                        <Button
                          variant="link"
                          onClick={() => handleShowModal(scheme, customer)}
                          style={{ textDecoration: "none", fontWeight: "bold" }}
                        >
                          {scheme.scheme_name}
                        </Button>
                      </div>
                    ))}
                  </td>
                  <td>
                    {customer.schemes.map((scheme, idx) => (
                      <div key={idx}>
                        {formatCurrency(
                          scheme.payment_history.reduce(
                            (sum, payment) => sum + parseFloat(payment.amount),
                            0
                          )
                        )}
                      </div>
                    ))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No transactions found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </OverlayScrollbarsComponent>

      {/* Pagination */}
      <PaginationSection
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        pageNumbers={Array.from({ length: totalPages }, (_, i) => i + 1)}
      />

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Payment Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              background: "#E5FFE5",
              borderRadius: "8px",
              padding: "20px",
              position: "relative",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {selectedScheme && selectedCustomer ? (
              <div>
                <h5>{selectedScheme.scheme_name}</h5>
                <p>
                  <strong>Total Amount:</strong> {formatCurrency(selectedScheme.scheme_total_amount)}
                </p>
                <p>
                  <strong>Total Paid:</strong> {formatCurrency(
                    selectedScheme.payment_history.reduce(
                      (sum, payment) => sum + parseFloat(payment.amount),
                      0
                    )
                  )}
                </p>
                <p>
                  <strong>Remaining:</strong> {formatCurrency(
                    selectedScheme.scheme_total_amount -
                    selectedScheme.payment_history.reduce(
                      (sum, payment) => sum + parseFloat(payment.amount),
                      0
                    )
                  )}
                </p>
                {selectedScheme.payment_history.length > 0 ? (
                  <Table striped bordered responsive>
                    <thead>
                      <tr>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedScheme.payment_history.map((payment, index) => (
                        <tr key={index}>
                          <td>{formatCurrency(payment.amount)}</td>
                          <td>{payment.payment_method}</td>
                          <td>
                            {new Date(payment.date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>No payment history available.</p>
                )}
              </div>
            ) : null}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={downloadPDF}>
            Download PDF
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Hidden PDF div for export */}
      <div
        ref={pdfRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "210mm",
          backgroundColor: "#fff",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          color: "#000",
        }}
      >
        {selectedScheme && selectedCustomer && (
          <>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Payment Receipt
            </h2>
            <p>
              <strong>Scheme:</strong> {selectedScheme.scheme_name}
            </p>
            <p>
              <strong>Customer:</strong> {selectedCustomer.customer_details.first_name} {selectedCustomer.customer_details.last_name}
            </p>
            <p>
              <strong>Shop:</strong> {selectedCustomer.customer_details.shop_name}
            </p>
            
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {selectedScheme.payment_history.map((payment, index) => (
                  <tr key={index}>
                    <td>{formatCurrency(payment.amount)}</td>
                    <td>{payment.payment_method}</td>
                    <td>{new Date(payment.date).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                  <td colSpan="2" style={{ textAlign: "right" }}>
                    Total Paid
                  </td>
                  <td>
                    {formatCurrency(
                      selectedScheme.payment_history.reduce(
                        (sum, payment) => sum + parseFloat(payment.amount),
                        0
                      )
                    )}
                  </td>
                </tr>
                <tr style={{ fontWeight: "bold", backgroundColor: "#fff9e6" }}>
                  <td colSpan="2" style={{ textAlign: "right" }}>
                    Remaining
                  </td>
                  <td>
                    {formatCurrency(
                      selectedScheme.scheme_total_amount -
                        selectedScheme.payment_history.reduce(
                          (sum, payment) => sum + parseFloat(payment.amount),
                          0
                        )
                    )}
                  </td>
                </tr>
                <tr style={{ fontWeight: "bold", backgroundColor: "#e6f7ff" }}>
                  <td colSpan="2" style={{ textAlign: "right" }}>
                    Scheme Total
                  </td>
                  <td>{formatCurrency(selectedScheme.scheme_total_amount)}</td>
                </tr>
              </tbody>
            </Table>
          </>
        )}
      </div>
    </div>
  );
};

export default AllCustomerTransactionTable;