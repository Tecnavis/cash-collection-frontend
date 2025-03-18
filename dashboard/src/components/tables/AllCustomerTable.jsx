import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";


const AllCustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataPerPage] = useState(10);
  const [dataList, setDataList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchCustomers(currentPage);
  }, [currentPage]);

  const fetchCustomers = async (page) => {
    try {
      const token = Cookies.get("access_token");
      const response = await axios.get(`${BASE_URL}/partner/partner/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedCustomers = response.data.results.map((customer) => ({
        id: customer.id,
        first_name: customer.user.first_name,
        last_name: customer.user.last_name,
        email: customer.user.email,
        secondary_contact: customer.secondary_contact || "N/A",
        address: customer.address || "N/A",
        other_info: customer.other_info || "N/A",
        showDropdown: false, 
      }));
  
      setCustomers(formattedCustomers);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Error fetching customers");
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewEmployee = async (id) => {
    if (!id) {
      console.error("Invalid employee ID:", id);
      return;
    }
  
    try {
      const token = Cookies.get("access_token");
      const response = await fetch(`${BASE_URL}/partner/partners/${id}/details/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch employee details");
      }
  
      const data = await response.json();
      if (!data || !data.id) {
        throw new Error("Invalid data received");
      }
  
      // Ensure `isEditing` is NOT set or is set to false
      setSelectedEmployee({ ...data, isEditing: false });
  
      // Ensure modal opens
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };
  

    const handleOpenEditModal = (customer) => {
      setSelectedEmployee({ ...customer, isEditing: true });
      setShowModal(true);
  };

  const handleUpdateEmployee = async () => {
    if (!selectedEmployee || !selectedEmployee.id) {
        console.error("No employee selected for update.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/partner/partners/${selectedEmployee.id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get("access_token")}`
            },
            body: JSON.stringify({
                first_name: selectedEmployee.first_name || "",
                last_name: selectedEmployee.last_name || "",
                email: selectedEmployee.email || "",
                secondary_contact: selectedEmployee.secondary_contact || "",
                address: selectedEmployee.address || "",
                other_info: selectedEmployee.other_info || ""
            }),
            
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error updating employee:", errorData);
            alert(`Failed to update employee: ${errorData.message || "Unknown error"}`);
            return;
        }

        const updatedData = await response.json();
        console.log("Updated Employee:", updatedData);
        fetchCustomers(); 

        // Close modal
        setShowModal(false);

    } catch (error) {
        console.error("Network error:", error);
        alert("A network error occurred. Please try again later.");
    }
};
    const handleDeleteEmployee = async (id) => {
      if (window.confirm("Are you sure you want to delete this employee?")) {
        try {
          const response = await fetch(`${BASE_URL}/partner/partners/${id}/delete/`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Cookies.get("access_token")}`
            },
          });
    
          if (response.ok) {
            setDataList(dataList.filter((employee) => employee.id !== id));
            setShowModal(false);
          } else {
            console.error("Failed to delete employee:", await response.text());
          }
        } catch (error) {
          console.error("Error deleting employee:", error);
        }
        fetchCustomers(); 
      }
    };

  const currentData = dataList.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  if (loading) return <p>Loading customers...</p>;
  if (error) return <p>{error}</p>;
  return (
    <>
      <OverlayScrollbarsComponent>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Profile ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Address</th>
              <th>Other Info</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {customers.length > 0 ? (
            customers.map((customer, index) => (
              <tr key={index}>

                <td>{customer.id}</td> 
                <td>{`${customer.first_name} ${customer.last_name}`}</td>
                <td>{customer.email || "N/A"}</td>
                <td>{customer.secondary_contact}</td>
                <td>{customer.address}</td>
                <td>{customer.other_info}</td>

                <td>
                  <i
                    className="fa-light fa-eye text me-3 cursor-pointer"
                    style={{ fontSize: "18px" }}
                    onClick={() => handleViewEmployee(customer.id)}
                  ></i>
                  <i
                    className="fa-light fa-pen-nib text me-3 cursor-pointer"
                    style={{ fontSize: "18px" }}
                    onClick={() => handleOpenEditModal(customer)}
                  ></i>
                  <i
                    className="fa-light fa-trash-can text cursor-pointer"
                    style={{ fontSize: "18px" }}
                    onClick={() => handleDeleteEmployee(customer.id)}
                  ></i>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No customers found</td>
            </tr>
          )}
        </tbody>
        </Table>
          {showModal && selectedEmployee && (
            selectedEmployee.isEditing ? (
              // Edit Modal
              <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Update Employee</h5>
                      <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                    </div>
                    <div className="modal-body">
                    <div className="modal-body">
                      <form>
                
                        <div className="mb-3">
                          <label className="form-label">Profile ID</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedEmployee.id || ''}
                            disabled // Making Profile ID non-editable
                          />
                        </div>

                        {/* Name */}
                        <div className="mb-3">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedEmployee.first_name || ''}
                            onChange={(e) =>
                              setSelectedEmployee({ ...selectedEmployee, first_name: e.target.value })
                            }
                          />
                        </div>

                        {/* Email */}
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={selectedEmployee.email || ''}
                            onChange={(e) =>
                              setSelectedEmployee({ ...selectedEmployee, email: e.target.value })
                            }
                          />
                        </div>

                        {/* Contact Number */}
                        <div className="mb-3">
                          <label className="form-label">Contact Number</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedEmployee.secondary_contact || ''}
                            onChange={(e) =>
                              setSelectedEmployee({ ...selectedEmployee, secondary_contact: e.target.value })
                            }
                          />
                        </div>

                        {/* Address */}
                        <div className="mb-3">
                          <label className="form-label">Address</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedEmployee.address || ''}
                            onChange={(e) =>
                              setSelectedEmployee({ ...selectedEmployee, address: e.target.value })
                            }
                          />
                        </div>

                        {/*Other info */}
                        <div className="mb-3">
                          <label className="form-label">Other Info</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedEmployee.other_info || ''}
                            onChange={(e) =>
                              setSelectedEmployee({ ...selectedEmployee, other_info: e.target.value })
                            }
                          />
                        </div>
                      </form>
                    </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                        Close
                      </button>
                      <button type="button" className="btn btn-primary" onClick={handleUpdateEmployee}>
                        Save changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (

    // View Modal
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 rounded">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Employee Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4 text-center">
                <i className="fa-solid fa-user-circle fa-4x text-primary mb-3"></i>
                <p><strong>Profile ID:</strong> {selectedEmployee.id || "N/A"}</p>
                <p><strong>Other Info:</strong> {selectedEmployee.other_info || "N/A"}</p>
                <p><strong>Email:</strong> {selectedEmployee.user.email || "N/A"}</p>
                <p><strong>Name:</strong> {selectedEmployee.user.first_name} {selectedEmployee.last_name}</p>
                <p><strong>Phone:</strong> {selectedEmployee.secondary_contact || "N/A"}</p>
                <p><strong>Address:</strong> {selectedEmployee.address || "N/A"}</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button type="button" className="btn btn-danger px-4" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    )}
      </OverlayScrollbarsComponent>
      <PaginationSection
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        pageNumbers={Array.from({ length: totalPages }, (_, i) => i + 1)}
      />
      
    </>
  );
};
export default AllCustomerTable;

