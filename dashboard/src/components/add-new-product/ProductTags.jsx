import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

const ProductTags = () => {
  const [productTagBtn,SetProductTagBtn] = useState(false)

  const handleProductTagBtn = () => {
      SetProductTagBtn(!productTagBtn)
  }
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };


  

  return (
    <div className="panel">
      <div className="panel-header">
        <h5>Main Category</h5>
        <div className="btn-box d-flex gap-2">
          <button className="btn btn-sm btn-icon btn-outline-primary panel-close" onClick={handleProductTagBtn}>
            <i className="fa-light fa-angle-up"></i>
          </button>
        </div>
      </div>
      <div className={`panel-body ${productTagBtn? 'd-none':''}`}>
        <div className="product-tag-area">
          <div className="row g-3">
            <div className="col-9">
              <Form.Control
                type="text"
                id="productTags"
                value={tagInput}
                onChange={handleTagInputChange}
              />
            </div>
            <div className="col-3">
              <button
                className="btn btn-sm btn-primary w-100"
                id="addTags"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTags;
