import React from 'react';
import { Form } from 'react-bootstrap';

const SalesordersHeader = () => {
  return (
    <div className="panel-header">
    <h5>All Sales Order Management</h5>
    <div className="btn-box d-flex gap-2">
        <div id="tableSearch">
            <Form.Control type='text' placeholder='Seach...'/>
        </div>
    </div>
</div>
  )
}

export default SalesordersHeader