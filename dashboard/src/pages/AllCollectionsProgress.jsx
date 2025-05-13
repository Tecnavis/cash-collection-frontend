import React from 'react'
import Footer from '../components/footer/Footer'
import HeaderBtn from '../components/header/HeaderBtn'
import AllCollectionProgressHeader from '../components/header/AllCollecionProgressHeader'
import AllCollectionProgressTable from '../components/tables/AllCollectionProgressTable'


const AllCollectionProgressMainContent = () => {
  return (
    <div className="main-content">
        <div className="row g-4">
            <div className="col-12">
                <div className="panel">
                    {/* <AllCollectionProgressHeader/> */}
                    <div className="panel-body">
                        <HeaderBtn/>
                        <AllCollectionProgressTable/>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}
export default AllCollectionProgressMainContent