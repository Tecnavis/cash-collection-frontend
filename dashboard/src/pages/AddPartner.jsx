// import React, { useState } from "react";
// import Footer from "../components/footer/Footer";
// import AddNewBreadcrumb from "../components/breadcrumb/AddNewBreadcrumb";
// import axios from "axios";
// import { BASE_URL } from "../api";
// import Cookies from "js-cookie";

// const AddPartner = () => {
//   const [formData, setFormData] = useState({
//     user: {
//       first_name: "",
//       last_name: "",
//       email: "",
//       contact_number: "",
//       password: "",
//     },
//     secondary_contact: "",
//     address: "",
//     other_info: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (["first_name", "last_name", "email", "contact_number", "password"].includes(name)) {
//       // Update user object separately
//       setFormData((prevData) => ({
//         ...prevData,
//         user: { ...prevData.user, [name]: value },
//       }));
//     } else {
//       // Update other fields normally
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value,
//       }));
//     }
//   };

//   const breadcrumbLink =
//     formData.partner_type === "vendor" ? "/supplier" : "/allCustomer";

//   const validateForm = () => {
//     const { email, contact_number, password } = formData;
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     const phoneRegex = /^[0-9]{10,15}$/;

//     if (!emailRegex.test(email)) {
//       setMessage("Invalid email format.");
//       return false;
//     }
//     if (!password || password.length < 6) {
//       setMessage("Password must be at least 6 characters long.");
//       return false;
//     }
//     if (!phoneRegex.test(contact_number)) {
//       setMessage("Phone number must be 10-15 digits.");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     if (!validateForm()) return;

//     setLoading(true);

//     try {
//       await axios.post(`${BASE_URL}/partner/partners/create/`, formData, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${Cookies.get("access_token")}`,
//         },
//       });

//       setMessage("User profile created successfully!");
//       setFormData({
//         user: {
//           first_name: "",
//           last_name: "",
//           email: "",
//           contact_number: "",
//           password: "",
//         },
//         secondary_contact: "",
//         address: "",
//         other_info: "",
//       });

//       setTimeout(() => setMessage(""), 5000);
//     } catch (error) {
//       setMessage(
//         error.response?.data?.message || "Error creating user profile."
//       );
//       console.error("API Error:", error.response?.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="main-content">
//       <AddNewBreadcrumb link={breadcrumbLink} title={"Add Agents"} />
//       <div className="row">
//         <div className="col-12">
//           <div className="panel">
//             <div className="panel-header">
//               <h5>Create Agent Profile</h5>
//             </div>
//             <div className="panel-body">
//               <form onSubmit={handleSubmit}>
//                 <div className="row g-3">

//                 <div className="col-xxl-3 col-lg-4 col-sm-6">
//                     <label className="form-label">First Name</label>
//                     <input
//                       type="text"
//                       name="first_name"
//                       className="form-control form-control-sm"
//                       value={formData.first_name}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>

//                   <div className="col-xxl-3 col-lg-4 col-sm-6">
//                     <label className="form-label">Last Name</label>
//                     <input
//                       type="text"
//                       name="last_name"
//                       className="form-control form-control-sm"
//                       value={formData.last_name}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>

//                   <div className="col-xxl-3 col-lg-4 col-sm-6">
//                     <label className="form-label">Password</label>
//                     <input
//                       type="password"
//                       name="password"
//                       className="form-control form-control-sm"
//                       value={formData.password}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>

//                   <div className="col-xxl-3 col-lg-4 col-sm-6">
//                     <label className="form-label">Email</label>
//                     <input
//                       type="email"
//                       name="email"
//                       className="form-control form-control-sm"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>

//                   <div className="col-xxl-3 col-lg-4 col-sm-6">
//                     <label className="form-label">Contact Number</label>
//                     <input
//                       type="tel"
//                       name="contact_number"
//                       className="form-control form-control-sm"
//                       value={formData.contact_number}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>

