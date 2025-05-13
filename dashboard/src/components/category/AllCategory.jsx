import React, { useContext, useState, useEffect } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from '../../api';
import { DigiContext } from '../../context/DigiContext';
import Cookies from 'js-cookie';

const AllSchemes = () => {
    const [schemes, setSchemes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedScheme, setSelectedScheme] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const [checkboxes, setCheckboxes] = useState({
        showSchemeNumber: true,
        showName: true,
        showTotalAmount: true,
        showCollectionFrequency: true,
        showInstallmentAmount: true,
        showStartDate: true,
        showEndDate: true,
        showAction: true,
    });

    useEffect(() => {
        fetchSchemes();
    }, []);

    const fetchSchemes = async () => {
        try {
            const token = Cookies.get("access_token");  
            const response = await axios.get(`${BASE_URL}/cashcollection/schemes/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            setSchemes(response.data);
        } catch (error) {
            console.error("Error fetching schemes:", error);
        }
    };
    
    const handleEdit = (scheme) => {
        setSelectedScheme(scheme);
        setShowEditModal(true);
    };

    const handleDelete = (scheme) => {
        setSelectedScheme(scheme);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const token = Cookies.get("access_token");  
            await axios.delete(`${BASE_URL}/cashcollection/schemes/${selectedScheme.id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowDeleteModal(false);
            fetchSchemes();
        } catch (error) {
            console.error("Error deleting scheme:", error);
        }
    };

    const handleSaveEdit = async () => {
        try {
            const token = Cookies.get("access_token");  
            await axios.put(`${BASE_URL}/cashcollection/schemes/${selectedScheme.id}/`, selectedScheme, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
            });
            setShowEditModal(false);
            fetchSchemes();
        } catch (error) {
            console.error("Error updating scheme:", error);
        }
    };

    const handleChange = (e) => {
        const { id } = e.target;
        setCheckboxes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredSchemes = schemes.filter(scheme => 
        scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.scheme_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="col-xxl-8 col-md-7">
            <div className="panel">
                

                {/* <div className="panel-body"> */}
                    <div className="table-filter-option mb-3">
                        <div className="row g-3">
                            <div className="col-12 d-flex gap-2 flex-wrap">
                                {Object.keys(checkboxes).map(key => (
                                    <Form.Check 
                                        key={key}
                                        type="checkbox"
                                        id={key}
                                        label={key.replace('show', '').replace(/([A-Z])/g, ' $1')}
                                        checked={checkboxes[key]}
                                        onChange={handleChange}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                <div className="panel-body">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    {checkboxes.showSchemeNumber && <th>Number</th>}
                                    {checkboxes.showName && <th>Name</th>}
                                    {checkboxes.showTotalAmount && <th>Total Amount</th>}
                                    {checkboxes.showCollectionFrequency && <th>Collection Frequency</th>}
                                    {checkboxes.showInstallmentAmount && <th>Installment Amount</th>}
                                    {checkboxes.showStartDate && <th>Start Date</th>}
                                    {checkboxes.showEndDate && <th>End Date</th>}
                                    {checkboxes.showAction && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {schemes.map((scheme) => (
                                    <tr key={scheme.id}>
                                        {checkboxes.showSchemeNumber && <td>{scheme.scheme_number}</td>}
                                        {checkboxes.showName && <td>{scheme.name}</td>}
                                        {checkboxes.showTotalAmount && <td>{scheme.total_amount}</td>}
                                        {checkboxes.showCollectionFrequency && <td>{scheme.collection_frequency}</td>}
                                        {checkboxes.showInstallmentAmount && <td>{scheme.installment_amount || '-'}</td>}
                                        {checkboxes.showStartDate && <td>{scheme.start_date}</td>}
                                        {checkboxes.showEndDate && <td>{scheme.end_date}</td>}
                                        {checkboxes.showAction && (
                                            <td>
                                                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(scheme)}>Edit</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(scheme)}>Delete</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Scheme</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Scheme Number</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={selectedScheme?.scheme_number || ''} 
                                onChange={(e) => setSelectedScheme({ ...selectedScheme, scheme_number: e.target.value })} 
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={selectedScheme?.name || ''} 
                                onChange={(e) => setSelectedScheme({ ...selectedScheme, name: e.target.value })} 
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Total Amount</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={selectedScheme?.total_amount || ''} 
                                onChange={(e) => setSelectedScheme({ ...selectedScheme, total_amount: e.target.value })} 
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Collection Frequency</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={selectedScheme?.collection_frequency || ''} 
                                onChange={(e) => setSelectedScheme({ ...selectedScheme, collection_frequency: e.target.value })} 
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Installment Amount</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={selectedScheme?.installment_amount || ''} 
                                onChange={(e) => setSelectedScheme({ ...selectedScheme, installment_amount: e.target.value })} 
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={selectedScheme?.start_date || ''} 
                                onChange={(e) => setSelectedScheme({ ...selectedScheme, start_date: e.target.value })} 
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>End Date</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={selectedScheme?.end_date || ''} 
                                onChange={(e) => setSelectedScheme({ ...selectedScheme, end_date: e.target.value })} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSaveEdit}>Save</Button>
                </Modal.Footer>
            </Modal>
            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete {selectedScheme?.name}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AllSchemes;
