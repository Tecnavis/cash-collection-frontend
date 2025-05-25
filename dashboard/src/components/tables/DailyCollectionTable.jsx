import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { BASE_URL } from "../../api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const DailyCollectionTable = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataPerPage] = useState(10);
  const [dataList, setDataList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [runningTotal, setRunningTotal] = useState(0);

  useEffect(() => {
    fetchCollections();
  }, [currentPage]);

  const fetchCollections = async () => {
    try {
      const token = Cookies.get("access_token");
      const response = await axios.get(`${BASE_URL}/cashcollection/collections/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Calculate running total for each entry
      let total = 0;
      const formattedCollections = response.data.map((entry, index) => {
        // Update the running total based on credit/debit
        if (entry.type === "credit") {
          total += parseFloat(entry.amount);
        } else {
          total -= parseFloat(entry.amount);
        }
        
        return {
          ...entry,
          serialNo: index + 1,
          runningTotal: total.toFixed(2)
        };
      });

      setCollections(formattedCollections);
      setDataList(formattedCollections);
      setRunningTotal(total);
      
      // Assuming pagination info comes from the backend
      if (response.data.length > 0) {
        setTotalPages(Math.ceil(response.data.length / dataPerPage));
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
      setError("Error fetching collection data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setDataList(collections);
    } else {
      const filteredData = collections.filter((entry) =>
        `${entry.date} ${entry.narration} ${entry.amount}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      setDataList(filteredData);
    }
  };

  const handleViewEntry = (entry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  const handleEditEntry = (entry) => {
    setSelectedEntry({ ...entry, isEditing: true });
    setShowModal(true);
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        const token = Cookies.get("access_token");
        await axios.delete(`${BASE_URL}/cashcollection/collections/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Refresh collection list after deletion
        fetchCollections();
      } catch (error) {
        console.error("Error deleting collection entry:", error);
        alert("Failed to delete entry. Please try again.");
      }
    }
  };

  const handleUpdateEntry = async () => {
    if (!selectedEntry) return;
    
    try {
      const token = Cookies.get("access_token");
      await axios.patch(
        `${BASE_URL}/cashcollection/collections/${selectedEntry.id}/`,
        {
          type: selectedEntry.type,
          date: selectedEntry.date,
          amount: selectedEntry.amount,
          narration: selectedEntry.narration,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setShowModal(false);
      fetchCollections();
    } catch (error) {
      console.error("Error updating collection entry:", error);
      alert("Failed to update entry. Please try again.");
    }
  };

  const handleAddNew = () => {
    navigate("/addDailyCollection");
  };

  // Get current data based on pagination
  const currentData = dataList.slice(
    (currentPage - 1) * dataPerPage,
    currentPage * dataPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <p>Loading collections...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Daily Collections</h4>
        <button className="btn btn-primary" onClick={handleAddNew}>
          Add New Collection
        </button>
      </div>
      
      <OverlayScrollbarsComponent>
        <Table striped bordered hover>
          <thead>
            <tr className="bg-light">
              <th>Serial No</th>
              <th>Date</th>
              <th>Credit</th>
              <th>Debit</th>
              <th>Narration</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.serialNo}</td>
                  <td>{new Date(entry.date).toLocaleDateString()}</td>
                  <td>{entry.type === "credit" ? `₹${parseFloat(entry.amount).toFixed(2)}` : ""}</td>
                  <td>{entry.type === "debit" ? `₹${parseFloat(entry.amount).toFixed(2)}` : ""}</td>
                  <td>{entry.narration}</td>
                  <td>₹{entry.runningTotal}</td>
                  <td>
                    <i
                      className="fa-light fa-eye text me-3 cursor-pointer"
                      style={{ fontSize: "18px" }}
                      onClick={() => handleViewEntry(entry)}
                    ></i>
                    <i
                      className="fa-light fa-pen-nib text me-3 cursor-pointer"
                      style={{ fontSize: "18px" }}
                      onClick={() => handleEditEntry(entry)}
                    ></i>
                    <i
                      className="fa-light fa-trash-can text cursor-pointer"
                      style={{ fontSize: "18px" }}
                      onClick={() => handleDeleteEntry(entry.id)}
                    ></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No collection entries found</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="fw-bold">
              <td colSpan="5" className="text-end">Current Balance:</td>
              <td colSpan="2">₹{parseFloat(runningTotal).toFixed(2)}</td>
            </tr>
          </tfoot>
        </Table>
      </OverlayScrollbarsComponent>

      {showModal && selectedEntry && (
        selectedEntry.isEditing ? (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Update Collection Entry</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Type</label>
                      <div>
                        <div className="form-check form-check-inline">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="editCreditRadio"
                            name="type"
                            value="credit"
                            checked={selectedEntry.type === "credit"}
                            onChange={(e) =>
                              setSelectedEntry({ ...selectedEntry, type: e.target.value })
                            }
                          />
                          <label className="form-check-label" htmlFor="editCreditRadio">
                            Credit
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="editDebitRadio"
                            name="type"
                            value="debit"
                            checked={selectedEntry.type === "debit"}
                            onChange={(e) =>
                              setSelectedEntry({ ...selectedEntry, type: e.target.value })
                            }
                          />
                          <label className="form-check-label" htmlFor="editDebitRadio">
                            Debit
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={selectedEntry.date}
                        onChange={(e) =>
                          setSelectedEntry({ ...selectedEntry, date: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        value={selectedEntry.amount}
                        onChange={(e) =>
                          setSelectedEntry({ ...selectedEntry, amount: e.target.value })
                        }
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Narration</label>
                      <textarea
                        className="form-control"
                        value={selectedEntry.narration || ""}
                        onChange={(e) =>
                          setSelectedEntry({ ...selectedEntry, narration: e.target.value })
                        }
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleUpdateEntry}
                  >
                    Save changes
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
                  <h5 className="modal-title">Collection Entry Details</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="text-center mb-3">
                    <span className={`badge ${selectedEntry.type === "credit" ? "bg-success" : "bg-danger"} p-2 fs-6`}>
                      {selectedEntry.type === "credit" ? "Credit" : "Debit"}
                    </span>
                  </div>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <th>Serial No:</th>
                        <td>{selectedEntry.serialNo}</td>
                      </tr>
                      <tr>
                        <th>Date:</th>
                        <td>{new Date(selectedEntry.date).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <th>Amount:</th>
                        <td>₹{parseFloat(selectedEntry.amount).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <th>Running Total:</th>
                        <td>₹{selectedEntry.runningTotal}</td>
                      </tr>
                      <tr>
                        <th>Narration:</th>
                        <td>{selectedEntry.narration || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer justify-content-center">
                  <button
                    type="button"
                    className="btn btn-danger px-4"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
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

export default DailyCollectionTable;
