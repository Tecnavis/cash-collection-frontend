import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";

const cardData = [
  {
    to: "/collections",
    icon: "fas fa-chart-line",
    label: "Collection Reports",
    bgColor: "#F6C1C1"
  },
  {
    to: "/customertransaction",
    icon: "fas fa-users",
    label: "Customerwise Reports",
    bgColor: "#CBC3E3"
  },
  {
    to: "/transactions",
    icon: "fas fa-exchange-alt",
    label: "Transaction Reports",
    bgColor: "#3B9AE1"
  },
  {
    to: "/category",
    icon: "fas fa-tags",
    label: "Schemes",
    bgColor: "#9D75CB"
  },
  {
    to: "/customerscheme",
    icon: "fas fa-user-tag",
    label: "Schemes By Customer",
    bgColor: "#B5D0EB"
  },
  {
    to: "/collectionplan",
    icon: "fas fa-wallet",
    label: "Collection Plan",
    bgColor: "#FFDADA"
  },
  {
    to: "/allCustomer",
    icon: "fas fa-user-friends",
    label: "Agents",
    bgColor: "#4ABDAC"
  },
  {
    to: "/allCollectionCustomer",
    icon: "fas fa-users",
    label: "Customers",
    bgColor: "#E9C46A"
  },
];

const SalesAnalytics = () => {
  const userRole = Cookies.get("user_role") || "";
  const allCards = [...cardData];

  return (
    <div className="row">
      {allCards.map((card, index) => (
        <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4">
          <div
            className="dashboard-top-box rounded panel-bg d-flex justify-content-between align-items-center p-3 shadow"
            style={{ backgroundColor: card.bgColor, minHeight: '120px' }}
          >
            <div className="left text-white">
              <h6 className="mb-2">{card.label}</h6>
              <Link to={card.to} className="text-decoration-underline small text-white">
                View details
              </Link>
            </div>
            <div className="right">
              <div className="rounded-circle bg-white p-3 d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                <i className={`${card.icon} fa-lg text-primary`}></i>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalesAnalytics;
