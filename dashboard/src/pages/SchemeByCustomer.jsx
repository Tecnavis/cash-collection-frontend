// import React from 'react'
// import Footer from '../components/footer/Footer'
// import AddNewCategory from '../components/category/AddNewCategory'
// import AllCategory from '../components/category/AllCategory'
// import AddCustomerScheme from '../components/category/AddCustomerSchema'
// import AllCustomerSchemes from '../components/category/AllCustomerScheme'

// const CategoryMainContent = () => {
//   return (
//     <div className="main-content">
//         <div className="dashboard-breadcrumb dashboard-panel-header mb-30">
//             <h2>Customer By Schemes</h2>
//         </div>
//         <div className="row g-4">
//           <AddCustomerScheme/>
//           <AllCustomerSchemes/>
//         </div>

//         <Footer/>
//     </div>
//   )
// }

// export default CategoryMainContent
import React, { useState } from 'react';
import Footer from '../components/footer/Footer';
import AddCustomerScheme from '../components/category/AddCustomerSchema';
import AllCustomerSchemes from '../components/category/AllCustomerScheme';

const CategoryMainContent = () => {
    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <div className="main-content">
            <div className="dashboard-breadcrumb dashboard-panel-header mb-30 d-flex justify-content-between align-items-center">
                <h2>Customer By Schemes</h2>

                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? "View All Schemes" : "Add New Cash Collection"}
                </button>
            </div>

            <div className="row g-4">
                {showAddForm ? (
                    <AddCustomerScheme onSuccess={() => setShowAddForm(false)} />
                ) : (
                    <AllCustomerSchemes />
                )}
            </div>

            <Footer />
        </div>
    );
};

export default CategoryMainContent;

