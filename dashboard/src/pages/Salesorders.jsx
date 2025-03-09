import React from 'react'
import Footer from '../components/footer/Footer'
// import OrderHeader from '../components/header/OrderHeader'
import SalesordersHeader from '../components/header/SalesorderHeader'
import OrderListTable from '../components/tables/OrderListTable'
import SalesorderTable from '../components/tables/Salesorder'

const Salesorders = () => {
  return (
    <div className="main-content">
        <div className="row g-4">
            <div className="col-12">
                <div className="panel">
                   <SalesordersHeader/>
                    <div className="panel-body">
                    <div className="product-table-quantity d-flex justify-content-between align-items-center mb-20">
        <ul className="mb-0">
            <li className="text-white">All (23)</li>
            <li>Delivered (9)</li>
            <li>Out for Delivery (05)</li>
            <li>Cancel (05)</li>
        </ul>
    </div>
                        <SalesorderTable/>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Salesorders