import React, { useContext, useState } from 'react'
import { Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const AllCollectionCustomerHeader = () => {
    
  return (
      <div className="panel-header">
          <h5>All Customer</h5>
          <div className="btn-box d-flex flex-wrap gap-2">
              <div id="tableSearch">
                  <Form.Text placeholder='Search...'/>
              </div>
              <Link to="/supplier" className="btn btn-sm btn-primary"><i className="fa-light fa-plus"></i> Add New</Link>
          </div>
      </div>
    )
  }

export default AllCollectionCustomerHeader