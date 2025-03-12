// import React, { useContext, useState } from 'react'
// import CategoryTable from '../tables/CategoryTable'
// import { DigiContext } from '../../context/DigiContext';
// import { Form } from 'react-bootstrap';

// const AllCategory = () => {
//     const { headerBtnOpen, handleHeaderBtn, handleHeaderReset, headerRef } = useContext(DigiContext);
//     const [checkboxes, setCheckboxes] = useState({
//         showName: true,
//         showDesc: true,
//         showSlug: true,
//         showCount: true,
//         showAction: true,     
//       });
    
//       const handleChange = (e) => {
//         const { id } = e.target;
//         setCheckboxes((prevCheckboxes) => ({
//           ...prevCheckboxes,
//           [id]: !prevCheckboxes[id],
//         }));
//       };
//   return (
//     <div className="col-xxl-8 col-md-7">
//             <div className="panel">
//                 <div className="panel-header">
//                     <h5>All Categories</h5>
//                     <div className="btn-box d-flex gap-2">
//                         <div id="tableSearch">
//                             <Form.Control type='text' placeholder='Search...'/>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="panel-body">
//                     <div className="table-filter-option">
//                         <div className="row justify-content-between g-3">
                      
//                             <div className="col-xl-2 col-3 col-xs-12 d-flex justify-content-end">
//                                 <div id="productTableLength"></div>
//                             </div>
//                         </div>
//                     </div>
//                     <CategoryTable/>
//                 </div>
//             </div>
//         </div>
//   )
// }

// export default AllCategory


import React, { useContext, useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from '../../api';
import { DigiContext } from '../../context/DigiContext';

const AllSchemes = () => {
    const { headerBtnOpen, handleHeaderBtn, handleHeaderReset, headerRef } = useContext(DigiContext);
    const [schemes, setSchemes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [checkboxes, setCheckboxes] = useState({
        showSchemeNumber: true,
        showName: true,
        showTotalAmount: true,
        showCollectionFrequency: true,
        showInstallmentAmount: true,
        showStartDate: true,
        showEndDate: true,
        showAction: true,
    });

    useEffect(() => {
        fetchSchemes();
    }, []);

    const fetchSchemes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/services/schemes/`);
            setSchemes(response.data);
        } catch (error) {
            console.error('Error fetching schemes:', error);
        }
    };

    const handleChange = (e) => {
        const { id } = e.target;
        setCheckboxes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredSchemes = schemes.filter(scheme => 
        scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.scheme_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="col-xxl-8 col-md-7">
            <div className="panel">
                <div className="panel-header d-flex justify-content-between align-items-center">
                    <h5>All Schemes</h5>
                    <div className="btn-box d-flex gap-2">
                        <Form.Control 
                            type="text" 
                            placeholder="Search..." 
                            value={searchTerm} 
                            onChange={handleSearch} 
                        />
                    </div>
                </div>
                <div className="panel-body">
                    <div className="table-filter-option mb-3">
                        <div className="row g-3">
                            <div className="col-12 d-flex gap-2 flex-wrap">
                                {Object.keys(checkboxes).map(key => (
                                    <Form.Check 
                                        key={key}
                                        type="checkbox"
                                        id={key}
                                        label={key.replace('show', '').replace(/([A-Z])/g, ' $1')}
                                        checked={checkboxes[key]}
                                        onChange={handleChange}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    {checkboxes.showSchemeNumber && <th> Number</th>}
                                    {checkboxes.showName && <th>Name</th>}
                                    {checkboxes.showTotalAmount && <th>Total Amount</th>}
                                    {checkboxes.showCollectionFrequency && <th>Collection Frequency</th>}
                                    {checkboxes.showInstallmentAmount && <th>Installment Amount</th>}
                                    {checkboxes.showStartDate && <th>Start Date</th>}
                                    {checkboxes.showEndDate && <th>End Date</th>}
                                    {checkboxes.showAction && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSchemes.length > 0 ? (
                                    filteredSchemes.map((scheme) => (
                                        <tr key={scheme.id}>
                                            {checkboxes.showSchemeNumber && <td>{scheme.scheme_number}</td>}
                                            {checkboxes.showName && <td>{scheme.name}</td>}
                                            {checkboxes.showTotalAmount && <td>{scheme.total_amount}</td>}
                                            {checkboxes.showCollectionFrequency && <td>{scheme.collection_frequency}</td>}
                                            {checkboxes.showInstallmentAmount && <td>{scheme.installment_amount || '-'}</td>}
                                            {checkboxes.showStartDate && <td>{scheme.start_date}</td>}
                                            {checkboxes.showEndDate && <td>{scheme.end_date}</td>}
                                            {checkboxes.showAction && (
                                                <td>
                                                    <button className="btn btn-sm btn-warning me-2">Edit</button>
                                                    <button className="btn btn-sm btn-danger">Delete</button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">No schemes found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllSchemes;
