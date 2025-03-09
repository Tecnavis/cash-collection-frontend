// import { useContext, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { DigiContext } from '../../context/DigiContext';
// import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';

// const HeaderProfile = () => {
//     const {
//       isProfileSidebarOpen, 
//       handleProfileDropdownCheckboxChange, 
//       handleProfileSidebarCheckboxChange
//     } = useContext(DigiContext)
//     const profileDropdownRef = useRef(null);

//     // Effect to add event listener when the component mounts
//     useEffect(() => {
//       const handleClickOutside = (event) => {
//         if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
//           handleProfileDropdownCheckboxChange();
//         }
//       };
  
//       if (isProfileSidebarOpen.dropdown) {
//         document.addEventListener('mousedown', handleClickOutside);
//       }
  
//       return () => {
//         document.removeEventListener('mousedown', handleClickOutside);
//       };
//     }, [isProfileSidebarOpen.dropdown, handleProfileDropdownCheckboxChange]);
//   return (
//     <div className="header-btn-box" ref={profileDropdownRef}>
//       <div className="profile-btn-wrapper">
//         <button
//           className={`profile-btn ${isProfileSidebarOpen.dropdown ? 'show' : ''}`}
//           id="profileDropdown"
//           onClick={
//             isProfileSidebarOpen.sidebar
//               ? handleProfileSidebarCheckboxChange
//               : handleProfileDropdownCheckboxChange
//           }
//         >
//           <img src="assets/images/admin.png" alt="image" />
//         </button>
//         {isProfileSidebarOpen.dropdown && (
//           <ul className={`dropdown-menu ${isProfileSidebarOpen.dropdown? 'show':''}`} aria-labelledby="profileDropdown">
//             <li>
//               <div className="dropdown-txt text-center">
//                 <p className="mb-0">John Doe</p>
//                 <span className="d-block">Web Developer</span>
//                 <div className="d-flex justify-content-center">
//                   <div className="form-check pt-3">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id="seeProfileAsSidebar"
//                         checked={isProfileSidebarOpen.sidebar}
//                         onChange={handleProfileSidebarCheckboxChange}
//                       />
//                       <label className="form-check-label" htmlFor="seeProfileAsSidebar">See as sidebar</label>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             <li>
//               <Link className="dropdown-item" to="/profile">
//                 <span className="dropdown-icon"><i className="fa-regular fa-circle-user"></i></span> Profile
//               </Link>
//             </li>
//             <li>
//               <Link className="dropdown-item" to="/chat">
//                 <span className="dropdown-icon"><i className="fa-regular fa-message-lines"></i></span> Message
//               </Link>
//             </li>
//             <li>
//               <Link className="dropdown-item" to="/task">
//                 <span className="dropdown-icon"><i className="fa-regular fa-calendar-check"></i></span> Taskboard
//               </Link>
//             </li>
//             <li>
//               <Link className="dropdown-item" to="#">
//                 <span className="dropdown-icon"><i className="fa-regular fa-circle-question"></i></span> Help
//               </Link>
//             </li>
//             <li>
//               <hr className="dropdown-divider" />
//             </li>
//             <li>
//               <Link className="dropdown-item" to="/editProfile">
//                 <span className="dropdown-icon"><i className="fa-regular fa-gear"></i></span> Settings
//               </Link>
//             </li>
//             <li>
//               <Link className="dropdown-item" to="/login">
//                 <span className="dropdown-icon"><i className="fa-regular fa-arrow-right-from-bracket"></i></span> Logout
//               </Link>
//             </li>
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HeaderProfile;


import { useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DigiContext } from '../../context/DigiContext';
import Cookies from 'js-cookie';

