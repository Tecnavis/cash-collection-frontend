import React from 'react'
import Footer from '../components/footer/Footer'
import AllCustomerHeader from '../components/header/AllCustomerHeader'
import AllCustomerTable from '../components/tables/AllCustomerTable'
import AllCollectionCustomerHeader from '../components/header/AllCollectionCustomerHeader'
import AllCollectionCustomerTable from '../components/tables/AllCollectionCustomerTable'

const AllCollectionCustomer = () => {
  return (
    <div className="main-content">
        <div className="row">
            <div className="col-12">
                <div className="panel">
                    <AllCollectionCustomerHeader/>
                    <div className="panel-body">
                        <AllCollectionCustomerTable/>                        
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}
export default AllCollectionCustomer