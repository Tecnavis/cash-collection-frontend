import React, { useContext, useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from '../../api';
import { DigiContext } from '../../context/DigiContext';
import Cookies from 'js-cookie';

const AllCustomerSchemes = () => {
    const { headerBtnOpen, handleHeaderBtn, handleHeaderReset, headerRef } = useContext(DigiContext);
    const [schemes, setSchemes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedScheme, setSelectedScheme] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    useEffect(() => {
        fetchSchemes();
    }, []);

    const fetchSchemes = async () => {
        try {
            const token = Cookies.get("access_token");
            const response = await axios.get(`${BASE_URL}/cashcollection/cashcollections/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            setSchemes([...response.data]);
        } catch (error) {
            console.error("Error fetching schemes:", error);
            setSchemes([]);
        }
    };

    const handleSearch = (e) => setSearchTerm(e.target.value);

    const handleEditClick = (scheme) => {
        setSelectedScheme(scheme);
        setShowEditModal(true);
    };

    const handleDeleteClick = (scheme) => {
        setSelectedScheme(scheme);
        setShowDeleteModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedScheme({ ...selectedScheme, [name]: value });
    };

    const handleEditSubmit = async () => {
        try {
            const token = Cookies.get("access_token");
            await axios.put(`${BASE_URL}/cashcollection/cashcollections/${selectedScheme.id}/`, selectedScheme, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            fetchSchemes();
            setShowEditModal(false);
        } catch (error) {
            console.error("Error updating scheme:", error);
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            const token = Cookies.get("access_token");
            await axios.delete(`${BASE_URL}/cashcollection/cashcollections/${selectedScheme.id}/delete/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            fetchSchemes();
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error deleting scheme:", error);
        }
    };

    const filteredSchemes = schemes?.filter(scheme => 
        typeof scheme?.scheme_name === "string" && scheme.scheme_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="col-xxl-8 col-md-7">
            <div className="panel">
                <div className="panel-header d-flex justify-content-between align-items-center">
                    <h5>All Schemes</h5>
                    <div className="btn-box d-flex gap-2">
                        <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
                    </div>
                </div>
                <div className="panel-body">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Scheme</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Customer</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSchemes.length > 0 ? (
                                    filteredSchemes.map((scheme) => (
                                        <tr key={scheme.id}>
                                            <td>{scheme?.scheme_name || '-'}</td>
                                            <td>{scheme?.start_date || '-'}</td>
                                            <td>{scheme?.end_date || '-'}</td>
                                            <td>{scheme?.customer_name || '-'}</td>
                                            <td>
                                                <Button variant="danger" size="sm" onClick={() => handleDeleteClick(scheme)}>Delete</Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">No schemes found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Scheme</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete <strong>{selectedScheme?.scheme_name}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteSubmit}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AllCustomerSchemes;
