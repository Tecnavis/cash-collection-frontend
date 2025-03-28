import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Cookies from "js-cookie";

const AppsPart = () => {
  const userRole = Cookies.get("user_role") || "";

  const [dropdownState, setDropdownState] = useState({
    isCrmDropdownOpen: true,
    isCrmCollectionDropdownOpen: true,
    isHrmDropdownOpen: true,
    isAccountsDropdownOpen: true,
    isEcommerceDropdownOpen: true,
    isSchemeDropdownOpen: true,
    isSubDropdownOpen: true
  });

  return (
    <li className="sidebar-item">
      <ul className="sidebar-link-group d-block">
        {/* Financials */}
        <li className="sidebar-dropdown-item">
          <Link role="button" className="sidebar-link has-sub show">
            <span className="nav-icon"><i className="fa-light fa-user-headset"></i></span>
            <span className="sidebar-txt">Financials</span>
          </Link>
          <ul className="sidebar-dropdown-menu d-block">
            <li className="sidebar-dropdown-item">
              <NavLink to="/collections" className="sidebar-link">Collection Reports</NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/customertransaction" className="sidebar-link">Customerwise Reports</NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/transactions" className="sidebar-link">Transaction Reports</NavLink>
            </li>
          </ul>
        </li>

        {/* Schemes */}
        <li className="sidebar-dropdown-item">
          <Link role="button" className="sidebar-link has-sub show">
            <span className="nav-icon"><i className="fa-light fa-cart-shopping-fast"></i></span>
            <span className="sidebar-txt">Schemes</span>
          </Link>
          <ul className="sidebar-dropdown-menu d-block">
            <li className="sidebar-dropdown-item">
              <NavLink to="/category" className="sidebar-link">Schemes</NavLink>
            </li>
          </ul>
        </li>

        {/* Scheme By Customer */}
        <li className="sidebar-dropdown-item">
          <Link role="button" className="sidebar-link has-sub show">
            <span className="nav-icon"><i className="fa-light fa-cart-shopping-fast"></i></span>
            <span className="sidebar-txt">SchemeByCustomer</span>
          </Link>
          <ul className="sidebar-dropdown-menu d-block">
            <li className="sidebar-dropdown-item">
              <NavLink to="/customerscheme" className="sidebar-link">Schemes By Customer</NavLink>
            </li>
          </ul>
        </li>

        {/* Collection Scheme */}
        <li className="sidebar-dropdown-item">
          <Link role="button" className="sidebar-link has-sub show">
            <span className="nav-icon"><i className="fa-light fa-user-headset"></i></span>
            <span className="sidebar-txt">Collections</span>
          </Link>
          <ul className="sidebar-dropdown-menu d-block">
            <li className="sidebar-dropdown-item"><NavLink to="/collectionplan" className="sidebar-link">Collection Plan</NavLink></li>
          </ul>
        </li>

        {/* HRM */}
        <li className="sidebar-dropdown-item">
          <Link role="button" className="sidebar-link has-sub show">
            <span className="nav-icon"><i className="fa-light fa-user-tie"></i></span>
            <span className="sidebar-txt">HRM</span>
          </Link>
          <ul className="sidebar-dropdown-menu d-block">
            <li className="sidebar-dropdown-item"><NavLink to="/allCustomer" className="sidebar-link">Agents</NavLink></li>
            <li className="sidebar-dropdown-item"><NavLink to="/allCollectionCustomer" className="sidebar-link">Customers</NavLink></li>
            {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
              <li className="sidebar-dropdown-item"><NavLink to="/allAdmin" className="sidebar-link">Admins</NavLink></li>
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