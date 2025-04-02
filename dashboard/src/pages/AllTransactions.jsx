import React from 'react'
import Footer from '../components/footer/Footer'
import HeaderBtn from '../components/header/HeaderBtn'
import AllTransactionTable from '../components/tables/AllTransactionTable'
import AllTransactionsHeader from '../components/header/AllTransactionHeader'

const AllTransactionMainContent = () => {
  return (
    <div className="main-content">
        <div className="row g-4">
            <div className="col-12">
                <div className="panel">
                    {/* <AllTransactionsHeader/> */}
                    <div className="panel-body">
                        <HeaderBtn/>
                        <AllTransactionTable/>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}
export default AllTransactionMainContent
