import React, { useState } from 'react'
import { Table } from 'react-bootstrap'
import { allProductData } from '../../data/Data';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from './PaginationSection';

const AllStockListTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10);
    const dataList = allProductData
     // Pagination logic
     const indexOfLastData = currentPage * dataPerPage;
     const indexOfFirstData = indexOfLastData - dataPerPage;
     const currentData = dataList.slice(indexOfFirstData, indexOfLastData);
   
     const paginate = (pageNumber) => {
       setCurrentPage(pageNumber);
     };
   
     // Calculate total number of pages
     const totalPages = Math.ceil(dataList.length / dataPerPage);
     const pageNumbers = [];
     for (let i = 1; i <= totalPages; i++) {
       pageNumbers.push(i);
     }
   
  return (
    <>
    <OverlayScrollbarsComponent>
        <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped" id="AllStockListTable">
            <thead>
                <tr>
                    <th className="no-sort">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="markAllProduct"/>
                        </div>
                    </th>
                    <th>Product</th>
                    <th>ID</th>
                    <th>Stock</th>
                    <th>InStock</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Modal Number</th>
                    <th>Added Date</th>
                    <th>Status </th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {currentData.map((data)=>(
                <tr >
                    <td>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox"/>
                        </div>
                    </td>
                    <td>
                        <div className="table-product-card">
                            <div className="part-img">
                                <img src={data.image} alt="G-shock"/>
                            </div>
                            <div className="part-txt">
                                <span className="product-name">G-Shock</span>
                                <span className="product-category">Category: Watch</span>
                            </div>
                        </div>
                    </td>
                    <td>1234</td>
                    <td>20</td>
                    <td>10</td>
                    <td>Blue</td>
                    <td>6</td>
                    <td>$200</td>
                    <td>MOD-0001</td>
                    <td>1/20/2023</td>
                  <td>In Stock</td>
                    <td>
                        <div className="btn-box">
                            <button><i className="fa-light fa-pen"></i></button>
                            <button><i className="fa-light fa-trash"></i></button>
                        </div>
                    </td>
                </tr>  
                ))}
            
            </tbody>
        </Table>
    </OverlayScrollbarsComponent>
    <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={paginate} pageNumbers={pageNumbers}/>
    </>
  )
}

export default AllStockListTable