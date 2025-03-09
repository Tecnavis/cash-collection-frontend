// import React, { useContext, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import { DigiContext } from "../../../context/DigiContext";

// const ProfileRightSidebar = () => {
//     const {
//         isProfileSidebarOpen,
//         handleProfileSidebarClose,
//         handleProfileDropdownCheckboxChange,
//         handleProfileSidebarCheckboxChange
//     } = useContext(DigiContext)
//     const profileSidebarRef = useRef(null);

//     // Effect to add event listener when the component mounts
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//           if (profileSidebarRef.current && !profileSidebarRef.current.contains(event.target)) {
//             handleProfileSidebarCheckboxChange();
//           }
//         };
      
//         if (isProfileSidebarOpen.sidebar) {
//           document.addEventListener('mousedown', handleClickOutside);
//         }
      
//         return () => {
//           document.removeEventListener('mousedown', handleClickOutside);
//         };
//       }, [isProfileSidebarOpen.sidebar, handleProfileSidebarCheckboxChange]);
      
//   return (
//     <div className={`profile-right-sidebar ${isProfileSidebarOpen.sidebar ? 'active' : ''}`} ref={profileSidebarRef}>
//       <button className="right-bar-close" onClick={handleProfileSidebarClose}>
//         <i className="fa-light fa-angle-right"></i>
//       </button>
//       <div className="top-panel">
//         <div className="profile-content scrollable">
//           <ul>
//             <li>
//               <div className="dropdown-txt text-center">
//                 <p className="mb-0">John Doe</p>
//                 <span className="d-block">Web Developer</span>
//                 <div className="d-flex justify-content-center">
//                   <div className="form-check pt-3">
//                     <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id="seeProfileAsDropdown"
//                     checked={isProfileSidebarOpen.dropdown}
//                     onChange={handleProfileDropdownCheckboxChange}
//                     />
//                     <label
//                       className="form-check-label"
//                       htmlFor="seeProfileAsDropdown"
//                     >
//                       See as dropdown
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             <li>
//               <Link className="dropdown-item" to="/profile">
//                 <span className="dropdown-icon">
//                   <i className="fa-regular fa-circle-user"></i>
//                 </span>{" "}
//                 Profile
//               </Link>
//             </li>
//             <li>
//               <Link className="dropdown-item" to="/chat">
//                 <span className="dropdown-icon">
//                   <i className="fa-regular fa-message-lines"></i>
//                 </span>{" "}
//                 Message
//               </Link>
//             </li>
//             <li>
//               <Link className="dropdown-item" to="/task">
//                 <span className="dropdown-icon">
//                   <i className="fa-regular fa-calendar-check"></i>
//                 </span>{" "}
//                 Taskboard
//               </Link>
//             </li>
//             <li>
//               <Link className="dropdown-item" to="#">
//                 <span className="dropdown-icon">
//                   <i className="fa-regular fa-circle-question"></i>
//                 </span>{" "}
//                 Help
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//       <div className="bottom-panel">
//         <div className="button-group">
//           <Link to="/editProfile">
//             <i className="fa-light fa-gear"></i>
//             <span>Settings</span>
//           </Link>
//           <Link to="/">
//             <i className="fa-light fa-power-off"></i>
//             <span>Logout</span>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileRightSidebar;



import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DigiContext } from "../../../context/DigiContext";
import axios from "axios";
import { BASE_URL } from "../../../api";
import Cookies from "js-cookie";

const ProfileRightSidebar = () => {
    const {
        isProfileSidebarOpen,
        handleProfileSidebarClose,
        handleProfileDropdownCheckboxChange,
        handleProfileSidebarCheckboxChange
    } = useContext(DigiContext);
    
    const profileSidebarRef = useRef(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
      const fetchUserProfile = async () => {
          try {
              const token = Cookies.getItem("token"); 
              const response = await axios.get(`${BASE_URL}/users/users/`, {
                  headers: {
                              "Content-Type": "multipart/form-data",
                               "Authorization": `Bearer ${Cookies.get("access_token")}` 
                            },
              });
              setUser(response.data);
          } catch (error) {
              console.error("Error fetching user profile:", error);
          }
      };
  
      fetchUserProfile();
  }, []);
  
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileSidebarRef.current && !profileSidebarRef.current.contains(event.target)) {
                handleProfileSidebarCheckboxChange();
            }
        };

        if (isProfileSidebarOpen.sidebar) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isProfileSidebarOpen.sidebar, handleProfileSidebarCheckboxChange]);

    return (
        <div className={`profile-right-sidebar ${isProfileSidebarOpen.sidebar ? "active" : ""}`} ref={profileSidebarRef}>
            <button className="right-bar-close" onClick={handleProfileSidebarClose}>
                <i className="fa-light fa-angle-right"></i>
            </button>
            <div className="top-panel">
                <div className="profile-content scrollable">
                    <ul>
                        <li>
                            <div className="dropdown-txt text-center">
                                {user ? (
                                    <>
                                        <p className="mb-0">{user.name}</p>
                                        <span className="d-block">{user.role || "User"}</span>
                                    </>
                                ) : (
                                    <p>Loading...</p>
                                )}
                                <div className="d-flex justify-content-center">
                                    <div className="form-check pt-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="seeProfileAsDropdown"
                                            checked={isProfileSidebarOpen.dropdown}
                                            onChange={handleProfileDropdownCheckboxChange}
                                        />
                                        <label className="form-check-label" htmlFor="seeProfileAsDropdown">
                                            See as dropdown
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <Link className="dropdown-item" to="/profile">
                                <span className="dropdown-icon">
                                    <i className="fa-regular fa-circle-user"></i>
                                </span>{" "}
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item" to="/chat">
                                <span className="dropdown-icon">
                                    <i className="fa-regular fa-message-lines"></i>
                                </span>{" "}
                                Message
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item" to="/task">
                                <span className="dropdown-icon">
                                    <i className="fa-regular fa-calendar-check"></i>
                                </span>{" "}
                                Taskboard
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item" to="#">
                                <span className="dropdown-icon">
                                    <i className="fa-regular fa-circle-question"></i>
                                </span>{" "}
                                Help
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="bottom-panel">
                <div className="button-group">
                    <Link to="/editProfile">
                        <i className="fa-light fa-gear"></i>
                        <span>Settings</span>
                    </Link>
                    <Link to="/">
                        <i className="fa-light fa-power-off"></i>
                        <span>Logout</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProfileRightSidebar;




