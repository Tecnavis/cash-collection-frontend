// import React, { useState, useEffect, useContext } from 'react';
// import { NavLink, Link } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import { DigiContext } from '../../context/DigiContext';

// const DashboardPart = () => {
//   const { dashState, toggleMainDashDropdown, dropdownOpen, layoutPosition, mainDashboardRef } = useContext(DigiContext);
//   const { isMainDropdownOpen } = dashState;

//   // Get user role from cookies
//   const [userRole, setUserRole] = useState("");

//   useEffect(() => {
//     const roleFromCookie = Cookies.get("user_role");
//     if (roleFromCookie) {
//       setUserRole(roleFromCookie.toLowerCase()); 
//     }
//   }, []);

//   return (
//     <li className='sidebar-item open' ref={layoutPosition.horizontal ? mainDashboardRef : null}>
//       <Link
//         role="button"
//         className={`sidebar-link-group-title has-sub ${isMainDropdownOpen ? 'show' : ''}`}
//         onClick={toggleMainDashDropdown}
//       >
//         Dashboard
//       </Link>
//       <ul className={`sidebar-link-group ${layoutPosition.horizontal ? (dropdownOpen.dashboard ? 'd-block' : '') : (isMainDropdownOpen ? 'd-none' : '')}`}>
        
//         {/* Only SUPER_ADMIN and ADMIN can see the Admin Dashboard */}
//         {(userRole === "super_admin" || userRole === "admin") && (
//           <li className="sidebar-dropdown-item">
//             <NavLink to="/dash" className="sidebar-link">
//               <span className="nav-icon">
//                 <i className="fa-light fa-cart-shopping-fast"></i>
//               </span>{' '}
//               <span className="sidebar-txt">Overview</span>
//             </NavLink>
//           </li>
//         )}

//         {/* Only STAFF can see the HRM Dashboard */}
//         {userRole === "staff" && (
//           <li className="sidebar-dropdown-item">
//             <NavLink to="/hrmDashboard" className="sidebar-link">
//               <span className="nav-icon">
//                 <i className="fa-light fa-user-headset"></i>
//               </span>{' '}
//               <span className="sidebar-txt">Accountant</span>
//             </NavLink>
//           </li>
//         )}

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
      setUserRole(roleFromCookie.toLowerCase()); 
    }
  }, []);

  return (
    <li className='sidebar-item open' ref={layoutPosition.horizontal ? mainDashboardRef : null}>
      <Link
        role="button"
        className={`sidebar-link-group-title has-sub ${isMainDropdownOpen ? 'show' : ''}`}
        onClick={toggleMainDashDropdown}
      >
        <i className="fas fa-tachometer-alt"></i> Dashboard
      </Link>
      <ul className={`sidebar-link-group ${layoutPosition.horizontal ? (dropdownOpen.dashboard ? 'd-block' : '') : (isMainDropdownOpen ? 'd-none' : '')}`}>
        
        {/* Only SUPER_ADMIN and ADMIN can see the Admin Dashboard */}
        {(userRole === "super_admin" || userRole === "admin") && (
          <li className="sidebar-dropdown-item">
            <NavLink to="/dash" className="sidebar-link">
              <i className="fas fa-chart-pie"></i> Overview
            </NavLink>
          </li>
        )}

        {/* Only STAFF can see the HRM Dashboard */}
        {userRole === "staff" && (
          <li className="sidebar-dropdown-item">
            <NavLink to="/hrmDashboard" className="sidebar-link">
              <i className="fas fa-user-tie"></i> Accountant
            </NavLink>
          </li>
        )}

      </ul>
    </li>
  );
};

export default DashboardPart;
