import React from 'react'
import Footer from '../components/footer/Footer'
import AllProductHeader from '../components/header/AllPurchaseHeader'
import AllProductTableFilter from '../components/filter/AllProductTableFilter'
import AllPurchaseTable from '../components/tables/AllPurchaseTable'
import HeaderBtn from '../components/header/HeaderBtn'

const AllPurchaseMainContent = () => {
  return (
    <div className="main-content">
        <div className="row g-4">
            <div className="col-12">
                <div className="panel">
                    <AllProductHeader/>
                    
                    <div className="panel-body">
                        <HeaderBtn/>
                        {/* <AllProductTableFilter/> */}
                        <AllPurchaseTable/>
                    </div>
                </div>
            </div>
        </div>

        <Footer/>
    </div>
  )
}

export default AllPurchaseMainContent