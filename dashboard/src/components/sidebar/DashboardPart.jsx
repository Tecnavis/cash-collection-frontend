// import React, { useContext } from 'react';
// import { NavLink , Link} from 'react-router-dom';
// import { DigiContext } from '../../context/DigiContext';

// const DashboardPart = () => {
//   const { dashState,toggleMainDashDropdown,dropdownOpen,layoutPosition,mainDashboardRef } = useContext(DigiContext);
//   const { 
//     isMainDropdownOpen, 
//   } = dashState;
//   return (
//     <li className='sidebar-item open' ref={layoutPosition.horizontal? mainDashboardRef : null}>
//       <Link
//         role="button"
//         className={`sidebar-link-group-title has-sub ${isMainDropdownOpen ? 'show' : ''}`}
//         onClick={toggleMainDashDropdown}
//       >
//         Dashboard
//       </Link>
//       <ul className={`sidebar-link-group ${layoutPosition.horizontal ? (dropdownOpen.dashboard ? 'd-block' : '') : (isMainDropdownOpen ? 'd-none' : '')}`}>       
//        <li className="sidebar-dropdown-item">
//           <NavLink to="/dash" className="sidebar-link">
//             <span className="nav-icon">
//               <i className="fa-light fa-cart-shopping-fast"></i>
//             </span>{' '}
//             <span className="sidebar-txt">Admin</span>
//           </NavLink>
//         </li>
//         <li className="sidebar-dropdown-item">
//           <NavLink
//             to="/dashboard"
//             className="sidebar-link"
//           >
//             <span className="nav-icon">
//               <i className="fa-light fa-user-headset"></i>
//             </span>{' '}
//             <span className="sidebar-txt">Accountant</span>
//           </NavLink>
//         </li>
//         <li className="sidebar-dropdown-item">
//           <NavLink
//             to="/hrmDashboard"
//             className="sidebar-link"
//           >
//             <span className="nav-icon">
//               <i className="fa-light fa-user-tie"></i>
//             </span>{' '}
//             <span className="sidebar-txt">Agent</span>
//           </NavLink>
//         </li>
//       </ul>
//     </li>
//   );
// };

// export default DashboardPart;
import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { DigiContext } from '../../context/DigiContext';

const DashboardPart = () => {
  const { dashState, toggleMainDashDropdown, dropdownOpen, layoutPosition, mainDashboardRef } = useContext(DigiContext);
  const { isMainDropdownOpen } = dashState;

  // Get user role from cookies
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const roleFromCookie = Cookies.get("user_role");
    if (roleFromCookie) {
      setUserRole(roleFromCookie.toLowerCase()); // Normalize role case
    }
  }, []);

  return (
    <li className='sidebar-item open' ref={layoutPosition.horizontal ? mainDashboardRef : null}>
      <Link
        role="button"
        className={`sidebar-link-group-title has-sub ${isMainDropdownOpen ? 'show' : ''}`}
        onClick={toggleMainDashDropdown}
      >
        Dashboard
      </Link>
      <ul className={`sidebar-link-group ${layoutPosition.horizontal ? (dropdownOpen.dashboard ? 'd-block' : '') : (isMainDropdownOpen ? 'd-none' : '')}`}>
        
        {/* Only SUPER_ADMIN and ADMIN can see the Admin Dashboard */}
        {(userRole === "super_admin" || userRole === "admin") && (
          <li className="sidebar-dropdown-item">
            <NavLink to="/dash" className="sidebar-link">
              <span className="nav-icon">
                <i className="fa-light fa-cart-shopping-fast"></i>
              </span>{' '}
              <span className="sidebar-txt">Overview</span>
            </NavLink>
          </li>
        )}

        {/* Only STAFF can see the HRM Dashboard */}
        {userRole === "staff" && (
          <li className="sidebar-dropdown-item">
            <NavLink to="/hrmDashboard" className="sidebar-link">
              <span className="nav-icon">
                <i className="fa-light fa-user-headset"></i>
              </span>{' '}
              <span className="sidebar-txt">Accountant</span>
            </NavLink>
          </li>
        )}

      </ul>
    </li>
  );
};

export default DashboardPart;
