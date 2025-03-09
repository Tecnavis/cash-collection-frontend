import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from './PaginationSection';
import { BASE_URL } from "../../api";

const AllProductTable = ({ categoryId }) => {
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const dataPerPage = 10;
    const [selectedService, setSelectedService] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchServices();
        fetchCategories();
    }, [categoryId]);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/services/services`);
            setServices(response.data);
        } catch (err) {
            setError('Failed to fetch services');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/services/categories/`);
            setCategories(response.data);
        } catch (error) {
            setError('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (service) => {
        setSelectedService(service);
        setShowEditModal(true);
    };

    const handleDelete = (service) => {
        setSelectedService(service);
        setShowDeleteModal(true);
    };

    const updateService = async (serviceData, setMessage, handleClose) => {
        try {
            if (!serviceData.id || !serviceData.category_id) return;

            const response = await axios.put(
                `${BASE_URL}/services/categories/${serviceData.category_id}/services/${serviceData.id}/update/`,
                serviceData
            );

            if (response.status === 200) {
                setMessage({ type: "success", text: "Service updated successfully" });
                if (typeof handleClose === "function") {
                    handleClose();
                    fetchServices(); // Refresh services
                }
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to update service" });
        }
    };

    const deleteService = async () => {
        if (!selectedService) {
            alert("No service selected for deletion.");
            return;
        }
    
        try {
            await axios.delete(`${BASE_URL}/services/services/${selectedService.id}/delete/`);
            fetchServices(); // Refresh the service list after deletion
            setShowDeleteModal(false); // Close the delete modal
        } catch (error) {
            console.error("Error deleting service:", error);
            alert("Failed to delete service");
        }
    };
    
    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const currentData = services.slice(indexOfFirstData, indexOfLastData);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(services.length / dataPerPage);
    const pageNumbers = [...Array(totalPages).keys()].map(i => i + 1);

    return (
        <>
            <OverlayScrollbarsComponent>
                {loading && <Spinner animation="border" variant="primary" />}
                {error && <Alert variant="danger">{error}</Alert>}
                {!loading && !error && (
                    <Table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Vat type</th>
                                <th>Vat amount</th>
                                <th>total price</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((service) => (
                                <tr key={service.id}>
                                    <td>{service.id}</td>
                                    <td>{service.name}</td>
                                    <td>{service.description}</td>
                                    <td>{service.category_name}</td>
                                    <td>{service.price}</td>
                                    <td>{service.vat_type}</td>
                                    <td>{service.vat_amount}</td>
                                    <td>{service.total_price}</td>
                                    <td>{service.is_active ? "Active" : "Inactive"}</td>
                                    <td>
                                        {/* <div className="btn-box"> */}
                                        <td style={{ display: "flex",alignItems: "center" }}>
                                            <button className="btn btn-sm " onClick={() => handleEdit(service)}>
                                                <i className="fa-light fa-pen-to-square"></i>
                                            </button>
                                            <button className="btn btn-sm " onClick={() => handleDelete(service)}>
                                                <i className="fa-light fa-trash"></i>
                                            </button>
                                        </td>
                                        {/* </div> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </OverlayScrollbarsComponent>
            <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={paginate} pageNumbers={pageNumbers} />

            {selectedService && (
                <EditServiceModal
                    show={showEditModal}
                    handleClose={() => setShowEditModal(false)}
                    service={selectedService}
                    updateService={updateService}
                    fetchServices={fetchServices} // Pass fetchServices
                />
            )}

            {selectedService && (
                <DeleteServiceModal
                    show={showDeleteModal}
                    handleClose={() => setShowDeleteModal(false)}
                    handleDelete={deleteService}
                    service={selectedService}
                />
            )}
        </>
    );
};

const EditServiceModal = ({ show, handleClose, service, updateService, fetchServices }) => {
    const [formData, setFormData] = useState({ ...service });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (show) {
            fetchCategories();
            if (service) {
                setFormData({ ...service });
                setMessage(null);
            }
        }
    }, [show, service]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/services/categories/`);
            if (Array.isArray(response.data)) {
                setCategories(response.data);
            } else if (response.data.categories && Array.isArray(response.data.categories)) {
                setCategories(response.data.categories);
            } else {
                throw new Error("Unexpected API response format");
            }
        } catch (error) {
            setError("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            await updateService(formData, setMessage, handleClose);
            if (message && message.type === "success") {
                fetchServices();
                handleClose();
            }
        } catch (err) {
            setMessage({ type: "error", text: "Failed to update service" });
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Service</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message && (
                    <Alert variant={message.type === "success" ? "success" : "danger"}>
                        {message.text}
                    </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Category</Form.Label>
                        {loading ? (<p>Loading categories...</p>

                        ) : error ? (
                            <p style={{ color: "red" }}>{error}</p>
                        ) : (
                            <Form.Control as="select" name="category_id" value={formData.category_id || ""} onChange={handleChange} required>
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Control>
                        )}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
                    </Form.Group>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Changes</Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

const DeleteServiceModal = ({ show, handleClose, handleDelete, service }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete the service <strong>{service.name}</strong>?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AllProductTable;