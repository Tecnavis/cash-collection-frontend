import React from 'react'
import Footer from '../components/footer/Footer'
import { Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AllAdminTable from '../components/tables/AllAdminTable'

const AllAdminMainContent = () => {
  return (
    <div className="main-content">
        <div className="row">
            <div className="col-12">
                <div className="panel">
                <div className="panel-header">
                    <h5>All admins</h5>
                    <div className="btn-box d-flex flex-wrap gap-2">
                        <div id="tableSearch">
                            <Form.Text placeholder='Search...'/>
                        </div>
                        <Link to="/addAdmin" className="btn btn-sm btn-primary"><i className="fa-light fa-plus"></i> Add New</Link>
                    </div>
                </div>
                    {/* <AllEmployeeHeader/> */}
                    <div className="panel-body">
                        <AllAdminTable/>
                        {/* <AllEmployeeTable/> */}
                    </div>
                </div>
            </div>
        </div>

        <Footer/>
    </div>
  )
}

export default AllAdminMainContent