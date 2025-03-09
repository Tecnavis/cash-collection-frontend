import React, { useContext, useState } from 'react'
import CategoryTable from '../tables/CategoryTable'
import { DigiContext } from '../../context/DigiContext';
import { Form } from 'react-bootstrap';

const AllCategory = () => {
    const { headerBtnOpen, handleHeaderBtn, handleHeaderReset, headerRef } = useContext(DigiContext);
    const [checkboxes, setCheckboxes] = useState({
        showName: true,
        showDesc: true,
        showSlug: true,
        showCount: true,
        showAction: true,     
      });
    
      const handleChange = (e) => {
        const { id } = e.target;
        setCheckboxes((prevCheckboxes) => ({
          ...prevCheckboxes,
          [id]: !prevCheckboxes[id],
        }));
      };
  return (
    <div className="col-xxl-8 col-md-7">
            <div className="panel">
                <div className="panel-header">
                    <h5>All Categories</h5>
                    <div className="btn-box d-flex gap-2">
                        <div id="tableSearch">
                            <Form.Control type='text' placeholder='Search...'/>
                        </div>
                    </div>
                </div>
                <div className="panel-body">
                    <div className="table-filter-option">
                        <div className="row justify-content-between g-3">
                      
                            <div className="col-xl-2 col-3 col-xs-12 d-flex justify-content-end">
                                <div id="productTableLength"></div>
                            </div>
                        </div>
                    </div>
                    <CategoryTable/>
                </div>
            </div>
        </div>
  )
}

export default AllCategory