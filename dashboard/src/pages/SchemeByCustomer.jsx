import React from 'react'
import Footer from '../components/footer/Footer'
import AddNewCategory from '../components/category/AddNewCategory'
import AllCategory from '../components/category/AllCategory'
import AddCustomerScheme from '../components/category/AddCustomerSchema'
import AllCustomerSchemes from '../components/category/AllCustomerScheme'

const CategoryMainContent = () => {
  return (
    <div className="main-content">
        <div className="dashboard-breadcrumb dashboard-panel-header mb-30">
            <h2>Customer By Schemes</h2>
        </div>
        <div className="row g-4">
          <AddCustomerScheme/>
          <AllCustomerSchemes/>
        </div>

        <Footer/>
    </div>
  )
}

export default CategoryMainContent