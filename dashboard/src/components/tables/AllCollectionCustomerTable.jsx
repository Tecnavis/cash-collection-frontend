import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";
import AllCollectionCustomerHeader from "../header/AllCollectionCustomerHeader";


const AllCollectionCustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataPerPage] = useState(300);
  const [dataList, setDataList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null); 
  const [originalEmployee, setOriginalEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
        id:customer.id,
        profile_id: customer.profile_id,
        shop_name: customer.shop_name,
        first_name: customer.user.first_name,
        last_name: customer.user.last_name,
        email: customer.user.email,
        contact_number: customer.user.contact_number,
        secondary_contact: customer.secondary_contact || "N/A",
        address: customer.address || "N/A",
        other_info: customer.other_info || "N/A",
        showDropdown: false, 
      }));
  
      setCustomers(formattedCustomers);
      setDataList(formattedCustomers); 
      setTotalPages(response.data.total_pages || 1);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Error fetching customers");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setDataList(customers);
    } else {
      const filteredData = customers.filter((customer) =>
        `${customer.first_name} ${customer.last_name} ${customer.shop_name} ${customer.email} ${customer.profile_id} ${customer.contact_number}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      setDataList(filteredData);
    }
  };

  const handleViewEmployee = async (id) => {
    if (!id) {
      console.error("Invalid employee ID:", id);
      return;
    }
  
    setLoading(true);
  
    try {
      const token = Cookies.get("access_token");
      const response = await fetch(`${BASE_URL}/partner/customers/${id}/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch employee details: ${response.statusText}`);
      }
  
      const data = await response.json();
      if (!data || !data.id) {
        throw new Error("Invalid data received");
      }
  
      setSelectedEmployee({
        profile_id: data.profile_id || "N/A",
        shop_name: data.shop_name || "N/A",
        first_name: data.user.first_name || "N/A",
        last_name: data.user.last_name || "N/A",
        email: data.user.email || "N/A",
        contact_number: data.user.contact_number || "N/A",
        secondary_contact: data.secondary_contact || "N/A",
        address: data.address || "N/A",
        other_info: data.other_info || "N/A",
        isEditing: false, 
      });
  
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    } finally {
      setLoading(false);
    }
  };
  
    const handleOpenEditModal = (customer) => {
      setSelectedEmployee({ ...customer, isEditing: true });
      setOriginalEmployee({ ...customer });
      setShowModal(true);
  };

  const handleEditClick = (employee) => {
      setOriginalEmployee({ ...employee }); 
      setSelectedEmployee({ ...employee }); 
  };
  const handleUpdateEmployee = async () => {
      if (!selectedEmployee || !selectedEmployee.id) {
          return;
      }
      if (!originalEmployee) {
          return;
      }
      const userPayload = {
          first_name: selectedEmployee.first_name || "",
          last_name: selectedEmployee.last_name || "",
          contact_number: selectedEmployee.contact_number || ""
      };

      if (selectedEmployee.email !== originalEmployee.email) {
          userPayload.email = selectedEmployee.email || "";
      }
      try {
          const response = await fetch(`${BASE_URL}/partner/customers/${selectedEmployee.id}/update/`, {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${Cookies.get("access_token")}`
              },
              body: JSON.stringify({
                  profile_id: selectedEmployee.profile_id || selectedEmployee.id,
                  shop_name: selectedEmployee.shop_name || "",
                  secondary_contact: selectedEmployee.secondary_contact || "",
                  address: selectedEmployee.address || "",
                  other_info: selectedEmployee.other_info || "",
                  user: userPayload  
              }),
          });

          if (!response.ok) {
              const errorData = await response.json();
              const errorMessage = errorData.message || errorData.detail || "Unknown error";
              console.error("Error updating employee:", errorMessage);
              alert(`Failed to update employee: ${errorMessage}`);
              return;
          }
          const updatedData = await response.json();
          fetchCustomers(currentPage);
          setShowModal(false);

      } catch (error) {
          console.error("Network error:", error);
          alert("A network error occurred. Please try again later.");
      }
  };

    const handleDeleteEmployee = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
          try {
            const response = await fetch(`${BASE_URL}/partner/customers/${id}/delete/`, {
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
      <AllCollectionCustomerHeader onSearch={handleSearch} />
      <OverlayScrollbarsComponent>
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>Profile ID</th>
            <th>Shop Name</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Contact number</th>
            <th>Secondary contact number</th>
            <th>Other Info</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentData.length > 0 ? (
            currentData.map((customer, index) => (
              <tr key={index}>
                <td>{customer.profile_id}</td>
                <td>{customer.shop_name}</td>
                <td>{`${customer.first_name} ${customer.last_name}`}</td>
                <td>{customer.email}</td>
                <td>{customer.contact_number}</td>
                <td>{customer.secondary_contact}</td>
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
             
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Update Customer</h5>
                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                      </div>
                      <div className="modal-body">
                        <form>
                          {/* Profile ID */}
                          <div className="mb-3">
                            <label className="form-label">Profile ID</label>
                            <input
                              type="text"
                              className="form-control"
                              value={selectedEmployee.profile_id || ""}
                              onChange={(e) =>
                                setSelectedEmployee({ ...selectedEmployee, profile_id: e.target.value })
                              }
                            />
                          </div>
                          {/* Shop Name */}
                          <div className="mb-3">
                            <label className="form-label">Shop Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={selectedEmployee.shop_name || ""}
                              onChange={(e) =>
                                setSelectedEmployee({ ...selectedEmployee, shop_name: e.target.value })
                              }
                            />
                          </div>
                         
                          <div className="mb-3">
                            <label className="form-label">First Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={selectedEmployee.first_name || ""}
                              onChange={(e) =>
                                setSelectedEmployee({ ...selectedEmployee, first_name: e.target.value })
                              }
                            />
                          </div>
                      
                          <div className="mb-3">
                            <label className="form-label">Last Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={selectedEmployee.last_name || ""}
                              onChange={(e) =>
                                setSelectedEmployee({ ...selectedEmployee, last_name: e.target.value })
                              }
                            />
                          </div>
                         
                          <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              value={selectedEmployee.email || ""}
                              onChange={(e) =>
                                setSelectedEmployee({ ...selectedEmployee, email: e.target.value })
                              }
                            />
                          </div>
                         
                          <div className="mb-3">
                            <label className="form-label">Contact Number</label>
                            <input
                              type="text"
                              className="form-control"
                              value={selectedEmployee.contact_number || ""}
                              onChange={(e) =>
                                setSelectedEmployee({ ...selectedEmployee, contact_number: e.target.value })
                              }
                            />
                          </div>
                         
                          <div className="mb-3">
                            <label className="form-label">Address</label>
                            <input
                              type="text"
                              className="form-control"
                              value={selectedEmployee.address || ""}
                              onChange={(e) =>
                                setSelectedEmployee({ ...selectedEmployee, address: e.target.value })
                              }
                            />
                          </div>
                        
                          <div className="mb-3">
                            <label className="form-label">Other Info</label>
                            <input
                              type="text"
                              className="form-control"
                              value={selectedEmployee.other_info || ""}
                              onChange={(e) =>
                                setSelectedEmployee({ ...selectedEmployee, other_info: e.target.value })
                              }
                            />
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                          Close
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleUpdateEmployee}>
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>  
              ) : (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow-lg border-0 rounded">
                          <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title">Customer Details</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                          </div>
                          <div className="modal-body p-4 text-center">
                            <i className="fa-solid fa-user-circle fa-4x text-primary mb-3"></i>
                            <p><strong>Profile ID:</strong> {selectedEmployee?.profile_id || "N/A"}</p>
                            <p><strong>Shop Name:</strong> {selectedEmployee?.shop_name || "N/A"}</p>
                            <p><strong>Name:</strong> {selectedEmployee?.first_name || "N/A"} {selectedEmployee?.last_name || ""}</p>
                            <p><strong>Email:</strong> {selectedEmployee?.email || "N/A"}</p>
                            <p><strong>Primary Contact:</strong> {selectedEmployee?.contact_number || "N/A"}</p>
                            <p><strong>Secondary Contact:</strong> {selectedEmployee?.secondary_contact || "N/A"}</p>
                            <p><strong>Address:</strong> {selectedEmployee?.shop_name || "N/A"}</p>
                            <p><strong>Other Info:</strong> {selectedEmployee?.other_info || "N/A"}</p>
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
