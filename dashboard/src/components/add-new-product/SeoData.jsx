import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../api";

const SeoData = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    description: "",
    price: "",
    offerPrice: "",
   
    country: "saudi",
    vat_type: "",
    tax_codes: "HS",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/services/categories/`);
        setCategories(data);
      } catch (err) {
        setError("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);



  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let taxCode = "";
    if (name === "country") {
        taxCode = value === "india" ? "HSN" : value === "saudi" ? "HS" : "";
    }

    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        tax_codes: name === "country" ? taxCode : prevData.tax_codes,
    }));
};


  // Handle Create Service
  const handleCreateService = async () => {
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        `${BASE_URL}/services/categories/${formData.category}/services/create/`,
        formData
      );
      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          category: "",
          name: "",
          description: "",
          price: "",
          offerPrice: "",
         
          country: "saudi",
          vat_type: "",
          tax_codes: "HS",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create service");
    }
  };

  return (
    <div className="panel">
      <form>
        {/* Category Dropdown */}
        <div className="row g-3 mb-3">
          <label className="col-md-2 col-form-label-sm">Category</label>
          <div className="col-md-6">
            <select
              name="category"
              className="form-control form-control-sm"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Country Selection */}
        {/* <div className="row g-3 mb-3">
          <label className="col-md-2 col-form-label-sm">Country</label>
          <div className="col-md-6">
            <select
              name="country"
              className="form-control form-control-sm"
              value={formData.country}
              onChange={handleInputChange}
            >
              <option value="india">India</option>
              <option value="saudi">Saudi Arabia</option>
            </select>
          </div>
        </div> */}


        {/* Tax Code */}
        {/* <div className="col-md-6">
            <label>Tax Code</label>
            <input type="text" value={formData.tax_codes} readOnly />
        </div> */}


        {/* Tax Rate Dropdown */}
        {/* {formData.country && (
          <div className="row g-3 mb-3">
            <label className="col-md-2 col-form-label-sm">
              {formData.country === "india" ? "GST Rate" : "VAT Rate"}
            </label>
            <div className="col-md-6">
              <select
                name="tax_rate"
                className="form-control form-control-sm"
                value={formData.tax_rate}
                onChange={handleInputChange}
              >
                <option value="">Select {formData.country === "india" ? "GST" : "VAT"}</option>
                {(formData.country === "india"
                  ? [
                      { value: "GST_5", label: "5% GST" },
                      { value: "GST_12", label: "12% GST" },
                      { value: "GST_18", label: "18% GST" },
                      { value: "GST_28", label: "28% GST" },
                    ]
                  : [
                      { value: "standard", label: "Standard VAT (15%)" },
                      { value: "zero_rated", label: "Zero-Rated VAT (0%)" },
                      { value: "exempt", label: "Exempt VAT (No VAT Applied)" },
                    ]
                ).map((tax) => (
                  <option key={tax.value} value={tax.value}>
                    {tax.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )} */}
<div className="row g-3 mb-3">
    <label htmlFor="country" className="col-md-2 col-form-label col-form-label-sm">
        Country
    </label>
    <div className="col-md-6">
        <select
            id="country"
            name="country"
            className="form-control form-control-sm"
            value={formData.country}
            onChange={(e) => {
                const selectedCountry = e.target.value;
                setFormData({ ...formData, country: selectedCountry, vat_type: "" });
            }}
        >
            <option value="">Select Country</option>
            <option value="india">India</option>
            <option value="saudi">Saudi Arabia</option>
        </select>
    </div>
</div>

{formData.country && (
    <div className="row g-3 mb-3">
        <label htmlFor="vat_type" className="col-md-2 col-form-label col-form-label-sm">
            {formData.country === "india" ? "GST Rate" : "VAT Rate"}
        </label>
        <div className="col-md-6">
            <select
                id="vat_type"
                name="vat_type"
                className="form-control form-control-sm"
                value={formData.vat_type}
                onChange={(e) => setFormData({ ...formData, vat_type: e.target.value })}
            >
                <option value="">Select {formData.country === "india" ? "GST" : "VAT"}</option>
                {(formData.country === "india"
                    ? [
                        { value: "GST_5", label: "5% GST" },
                        { value: "GST_12", label: "12% GST" },
                        { value: "GST_18", label: "18% GST" },
                        { value: "GST_28", label: "28% GST" },
                    ]
                    : [
                        { value: "standard", label: "Standard VAT (15%)" },
                        { value: "zero_rated", label: "Zero-Rated VAT (0%)" },
                        { value: "exempt", label: "Exempt VAT (No VAT Applied)" },
                    ]
                ).map((vat) => (
                    <option key={vat.value} value={vat.value}>
                        {vat.label}
                    </option>
                ))}
            </select>
        </div>
    </div>
)}
        {/* Name Input */}
        <div className="row g-3">
          <label className="col-md-2 col-form-label-sm">Title</label>
          <div className="col-md-10">
            <input
              type="text"
              className="form-control form-control-sm"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <br />

        {/* Description */}
        <div className="row g-3">
          <label className="col-md-2 col-form-label-sm">Description</label>
          <div className="col-md-10">
            <textarea
              className="form-control form-control-sm"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <br />

        {/* Price */}
        <div className="row g-3 mb-3">
          <label className="col-md-2 col-form-label-sm">Price</label>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control form-control-sm"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Offer Price */}
        <div className="row g-3 mb-3">
          <label className="col-md-2 col-form-label-sm">Offer Price</label>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control form-control-sm"
              name="offerPrice"
              placeholder="Offer Price"
              value={formData.offerPrice}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <br />

        {/* Quantity */}
        {/* <div className="row g-3 mb-3">
          <label className="col-md-2 col-form-label-sm">Quantity</label>
          <div className="col-md-10">
            <input
              type="number"
              className="form-control form-control-sm"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
            />
          </div>
        </div> */}

        {/* Messages */}
        {error && <p className="text-danger mt-2">{error}</p>}
        {success && <p className="text-success mt-2">Service added successfully!</p>}

        {/* Submit Button */}
        <div className="row g-3 mb-3">
          <div className="col-md-10"></div>
          <div className="col-md-2 text-end">
            <button type="button" className="btn btn-primary" onClick={handleCreateService}>
              Create Service
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SeoData;
