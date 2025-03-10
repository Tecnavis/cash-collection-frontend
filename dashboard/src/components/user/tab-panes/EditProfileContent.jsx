import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../../../api";

const EditProfileContent = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    role: "",
    contact_number: "",
    // photo: "",
    biography: "",
  });

  // const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch User Profile Data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("access_token");
        const response = await axios.get(`${BASE_URL}/users/users/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle Profile Image Change
  // const handleImageChange = (e) => {
  //   setProfileImage(e.target.files[0]);
  // };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = Cookies.get("access_token");
      const formData = new FormData();
      
      formData.append("username", user.username);
      formData.append("email", user.email);
      formData.append("contact_number", user.contact_number || "");
      formData.append("biography", user.biography || "");
      // if (profileImage) {
      //   formData.append("photo", profileImage);
      // }

      await axios.put(`${BASE_URL}/users/profile/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="public-information mb-30">
        {loading && <p>Loading...</p>}
        {message && <p className="alert alert-info">{message}</p>}

        <div className="row g-4">
          <div className="col-md-3">
            <div className="admin-profile">
              {/* <div className="image-wrap">
                <div className="part-img rounded-circle overflow-hidden">
                  <img src={user.photo || "assets/images/admin.png"} alt="admin" />
                </div>
                <label className="image-change">
                  <input type="file" onChange={handleImageChange} hidden />
                  <i className="fa-light fa-camera" />
                </label>
              </div> */}

              <div className="image-wrap">
                <div className="part-img rounded-circle overflow-hidden">
                  <img src={user.photo || "assets/images/admin.png"} alt="admin" />
                </div>
                <button className="image-change">
                  <i className="fa-light fa-camera" />
                </button>
              </div>
              <span className="admin-name">{user.username}</span>
              <span className="admin-role">{user.role}</span>
            </div>
          </div>

          <div className="col-md-9">
            <div className="row g-3">
              <div className="col-sm-6">
                <div className="input-group">
                  <span className="input-group-text"><i className="fa-light fa-user" /></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-12">
                <textarea
                  className="form-control h-150-p"
                  placeholder="Biography"
                  name="biography"
                  value={user.biography || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-edit-tab-title">
        <h6>Private Information</h6>
      </div>

      <div className="private-information mb-30">
        <div className="row g-3">
          <div className="col-md-4 col-sm-6">
            <div className="input-group">
              <span className="input-group-text"><i className="fa-light fa-envelope" /></span>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="input-group">
              <span className="input-group-text"><i className="fa-light fa-phone" /></span>
              <input
                type="tel"
                className="form-control"
                placeholder="Phone"
                name="contact_number"
                value={user.contact_number || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default EditProfileContent;

