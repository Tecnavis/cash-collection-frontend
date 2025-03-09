import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { BASE_URL } from "../../api";

const AddNewCategory = () => {
    const [categoryData, setCategoryData] = useState({
        name: '',
        description: '',
        is_active: true
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [showThumbnail, setShowThumbnail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle thumbnail upload
    const onDropSingle = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setThumbnail(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onDropSingle,
        accept: 'image/*',
        maxFiles: 1
    });

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const formData = new FormData();
            formData.append('name', categoryData.name);
            formData.append('description', categoryData.description);
            formData.append('is_active', categoryData.is_active);
            if (thumbnail) {
                formData.append('thumbnail', thumbnail);
            }
            const response = await axios.post(
                `${BASE_URL}/services/categories/create/`, 
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            setSuccess(true);
            setCategoryData({ name: '', description: '', is_active: true });
            setThumbnail(null);
        } catch (err) {
            setError('Failed to create category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="col-xxl-4 col-md-5">
            <div className="panel">
                <div className="panel-header">
                    <h5>Add New Category</h5>
                </div>
                <div className="panel-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label">Category Name</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-sm"
                                    name="name"
                                    value={categoryData.name}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Description</label>
                                <textarea 
                                    rows="5" 
                                    className="form-control form-control-sm"
                                    name="description"
                                    value={categoryData.description}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            {/* <div className="col-12">
                                <div className="upload-category-thumbnail">
                                    <label className="form-label mb-0" role='button' onClick={() => setShowThumbnail(!showThumbnail)}>
                                        Add Category Thumbnail
                                    </label>
                                    <div {...getRootProps()} className={`${showThumbnail ? '' : 'd-none'}`}>
                                        <input {...getInputProps()} />
                                        <div className="jquery-uploader">
                                            <div className="jquery-uploader-preview-container">
                                                <div className="jquery-uploader-select-card">
                                                    <div className="jquery-uploader-select">
                                                        <div className="upload-button">
                                                            <i className="fa fa-plus"></i><br />
                                                            <a>Upload</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {thumbnail && <p>{thumbnail.name}</p>}
                                    </div>
                                </div>
                            </div> */}
                            <div className="col-12 d-flex justify-content-end">
                                <button className="btn btn-sm btn-primary" type="submit" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Category'}
                                </button>
                            </div>
                        </div>
                    </form>
                    {error && <p className="text-danger mt-2">{error}</p>}
                    {success && <p className="text-success mt-2">Category added successfully!</p>}
                </div>
            </div>
        </div>
    );
};

export default AddNewCategory;

