import React, { useContext, useState } from 'react';
import { DigiContext } from '../../context/DigiContext';
import { Form } from 'react-bootstrap';

const TaskHeader = () => {
    const {handleShowAddNewTaskModal, headerBtnOpen, handleHeaderBtn, handleHeaderReset, headerRef} = useContext(DigiContext)


  return (
    <div className="panel-header">
      <h5>Task Summary</h5>
      <div className="btn-box d-flex flex-wrap gap-2">
        <div id="tableSearch">
        <Form.Control type="text" placeholder="Search..." />
        </div>
        
        <button className="btn btn-sm btn-primary" onClick={handleShowAddNewTaskModal} data-bs-toggle="modal" data-bs-target="#addTaskModal">
          <i className="fa-light fa-plus"></i> Add New
        </button>
      </div>
    </div>
  );
};

export default TaskHeader;
