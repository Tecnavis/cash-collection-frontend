import React from 'react'
import Footer from '../components/footer/Footer'
import HeaderBtn from '../components/header/HeaderBtn'
import AllCollectionHeader from '../components/header/AllCollectionHeader'
import AllCollectionTable from '../components/tables/AllCollectionTable'

const AllCollectionMainContent = () => {
  return (
    <div className="main-content">
        <div className="row">
            <div className="col-12">
                <div className="panel">
                    {/* <AllCollectionHeader/> */}
                    <div className="panel-body">
                        <HeaderBtn/>
                        <AllCollectionTable/>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}
export default AllCollectionMainContent