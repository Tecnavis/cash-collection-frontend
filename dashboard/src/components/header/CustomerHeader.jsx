import React, { useContext, useState } from 'react'
import { Form } from 'react-bootstrap'
import { DigiContext } from '../../context/DigiContext';

const CustomerHeader = () => {
    const { headerBtnOpen, handleHeaderBtn, handleHeaderReset,headerRef } = useContext(DigiContext);

    const [checkboxes, setCheckboxes] = useState({
        showAction: true,
        showCustomerId: true,
        showName: true,
        showPhone: true,
        showGroup: true,
        showCustomerType: true,
        showCreditLimit: true,
        showOpeningBalance: true,
        showDebit: true,
        showCredit: true,
        showClosingBalance: true,
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
        <h5>Purchased Items</h5>
        <div className="btn-box d-flex gap-2">
            <div id="tableSearch">
                <Form.Control type="text" placeholder="Search..." />
            </div>  
        </div>
    </div>
  )
}

export default CustomerHeader