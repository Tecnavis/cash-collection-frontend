import React, { useState } from "react";
// import CategoryDropdowns from './CategoryDropdowns'

const CategorySection = () => {
  const [subDropdown, setSubDropdown] = useState({
    showFinance: false,
    showAccounting: false,
    showFashion: false,
    showShirt: false,
  });

  const handleChange = (e, id) => {
    setSubDropdown((prevSubDropdown) => ({
      ...prevSubDropdown,
      [id]: !prevSubDropdown[id],
    }));
  };

  const [categoryBtn, setCategoryBtn] = useState(false);
  const handleCategoryBtn = () => {
    setCategoryBtn(!categoryBtn);
  };
  const [addNewCat, setAddNewCat] = useState(false);
  const handleAddNewCat = () => {
    setAddNewCat(!addNewCat);
  };
  return (
    <div className="panel mb-30">
      <div className="panel-header">
        <h5>Category</h5>
        <div className="btn-box d-flex gap-2">
          <button
            className="btn btn-sm btn-icon btn-outline-primary panel-close"
            onClick={handleCategoryBtn}
          >
            <i className="fa-light fa-angle-up"></i>
          </button>
        </div>
      </div>
      <div className={`panel-body ${categoryBtn ? "d-none" : ""}`}>
        <form className="input-group-with-icon mb-20">
          <span className="input-icon">
            <i className="fa-light fa-magnifying-glass"></i>
          </span>
          <input type="search" placeholder="Search category" />
        </form>
        {/* <CategoryDropdowns/> */}
        <div className="product-categories">
          <div className="cat-group">
            <div className="form-check">
              <input
                className="form-check-input has-sub"
                onChange={(e) => handleChange(e, "showFinance")}
                checked={subDropdown.showFinance}
                type="checkbox"
                id="catFinance"
              />
              <label className="form-check-label" htmlFor="catFinance">
                Finance{" "}
                <span role="button" onClick={() => handleChange("showFinance")}>
                  <i
                    className={`fa-light ${
                      subDropdown.showFinance ? "fa-minus" : "fa-plus"
                    }`}
                  ></i>
                </span>
              </label>
            </div>
            <div
              className={`sub-cat-group ${
                subDropdown.showFinance ? "" : "d-none"
              }`}
            >
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="catBanking"
                />
                <label className="form-check-label" htmlFor="catBanking">
                  Banking
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* <CategoryDropdowns/> */}
      </div>
      <div className="border-top"></div>
      <div className={`panel-body ${categoryBtn ? "d-none" : ""}`}>
        <div className="d-flex justify-content-end">
          <button
            className="btn-flush add-category-btn"
            onClick={handleAddNewCat}
          >
            <i className={`fa-light ${addNewCat ? "fa-minus" : "fa-plus"}`}></i>{" "}
            Add new category
          </button>
        </div>
        <div className={`add-new-category-panel ${addNewCat ? "" : "d-none"}`}>
          <form>
            <input
              type="text"
              className="form-control form-control-sm mb-3"
              placeholder="Category Name"
            />
            <select
              className="form-control form-control-sm mb-3"
              data-placeholder="Select Parent"
            >
              <option value="">Select Parent</option>
              <option value="0">Finance</option>
            </select>
            <div className="d-flex justify-content-end">
              <button className="btn btn-sm btn-primary">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategorySection;

