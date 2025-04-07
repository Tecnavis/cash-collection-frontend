import React from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from "js-cookie";

const AppsPart = () => {
  const userRole = Cookies.get("user_role") || "";

  return (
    <li className="sidebar-item">
      <ul className="sidebar-link-group d-block">
        {/* Financials */}
        <li className="sidebar-dropdown-item">
          <NavLink to="/collectionprogress" className="sidebar-link"> 
            <i className="fas fa-clipboard-list"></i> Collection Progress Report
          </NavLink>
        </li>

        <li className="sidebar-dropdown-item">
          <NavLink to="/collections" className="sidebar-link">
            <i className="fas fa-chart-line"></i> Scheme Customer Reports
          </NavLink>
        </li>

        <li className="sidebar-dropdown-item">
          <NavLink to="/customertransaction" className="sidebar-link">
            <i className="fas fa-users"></i> Customerwise Reports
          </NavLink>
        </li>

        <li className="sidebar-dropdown-item">
          <NavLink to="/transactions" className="sidebar-link">
            <i className="fas fa-exchange-alt"></i> Transaction Reports
          </NavLink>
        </li>

        {/* Schemes */}
        <li className="sidebar-dropdown-item">
          <NavLink to="/category" className="sidebar-link">
            <i className="fas fa-tags"></i> Schemes
          </NavLink>
        </li>

        {/* Scheme By Customer */}
        <li className="sidebar-dropdown-item">
          <NavLink to="/customerscheme" className="sidebar-link">
            <i className="fas fa-user-tag"></i> Schemes By Customer
          </NavLink>
        </li>

        {/* Collection Scheme */}
        <li className="sidebar-dropdown-item">
          <NavLink to="/collectionplan" className="sidebar-link">
            <i className="fas fa-wallet"></i> Collection Plan
          </NavLink>
        </li>

        {/* HRM */}
        <li className="sidebar-dropdown-item">
          <NavLink to="/allCustomer" className="sidebar-link">
            <i className="fas fa-user-friends"></i> Agents
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink to="/allCollectionCustomer" className="sidebar-link">
            <i className="fas fa-users"></i> Customers
          </NavLink>
        </li>
        {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
          <li className="sidebar-dropdown-item">
            <NavLink to="/allAdmin" className="sidebar-link">
              <i className="fas fa-user-shield"></i> Admins
            </NavLink>
          </li>
        )}
        {userRole === "SUPER_ADMIN" && (
          <li className="sidebar-dropdown-item">
            <NavLink to="/allAdmin" className="sidebar-link">
              <i className="fas fa-user-crown"></i> Main Admins
            </NavLink>
          </li>
        )}
      </ul>
    </li>
  );
};

export default AppsPart;


