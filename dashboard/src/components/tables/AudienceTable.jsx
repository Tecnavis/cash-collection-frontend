import React, { useContext } from 'react'
import {DigiContext} from '../../context/DigiContext'
import { Form } from 'react-bootstrap'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import PaginationSection from './PaginationSection'
const AudienceTable = () => {
    const {
        currentPage,
        handleCheckboxChange,
        currentData,
        paginate,
        totalPages,
        pageNumbers
      } = useContext(DigiContext)
  return (
    <>
    <OverlayScrollbarsComponent>
        <table className="table table-dashed table-hover digi-dataTable target-audience-table table-striped" id="targetAudienceTable">
            <thead>
                <tr>
                <th className="no-sort">
                    <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="markAllAudience" />
                    </div>
                </th>
                <th>ID</th>
                <th>Item</th>
                <th>Username</th>
                <th>Email</th>
                <th>Company</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Return Date</th>
                <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {currentData.map((data, index) => (
                <tr key={data.id}>
                    <td>
                    <div className="form-check">
                        <Form.Check className="form-check-input" type="checkbox"/>
                    </div>
                    </td>
                    <td>{data.id}</td>
                    <td>Product (5)</td>
                    <td>{data.first_name}</td>
                    <td>{data.email}</td>
                    <td>{data.company}</td>
                    <td>{data.phone}</td>
                    <td>$100</td>
                    <td>12/2/2022</td>
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
        </table>
    </OverlayScrollbarsComponent>
    <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={paginate} pageNumbers={pageNumbers}/>
    </>
  )
}

export default AudienceTable