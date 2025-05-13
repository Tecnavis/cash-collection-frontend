import React, { useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import { DigiContext } from '../../context/DigiContext';
import { Link } from 'react-router-dom';

const AllStockListHeader = () => {
    const { headerBtnOpen, handleHeaderBtn, handleHeaderReset, headerRef } = useContext(DigiContext);

    const [checkboxes, setCheckboxes] = useState({
        showProducts: true,
        showPublished: true,
        showStock: true,
        showPrice: true,
        showSales: true,
        showRating: true,      
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
        <h5>Stock Lists</h5>
        <div className="btn-box d-flex flex-wrap gap-2">
            <div id="tableSearch">
                <Form.Control type='text' placeholder='Seach...'/>
            </div>
            <div className="btn-box">
                <Link to="/addNewProduct" className="btn btn-sm btn-primary"><i className="fa-light fa-plus"></i> Add New</Link>
            </div>
        </div>
    </div>
  )
}

export default AllStockListHeader