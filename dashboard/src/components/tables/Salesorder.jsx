import React, { useState } from 'react'
import { Table } from 'react-bootstrap'
import { orderListData } from '../../data/Data';
import { Link } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from './PaginationSection';
const Salesorders = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10);
    const dataList = orderListData
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
        <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped" id="allProductTable">
            <thead>
                <tr>
                    <th className="no-sort">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="markAllProduct"/>
                        </div>
                    </th>
                    <th>Order ID</th>
                    <th>Staff</th>
                    <th>Customer</th>
                    <th>Shop Name</th>
                    {/* <th>Status</th> */}
                    <th>Product </th>
                    <th>Product count</th>
                    <th>Price</th>
                    <th>Credit</th>
                    <th>Balance</th>
                    <th>Address</th>
                    <th>Payment Method</th>
                    <th>Delivery Status</th>
                    <th>Status</th>
                    <th>Order Date</th>
                    <th>Action</th>

                </tr>
            </thead>
            <tbody>
                {currentData.map((data) => (
                <tr key={data.order_id}>
                    <td>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox"/>
                        </div>
                    </td>
                    <td><Link to="/invoices">#{data.order_id}</Link></td>
                    <td>NAmes</td>
                    <td>{data.customer_name}</td>
                    <td>Max</td>
                    <td>Cloth</td>
                    <td>{data.product_number}</td>
                    <td>${data.price}</td>
                    <td>$345</td>
                    <td>$300</td>
                    <td>Kuttiady</td>
                    <td>{data.payment_method}</td>
                    <td><span className={`badge ${data.badge}`}>{data.delivery_status}</span></td>
                    <td>
  <select >
    <option className="text-success" value="delivered" >Delivered</option>
    <option className="text-danger" value="outForDelivery">Out for delivery</option>
    <option className="text-warning" value="cancel">Cancel</option>
  </select>
</td>

                    <td>{data.order_date}</td>
                    <td>
                        <div className="btn-box">
                            <button><i className="fa-light fa-eye"></i></button>
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

export default Salesorders