//                   <div className="col-xxl-3 col-lg-4 col-sm-6">
//                     <label className="form-label">Secondary Contact</label>
//                     <input
//                       type="tel"
//                       name="secondary_contact"
//                       className="form-control form-control-sm"
//                       value={formData.secondary_contact}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="col-xxl-3 col-lg-4 col-sm-6">
//                     <label className="form-label">Address</label>
//                     <textarea
//                       name="address"
//                       className="form-control form-control-sm"
//                       value={formData.address}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="col-xxl-3 col-lg-4 col-sm-6">
//                     <label className="form-label">Other Info</label>
//                     <textarea
//                       name="other_info"
//                       className="form-control form-control-sm"
//                       value={formData.other_info}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-3">
//                   <button
//                     type="submit"
//                     className="btn btn-primary"
//                     disabled={loading}
//                   >
//                     {loading ? "Creating..." : "Create Partner"}
//                   </button>
//                 </div>
//               </form>

//               {message && <p className="mt-2 text-info">{message}</p>}
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default AddPartner;


import React, { useState } from "react";
import Footer from "../components/footer/Footer";
import AddNewBreadcrumb from "../components/breadcrumb/AddNewBreadcrumb";
import axios from "axios";
import { BASE_URL } from "../api";
import Cookies from "js-cookie";

const AddAgent = () => {
  const [formData, setFormData] = useState({
    user: {
      first_name: "",
      last_name: "",
      email: "",
      contact_number: "",
      password: "",
    },
    secondary_contact: "",
    address: "",
    other_info: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["first_name", "last_name", "email", "contact_number", "password"].includes(name)) {
      setFormData((prevData) => ({
        ...prevData,
        user: { ...prevData.user, [name]: value },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const { email, contact_number, password } = formData.user;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!emailRegex.test(email)) {
      setMessage("Invalid email format.");
      return false;
    }
    if (!password || password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return false;
    }
    if (!phoneRegex.test(contact_number)) {
      setMessage("Phone number must be 10-15 digits.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/partner/partners/create/`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });

      setMessage("Agent profile created successfully!");
      setFormData({
        user: {
          first_name: "",
          last_name: "",
          email: "",
          contact_number: "",
          password: "",
        },
        secondary_contact: "",
        address: "",
        other_info: "",
      });

      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error creating agent profile.");
      console.error("API Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <AddNewBreadcrumb link="/allAgents" title={"Add Agent"} />
      <div className="row">
        <div className="col-12">
          <div className="panel">
            <div className="panel-header">
              <h5>Create Agent Profile</h5>
            </div>
            <div className="panel-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-xxl-3 col-lg-4 col-sm-6">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      className="form-control form-control-sm"
                      value={formData.user.first_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-xxl-3 col-lg-4 col-sm-6">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      className="form-control form-control-sm"
                      value={formData.user.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-xxl-3 col-lg-4 col-sm-6">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control form-control-sm"
                      value={formData.user.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-xxl-3 col-lg-4 col-sm-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-sm"
                      value={formData.user.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-xxl-3 col-lg-4 col-sm-6">
                    <label className="form-label">Contact Number</label>
                    <input
                      type="tel"
                      name="contact_number"
                      className="form-control form-control-sm"
                      value={formData.user.contact_number}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-xxl-3 col-lg-4 col-sm-6">
                    <label className="form-label">Secondary Contact</label>
                    <input
                      type="tel"
                      name="secondary_contact"
                      className="form-control form-control-sm"
                      value={formData.secondary_contact}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-xxl-3 col-lg-4 col-sm-6">
                    <label className="form-label">Address</label>
                    <textarea
                      name="address"
                      className="form-control form-control-sm"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-xxl-3 col-lg-4 col-sm-6">
                    <label className="form-label">Other Info</label>
                    <textarea
                      name="other_info"
                      className="form-control form-control-sm"
                      value={formData.other_info}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Agent"}
                  </button>
                </div>
              </form>

              {message && <p className="mt-2 text-info">{message}</p>}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddAgent;
