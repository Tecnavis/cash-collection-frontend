import React from 'react'
import Footer from '../components/footer/Footer'
import AllEmployeeHeader from '../components/header/AllEmployeeHeader'
import AllEmployeeTable from '../components/tables/AllEmployeeTable'

const AllEmployeeMainContent = () => {
  return (
    <div className="main-content">
        <div className="row">
            <div className="col-12">
                <div className="panel">
                    <AllEmployeeHeader/>
                    <div className="panel-body">
                        <AllEmployeeTable/>
                    </div>
                </div>
            </div>
        </div>

        <Footer/>
    </div>
  )
}

export default AllEmployeeMainContent