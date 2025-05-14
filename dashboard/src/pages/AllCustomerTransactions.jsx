import React from 'react'
import Footer from '../components/footer/Footer'
import HeaderBtn from '../components/header/HeaderBtn'
import AllCustomerTransactionHeader from '../components/header/AllCustomerTransactionHeader'
import AllCustomerTransactionTable from '../components/tables/AllCustomerTransactionTable'

const AllCustomerTransactionMainContent = () => {
  return (
    <div className="main-content">
        <div className="row">
            <div className="col-12">
                <div className="panel">
                    {/* <AllCustomerTransactionHeader/> */}
                    <div className="panel-body">
                        <HeaderBtn/>
                        <AllCustomerTransactionTable/>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}
export default AllCustomerTransactionMainContent