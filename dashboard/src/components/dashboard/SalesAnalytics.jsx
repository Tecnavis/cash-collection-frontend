import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";

const cardData = [
  {
    to: "/collections",
    icon: "fas fa-chart-line",
    label: "Collection Reports",
    bgColor: "		#F6C1C1"
  },
  {
    to: "/customertransaction",
    icon: "fas fa-users",
    label: "Customerwise Reports",
    bgColor: "	#CBC3E3"
  },
  {
    to: "/transactions",
    icon: "fas fa-exchange-alt",
    label: "Transaction Reports",
    bgColor: "	#3B9AE1"
  },
  {
    to: "/category",
    icon: "fas fa-tags",
    label: "Schemes",
    bgColor: "	#9D75CB"
  },
  {
    to: "/customerscheme",
    icon: "fas fa-user-tag",
    label: "Schemes By Customer",
    bgColor: " #B5D0EB"
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
    bgColor: "	#4ABDAC"
  },
  {
    to: "/allCollectionCustomer",
    icon: "fas fa-users",
    label: "Customers",
    bgColor: " #E9C46A"
  },
];

// const adminCardData = [
//   {
//     to: "/allAdmin",
//     icon: "fas fa-user-shield",
//     label: "Admins",
//     bgColor: "#E5E5FF"
//   },
//   {
//     to: "/allAdmin",
//     icon: "fas fa-user-crown",
//     label: "Main Admins",
//     bgColor: "#FFE5F1"
//   }
// ];

const SalesAnalytics = () => {
  const userRole = Cookies.get("user_role") || "";
  const allCards = [...cardData];

//   if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
//     allCards.push(adminCardData[0]);
//   }
//   if (userRole === "SUPER_ADMIN") {
//     allCards.push(adminCardData[1]);
//   }

  return (
    <div className="row">
      {allCards.map((card, index) => (
        <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
          <div
            className="dashboard-top-box rounded-bottom panel-bg d-flex justify-content-between align-items-center p-3"
            style={{ backgroundColor: card.bgColor, minHeight: '120px' }}
          >
            <div className="left">
              <h5 className="mb-1">{card.label}</h5>
              <Link to={card.to} className="text-decoration-underline small text-dark">
                View details
              </Link>
            </div>
            <div className="right">
              <div className="part-icon rounded bg-white p-2">
                <span><i className={`${card.icon} fa-lg text-primary`}></i></span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalesAnalytics;
