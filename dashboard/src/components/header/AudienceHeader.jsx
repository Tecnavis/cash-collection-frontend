import React, { useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import { DigiContext } from '../../context/DigiContext';

const AudienceHeader = () => {
 
  return (
    <div className="panel-header">
      <h5>Return Products</h5>
      <div className="btn-box d-flex gap-2">
        <div id="tableSearch">
          <Form.Control type="text" placeholder="Search..."/>
        </div>
      </div>
    </div>
  );
};

export default AudienceHeader;
