import React, { useContext, useState, useEffect, useRef } from "react";
import PaginationSection from "./PaginationSection";
import { DigiContext } from "../../context/DigiContext";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";

const AllEmployeeTable = () => {
  const { isBelowLg } = useContext(DigiContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [dataList, setDataList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchStaffUsers();
  }, []);

  const fetchStaffUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/staffs/`, {
        headers: {
          "Authorization": `Bearer ${Cookies.get("access_token")}`,

        },
      });
      const result = await response.json();

      if (Array.isArray(result) && result.length > 0) {
        const staffUsers = result.filter((user) => user.role === "admin");
        setDataList(staffUsers);
      } else {
        setDataList([]);
      }
    } catch (error) {
      console.error("Error fetching staff users:", error);
      setDataList([]);
    }
  };

  const handleViewEmployee = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/users/users/${id}/`, {
        headers: {
          "Authorization": `Bearer ${Cookies.get("access_token")}`,
        },
      });
      const data = await response.json();
      setSelectedEmployee(data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };
  const handleOpenEditModal = (employee) => {
    setSelectedEmployee({ ...employee, isEditing: true });
    setShowModal(true);
  };
  const handleUpdateEmployee = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/staffs/${selectedEmployee.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("access_token")}`,
        },
        body: JSON.stringify({
          username: selectedEmployee.username,
          email: selectedEmployee.email,
          contact_number: selectedEmployee.contact_number,
        }),
      });

      if (response.ok) {
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
        const response = await fetch(`${BASE_URL}/users/staffs/${id}/delete/`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${Cookies.get("access_token")}`,
          },
        });

        if (response.ok) {
          setDataList((prev) => prev.filter((employee) => employee.id !== id));
          setShowModal(false);
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const filteredData = dataList.filter((data) =>
    data.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentData = filteredData.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredData.length / dataPerPage);

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          placeholder="Search by Name"
          className="form-control w-25"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((data) => (
              <tr key={data.id}>
                
                <td>{data.id}</td>
                <td>{data.username}</td>
                <td>{data.contact_number || "N/A"}</td>
                <td>{data.email}</td>
                <td>
                  <i
                    className="fa-light fa-eye text me-3 cursor-pointer"
                    style={{ fontSize: "18px" }}
                    onClick={() => handleViewEmployee(data.id)}
                  ></i>
                  <i
                    className="fa-light fa-pen-nib text me-3 cursor-pointer"
                    style={{ fontSize: "18px" }}
                    onClick={() => handleOpenEditModal(data)}
                  ></i>
                  <i
                    className="fa-light fa-trash-can text cursor-pointer"
                    style={{ fontSize: "18px" }}
                    onClick={() => handleDeleteEmployee(data.id)}
                  ></i>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}

      {/* Modals */}
      {showModal && selectedEmployee && !selectedEmployee.isEditing && (
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Employee Details</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>ID:</strong> {selectedEmployee.id}</p>
                <p><strong>Name:</strong> {selectedEmployee.username}</p>
                <p><strong>Email:</strong> {selectedEmployee.email}</p>
                <p><strong>Phone:</strong> {selectedEmployee.contact_number || "N/A"}</p>
                <p><strong>Role:</strong> {selectedEmployee.role || "N/A"}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && selectedEmployee?.isEditing && (
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Edit Employee</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={selectedEmployee.username}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, username: e.target.value })}
                />
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={selectedEmployee.email}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleUpdateEmployee}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllEmployeeTable;
