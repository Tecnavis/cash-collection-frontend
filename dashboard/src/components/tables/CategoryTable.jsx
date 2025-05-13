import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Form } from 'react-bootstrap';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from './PaginationSection';
import axios from 'axios';
import { BASE_URL } from "../../api";

const CategoryTable = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10);

    // States for modals
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [editedCategory, setEditedCategory] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

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

    // Open edit modal
    const handleEdit = (category) => {
        setSelectedCategory(category);
        setEditedCategory({ name: category.name, description: category.description });
        setShowEditModal(true);
    };

    // Open delete modal
    const handleDelete = (category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    // Handle category update
    const updateCategory = async () => {
        try {
            await axios.put(
                `${BASE_URL}/services/categories/${selectedCategory.id}/update/`,
                editedCategory
              );
            fetchCategories(); // Refresh data
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    // Handle category deletion
    const deleteCategory = async () => {
        try {
            await axios.delete(
                `${BASE_URL}/services/categories/${selectedCategory.id}/delete/`
              );
            fetchCategories(); // Refresh data
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    // Pagination logic
    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const currentData = categories.slice(indexOfFirstData, indexOfLastData);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(categories.length / dataPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <>
            <OverlayScrollbarsComponent>
                <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped">
                    <thead>
                        <tr>
                            {/* <th>
                                <input className="form-check-input" type="checkbox" id="markAllProduct" />
                            </th> */}
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4">Loading...</td></tr>
                        ) : error ? (
                            <tr><td colSpan="4" className="text-danger">{error}</td></tr>
                        ) : (
                            currentData.map((category) => (
                                <tr key={category.id}>
                                    {/* <td>
                                        <input className="form-check-input" type="checkbox" />
                                    </td> */}
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
                                    <td>{category.description}</td>
                                    <td>
                                    <div className="btn-box">
                                        
                                    <button onC onClick={() => handleEdit(category)}><i className="fa-light fa-pen-to-square"></i></button>
                                    <button onClick={() => handleDelete(category)}><i className="fa-light fa-trash"></i></button>
                                    
                                    </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </OverlayScrollbarsComponent>
            <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={paginate} pageNumbers={pageNumbers} />

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedCategory.name}
                                onChange={(e) => setEditedCategory({ ...editedCategory, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={editedCategory.description}
                                onChange={(e) => setEditedCategory({ ...editedCategory, description: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={updateCategory}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this category?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={deleteCategory}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CategoryTable;
