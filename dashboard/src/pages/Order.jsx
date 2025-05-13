import React from 'react'
import Footer from '../components/footer/Footer'
import OrderHeader from '../components/header/OrderHeader'
import HeaderBtn from '../components/header/HeaderBtn'
import OrderListTable from '../components/tables/OrderListTable'

const OrderMainContent = () => {
  return (
    <div className="main-content">
        <div className="row g-4">
            <div className="col-12">
                <div className="panel">
                   <OrderHeader/>
                    <div className="panel-body">
                        <HeaderBtn/>
                        <OrderListTable/>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default OrderMainContent