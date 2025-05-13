import React, { useContext, useState } from 'react'
import { Form } from 'react-bootstrap'
import { DigiContext } from '../../context/DigiContext';
import SelectFilter from './SelectFilter';

const AllStockListFilter = () => {
    const { handleTableFilterReset } = useContext(DigiContext);
 
  return (
    <div className="table-filter-option all-products-table-header">
        <div className="row g-3">
            <div className="col-xl-10 col-10 col-xs-12">
                <div className="row g-3">
                    <div className="col">
                        <Form.Select className="form-control form-control-sm">
                            <option value="0">All Category</option>
                            <option value="1">Cloth</option>
                            <option value="2">Fashion</option>
                            <option value="3">Bag</option>
                            <option value="4">Food</option>
                            <option value="5">Medicine</option>
                            <option value="6">Watch</option>
                            <option value="7">Smart Phone</option>
                        </Form.Select>
                    </div>
                    <div className="col">
                        <Form.Select className="form-control form-control-sm">
                            <option value="0">All Product Stock</option>
                            <option value="1">In stock</option>
                            <option value="2">Out of stock</option>
                            <option value="3">On backorder</option>
                        </Form.Select>
                    </div>
                    <div className="col">
                    <button className="btn btn-sm btn-primary" onClick={handleTableFilterReset}><i className="fa-light fa-filter"></i> Filter</button>
                    </div>
                </div>
            </div>
            <div className="col-xl-2 col-2 col-xs-12 d-flex justify-content-end align-items-center">
                <div id="productTableLength">
                    <SelectFilter/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AllStockListFilter