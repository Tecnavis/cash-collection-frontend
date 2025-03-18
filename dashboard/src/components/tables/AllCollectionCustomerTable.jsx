import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";


const AllCollectionCustomerTable = () => {
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

  useEffect(() => {
    fetchCustomers(currentPage);
  }, [currentPage]);
  
  const fetchCustomers = async (page) => {
    try {
      const token = Cookies.get("access_token");
      const response = await axios.get(`${BASE_URL}/partner/customers/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const formattedCustomers = response.data.map((customer) => ({
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
      setDataList(formattedCustomers); // Update dataList to reflect changes
      setTotalPages(response.data.total_pages || 1);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Error fetching customers");
    } finally {
      setLoading(false);
    }
  };
  

  // const fetchCustomers = async (page) => {
  //   try {
  //     const token = Cookies.get("access_token");
  //     const response = await axios.get(`${BASE_URL}/partner/customers/`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const formattedCustomers = response.data.results.map((customer) => ({
  //       id: customer.id,
  //       first_name: customer.user.first_name,
  //       last_name: customer.user.last_name,
  //       email: customer.user.email,
  //       secondary_contact: customer.secondary_contact || "N/A",
  //       address: customer.address || "N/A",
  //       other_info: customer.other_info || "N/A",
  //       showDropdown: false, 
  //     }));
  
  //     setCustomers(formattedCustomers);
  //     setTotalPages(response.data.total_pages);
  //   } catch (error) {
  //     console.error("Error fetching customers:", error);
  //     setError("Error fetching customers");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
    const handleViewEmployee = async (id) => {
  if (!id) {
    console.error("Invalid employee ID:", id);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/partner/partner/${id}/`);
    if (!response.ok) {
      throw new Error("Failed to fetch employee details");
    }
    
    const data = await response.json();
    if (!data || !data.id) {
      throw new Error("Invalid data received");
    }
    setSelectedEmployee({ ...data, isEditing: false });
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
        try {
          const response = await fetch(`${BASE_URL}/partner/partners/${selectedEmployee.id}/`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Cookies.get("access_token")}`
            },
            body: JSON.stringify({
              username: selectedEmployee.username,
              email: selectedEmployee.email,
              contact_number: selectedEmployee.contact_number,
              secondary_contact: selectedEmployee.secondary_contact,
              company_name: selectedEmployee.company_name,
            }),
          });
      
          if (response.ok) {
            const updatedData = await response.json();
            console.log("Updated Employee:", updatedData);
            fetchStaffUsers(); 
            setShowModal(false); 
          } else {
            console.error("Error updating employee:", await response.json());
          }
        } catch (error) {
          console.error("Network error:", error);
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
      }
    };
  const handleDropdownToggle = (event, index) => {
    event.stopPropagation();
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer, i) => ({
        ...customer,
        showDropdown: i === index ? !customer.showDropdown : false,
      }))
    );
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
            <th>Action</th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Address</th>
            <th>Other Info</th>
          </tr>
        </thead>

        <tbody>
          {currentData.length > 0 ? (
            currentData.map((customer, index) => (
              <tr key={index}>
                <td>
                  <div className="digi-dropdown dropdown d-inline-block" ref={dropdownRef}>
                    <button className="btn btn-sm btn-outline-primary" onClick={(event) => handleDropdownToggle(event, index)}>
                      Action <i className="fa-regular fa-angle-down"></i>
                    </button>
                    <ul className={`dropdown-menu ${customer.showDropdown ? "show" : ""}`}>
                      <li>
                        <button className="dropdown-item" onClick={() => handleViewEmployee(customer.id)}>View</button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => handleOpenEditModal(customer)}>Update</button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => handleDeleteEmployee(customer.id)}>Delete</button>
                      </li>
                    </ul>
                  </div>
                </td>
                <td>{customer.id}</td>
                <td>{`${customer.first_name} ${customer.last_name}`}</td>
                <td>{customer.email}</td>
                <td>{customer.secondary_contact}</td>
                <td>{customer.address}</td>
                <td>{customer.other_info}</td>
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
                        {/* Profile ID (Assuming it's not editable) */}
                        <div className="mb-3">
                          <label className="form-label">Profile ID</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedEmployee.profile_id || ''}
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
                              setSelectedEmployee({ ...selectedEmployee, username: e.target.value })
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
                            value={selectedEmployee.contact_number || ''}
                            onChange={(e) =>
                              setSelectedEmployee({ ...selectedEmployee, contact_number: e.target.value })
                            }
                          />
                        </div>

                        {/* Address*/}
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

                        {/* Other Info */}
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
                <p><strong>Profile ID:</strong> {selectedEmployee.profile_id || "N/A"}</p>
                <p><strong> Other Info:</strong> {selectedEmployee.other_info || "N/A"}</p>
                <p><strong>Email:</strong> {selectedEmployee.email || "N/A"}</p>
                <p><strong>Name:</strong> {selectedEmployee.first_name} {selectedEmployee.last_name}</p>
                <p><strong>Phone:</strong> {selectedEmployee.contact_number || "N/A"}</p>
                <p><strong>Address:</strong> {selectedEmployee.address || "N/A"}</p>
                <p><strong>Partner Type:</strong> {selectedEmployee.partner_type || "N/A"}</p>
                <p><strong>Created At:</strong> {new Date(selectedEmployee.created_at).toLocaleString()}</p>
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
export default AllCollectionCustomerTable;