const HeaderProfile = () => {
    const {
      isProfileSidebarOpen, 
      handleProfileDropdownCheckboxChange, 
      handleProfileSidebarCheckboxChange
    } = useContext(DigiContext);
    const profileDropdownRef = useRef(null);
    const navigate = useNavigate(); // For redirection

    // Effect to close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
          handleProfileDropdownCheckboxChange();
        }
      };
  
      if (isProfileSidebarOpen.dropdown) {
        document.addEventListener('mousedown', handleClickOutside);
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isProfileSidebarOpen.dropdown, handleProfileDropdownCheckboxChange]);

    // Logout function
    const handleLogout = () => {
      Cookies.remove('access_token');  // Remove access token
      Cookies.remove('refresh_token'); // Remove refresh token
      Cookies.remove('user_role');     // Remove user role
      navigate('/'); // Redirect to login
    };

  return (
    <div className="header-btn-box" ref={profileDropdownRef}>
      <div className="profile-btn-wrapper">
        <button
          className={`profile-btn ${isProfileSidebarOpen.dropdown ? 'show' : ''}`}
          id="profileDropdown"
          onClick={
            isProfileSidebarOpen.sidebar
              ? handleProfileSidebarCheckboxChange
              : handleProfileDropdownCheckboxChange
          }
        >
          <img src="assets/images/admin.png" alt="image" />
        </button>
        {isProfileSidebarOpen.dropdown && (
          <ul className={`dropdown-menu ${isProfileSidebarOpen.dropdown ? 'show' : ''}`} aria-labelledby="profileDropdown">
            <li>
              <div className="dropdown-txt text-center">
                <p className="mb-0">John Doe</p>
                <span className="d-block">Web Developer</span>
                
              </div>
            </li>
            <li>
              <Link className="dropdown-item" to="/profile">
                <span className="dropdown-icon"><i className="fa-regular fa-circle-user"></i></span> Profile
              </Link>
            </li>
            
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <Link className="dropdown-item" to="/editProfile">
                <span className="dropdown-icon"><i className="fa-regular fa-gear"></i></span> Settings
              </Link>
            </li>
            <li>
              <button className="dropdown-item" onClick={handleLogout}>
                <span className="dropdown-icon"><i className="fa-regular fa-arrow-right-from-bracket"></i></span> Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default HeaderProfile;




// import { useContext, useEffect, useRef, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { DigiContext } from '../../context/DigiContext';
// import Cookies from 'js-cookie';
// import axios from 'axios';

// const HeaderProfile = () => {
//     const {
//         isProfileSidebarOpen,
//         handleProfileDropdownCheckboxChange,
//         handleProfileSidebarCheckboxChange
//     } = useContext(DigiContext);
//     const profileDropdownRef = useRef(null);
//     const navigate = useNavigate();
//     const [userProfile, setUserProfile] = useState(null);

//     // Fetch user profile data
//     useEffect(() => {
//         const fetchUserProfile = async () => {
//             try {
//                 const response = await axios.get('/users/', {
//                     headers: {
//                         'Authorization': `Bearer ${Cookies.get('access_token')}`
//                     }
//                 });
//                 setUserProfile(response.data);
//             } catch (error) {
//                 console.error('Error fetching user profile:', error);
//                 if (error.response?.status === 401) {
//                     handleLogout();
//                 }
//             }
//         };

//         fetchUserProfile();
//     }, []);

//     // Effect to close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
//                 handleProfileDropdownCheckboxChange();
//             }
//         };

//         if (isProfileSidebarOpen.dropdown) {
//             document.addEventListener('mousedown', handleClickOutside);
//         }

//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [isProfileSidebarOpen.dropdown, handleProfileDropdownCheckboxChange]);

//     // Logout function
//     const handleLogout = () => {
//         Cookies.remove('access_token');
//         Cookies.remove('refresh_token');
//         navigate('/login');
//     };

//     return (
//         <div className="header-btn-box" ref={profileDropdownRef}>
//             <div className="profile-btn-wrapper">
//                 <button
//                     className={`profile-btn ${isProfileSidebarOpen.dropdown ? 'show' : ''}`}
//                     id="profileDropdown"
//                     onClick={
//                         isProfileSidebarOpen.sidebar
//                             ? handleProfileSidebarCheckboxChange
//                             : handleProfileDropdownCheckboxChange
//                     }
//                 >
//                     <img src="assets/images/admin.png" alt="profile" />
//                 </button>
//                 {isProfileSidebarOpen.dropdown && (
//                     <ul className={`dropdown-menu ${isProfileSidebarOpen.dropdown ? 'show' : ''}`} aria-labelledby="profileDropdown">
//                         <li>
//                             <div className="dropdown-txt text-center">
//                                 <p className="mb-0">{userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'Loading...'}</p>
//                                 <span className="d-block">{userProfile?.role || 'Loading...'}</span>
//                                 <span className="d-block small">{userProfile?.email || ''}</span>
//                                 <div className="d-flex justify-content-center">
//                                     <div className="form-check pt-3">
//                                         <input
//                                             className="form-check-input"
//                                             type="checkbox"
//                                             id="seeProfileAsSidebar"
//                                             checked={isProfileSidebarOpen.sidebar}
//                                             onChange={handleProfileSidebarCheckboxChange}
//                                         />
//                                         <label className="form-check-label" htmlFor="seeProfileAsSidebar">See as sidebar</label>
//                                     </div>
//                                 </div>
//                             </div>
//                         </li>
//                         <li>
//                             <Link className="dropdown-item" to="/profile">
//                                 <span className="dropdown-icon"><i className="fa-regular fa-circle-user"></i></span> Profile
//                             </Link>
//                         </li>
//                         {/* Rest of your menu items remain the same */}
//                         <li>
//                             <Link className="dropdown-item" to="/chat">
//                                 <span className="dropdown-icon"><i className="fa-regular fa-message-lines"></i></span> Message
//                             </Link>
//                         </li>
//                         <li>
//                             <Link className="dropdown-item" to="/task">
//                                 <span className="dropdown-icon"><i className="fa-regular fa-calendar-check"></i></span> Taskboard
//                             </Link>
//                         </li>
//                         <li>
//                             <Link className="dropdown-item" to="#">
//                                 <span className="dropdown-icon"><i className="fa-regular fa-circle-question"></i></span> Help
//                             </Link>
//                         </li>
//                         <li>
//                             <hr className="dropdown-divider" />
//                         </li>
//                         <li>
//                             <Link className="dropdown-item" to="/editProfile">
//                                 <span className="dropdown-icon"><i className="fa-regular fa-gear"></i></span> Settings
//                             </Link>
//                         </li>
//                         <li>
//                             <button className="dropdown-item" onClick={handleLogout}>
//                                 <span className="dropdown-icon"><i className="fa-regular fa-arrow-right-from-bracket"></i></span> Logout
//                             </button>
//                         </li>
//                     </ul>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default HeaderProfile;