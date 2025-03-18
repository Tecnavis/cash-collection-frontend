import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Cookies from "js-cookie";

const AppsPart = () => {
  const userRole = Cookies.get("user_role") || "";

  const [dropdownState, setDropdownState] = useState({
    isMainDropdownOpen: false,
    isCrmDropdownOpen: false,
    isCrmCollectionDropdownOpen: false,
    isHrmDropdownOpen: false,
    isAccountsDropdownOpen: false,
    isEcommerceDropdownOpen: false,
    isSchemeDropdownOpen: false,
    isSubDropdownOpen: false
  });

  const toggleDropdown = (key) => {
    setDropdownState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <li className="sidebar-item">
      <Link
        role="button"
        className={`sidebar-link-group-title has-sub ${dropdownState.isMainDropdownOpen ? 'show' : ''}`}
        onClick={() => toggleDropdown("isMainDropdownOpen")}
      >
        Apps
      </Link>

      <ul className={`sidebar-link-group ${dropdownState.isMainDropdownOpen ? 'd-block' : 'd-none'}`}>
        {/* Financials */}
        <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${dropdownState.isCrmDropdownOpen ? 'show' : ''}`}
            onClick={() => toggleDropdown("isCrmDropdownOpen")}
          >
            <span className="nav-icon"><i className="fa-light fa-user-headset"></i></span>
            <span className="sidebar-txt">Financials</span>
          </Link>
          <ul className={`sidebar-dropdown-menu ${dropdownState.isCrmDropdownOpen ? 'd-block' : 'd-none'}`}>
            <li className="sidebar-dropdown-item">
              <NavLink to="/allSales" className="sidebar-link">Transaction Reports</NavLink>
            </li>
            {/* <li className="sidebar-dropdown-item">
              <NavLink to="/allPurchase" className="sidebar-link">Planwise Reports</NavLink>
            </li> */}
          </ul>
        </li>

        {/*   scheme */}
        <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${dropdownState.isEcommerceDropdownOpen ? 'show' : ''}`}
            onClick={() => toggleDropdown("isEcommerceDropdownOpen")}
          >
            <span className="nav-icon"><i className="fa-light fa-cart-shopping-fast"></i></span>
            <span className="sidebar-txt">Schemes</span>
          </Link>
          <ul className={`sidebar-dropdown-menu ${dropdownState.isEcommerceDropdownOpen ? 'd-block' : 'd-none'}`}>
            <li className="sidebar-dropdown-item">
              <NavLink to="/category" className="sidebar-link">Schemes</NavLink>
            </li>
          </ul>
        </li>

         {/* scheme by customer */}
         <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${dropdownState.isSchemeDropdownOpen ? 'show' : ''}`}
            onClick={() => toggleDropdown("isSchemeDropdownOpen")}
          >
            <span className="nav-icon"><i className="fa-light fa-cart-shopping-fast"></i></span>
            <span className="sidebar-txt">SchemeByCustomer</span>
          </Link>
          <ul className={`sidebar-dropdown-menu ${dropdownState.isSchemeDropdownOpen ? 'd-block' : 'd-none'}`}>
            <li className="sidebar-dropdown-item">
              <NavLink to="/customerscheme" className="sidebar-link">Schemes By Customer</NavLink>
            </li>
          </ul>
        </li>


        {/* Collection Scheme */}
        <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${dropdownState.isCrmCollectionDropdownOpen ? 'show' : ''}`}
            onClick={() => toggleDropdown("isCrmCollectionDropdownOpen")}
          >
            <span className="nav-icon"><i className="fa-light fa-user-headset"></i></span>
            <span className="sidebar-txt">Collections</span>
          </Link>
          <ul className={`sidebar-dropdown-menu ${dropdownState.isCrmCollectionDropdownOpen ? 'd-block' : 'd-none'}`}>
            <li className="sidebar-dropdown-item"><NavLink to="/collectionplan" className="sidebar-link">Collection Plan</NavLink></li>
          </ul>
        </li>

        {/* HRM */}
        <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${dropdownState.isHrmDropdownOpen ? 'show' : ''}`}
            onClick={() => toggleDropdown("isHrmDropdownOpen")}
          >
            <span className="nav-icon"><i className="fa-light fa-user-tie"></i></span>
            <span className="sidebar-txt">HRM</span>
          </Link>
          <ul className={`sidebar-dropdown-menu ${dropdownState.isHrmDropdownOpen ? 'd-block' : 'd-none'}`}>
            <li className="sidebar-dropdown-item"><NavLink to="/allCustomer" className="sidebar-link">Agents</NavLink></li>
            <li className="sidebar-dropdown-item"><NavLink to="/allCollectionCustomer" className="sidebar-link">Customers</NavLink></li>
            {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
              <li className="sidebar-dropdown-item"><NavLink to="/allEmployee" className="sidebar-link">Admins</NavLink></li>
            )}
            {userRole === "SUPER_ADMIN" && (
              <li className="sidebar-dropdown-item"><NavLink to="/allAdmin" className="sidebar-link">Main Admins</NavLink></li>
            )}
          </ul>
        </li>
      </ul>
    </li>
  );
};

export default AppsPart;
