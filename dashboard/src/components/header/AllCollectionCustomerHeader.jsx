import React from 'react';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AllCollectionCustomerHeader = ({ onSearch }) => {
  return (
    <>
    <div className="panel-header">
      <h5>All Customers</h5>
      <div className="btn-box d-flex flex-wrap gap-3">
        <div id="tableSearch">
          <Form.Control
            type="text"
            placeholder="Search customers..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Link to="/supplier" className="btn btn-sm btn-primary">
          <i className="fa-light fa-plus"></i> Add New
        </Link>
      </div>
    </div>
    </>
  );
};

export default AllCollectionCustomerHeader;
