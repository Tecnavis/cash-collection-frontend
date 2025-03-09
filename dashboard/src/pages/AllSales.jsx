import React from 'react'
import Footer from '../components/footer/Footer'
import AllSalesHeader from '../components/header/AllSalesHeader'
import AllProductTable from '../components/tables/AllProductTable'
import AllSalesTable from '../components/tables/AllSalesTable'
import HeaderBtn from '../components/header/HeaderBtn'

const AllSalesMainContent = () => {
  return (
    <div className="main-content">
        <div className="row g-4">
            <div className="col-12">
                <div className="panel">
                    <AllSalesHeader/>
                    <div className="panel-body">
                        <HeaderBtn/>
                        <AllSalesTable/>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
        
    </div>
  )
}
export default AllSalesMainContent