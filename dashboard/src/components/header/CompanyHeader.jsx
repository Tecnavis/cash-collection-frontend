import React, { useContext, useState } from 'react';
import { DigiContext } from '../../context/DigiContext';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom'


const CompanyHeader = () => {
  const { headerBtnOpen, handleHeaderBtn, handleHeaderReset, headerRef } = useContext(DigiContext);
  const [checkboxes, setCheckboxes] = useState({
    showCompany: true,
    showAddress: true,
    showEmail: true,
    showPhone: true,
    showContactPerson: true,
    showStatus: true,
  });

  const handleChange = (e) => {
    const { id } = e.target;
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [id]: !prevCheckboxes[id],
    }));
  };

  return (
    <div className="panel-header">
      <h5>All Vendors</h5>
      <div className="btn-box d-flex gap-2">
        <div id="tableSearch">
          <Form.Control type="text" placeholder="Search..."/>
        </div>
      <Link to="/addPartner" className="btn btn-sm btn-primary"><i className="fa-light fa-plus"></i> Add New</Link>
      </div>
    </div>
  );
};

export default CompanyHeader;
