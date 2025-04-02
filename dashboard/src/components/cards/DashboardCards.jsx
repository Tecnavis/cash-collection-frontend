import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const DashboardCards = () => {
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalSchemes, setTotalSchemes] = useState(0);  // New state for schemes
    const BASE_URL = "https://paycollection.onrender.com/api/v1";

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const token = Cookies.get("access_token");
                const response = await axios.get(`${BASE_URL}/partner/customers/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Total customers from API:", response.data.length);
                setTotalCustomers(response.data.length);
            } catch (error) {
                console.error("Error fetching total customers:", error);
            }
        };

        const fetchSchemes = async () => {
            try {
                const token = Cookies.get("access_token");  
                const response = await axios.get(`${BASE_URL}/cashcollection/schemes/`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Total schemes from API:", response.data.length);
                setTotalSchemes(response.data.length);  // Store total schemes count
            } catch (error) {
                console.error("Error fetching schemes:", error);
            }
        };

        fetchCustomers();
        fetchSchemes();
    }, []);

    return (
        <div className="row mb-30">
            {/* Earnings Card */}
            <div className="col-lg-3 col-6 col-xs-12">
                <div className="dashboard-top-box rounded-bottom panel-bg">
                    <div className="left">
                        <h3>$<CountUp end={34152} /></h3>
                        <p>Shipping fees are not</p>
                        <Link to="#">View net earnings</Link>
                    </div>
                    <div className="right">
                        <span className="text-primary">+16.24%</span>
                        <div className="part-icon rounded">
                            <span><i className="fa-light fa-dollar-sign"></i></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Card */}
            <div className="col-lg-3 col-6 col-xs-12">
                <div className="dashboard-top-box rounded-bottom panel-bg">
                    <div className="left">
                        <h3><CountUp end={36894} /></h3>
                        <p>Orders</p>
                        <Link to="#">Excluding orders in transit</Link>
                    </div>
                    <div className="right">
                        <span className="text-primary">+16.24%</span>
                        <div className="part-icon rounded">
                            <span><i className="fa-light fa-bag-shopping"></i></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Customers Card */}
            <div className="col-lg-3 col-6 col-xs-12">
                <div className="dashboard-top-box rounded-bottom panel-bg">
                    <div className="left">
                        <h3><CountUp end={totalCustomers} /></h3>
                        <p>Total Customers</p>
                        <Link to="#">See details</Link>
                    </div>
                    <div className="right">
                        <div className="part-icon rounded">
                            <span><i className="fa-light fa-user"></i></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Balance Card */}
            <div className="col-lg-3 col-6 col-xs-12">
                <div className="dashboard-top-box rounded-bottom panel-bg">
                    <div className="left">
                        <h3>$<CountUp end={724152} /></h3>
                        <p>My Balance</p>
                        <Link to="#">Withdraw</Link>
                    </div>
                    <div className="right">
                        <span className="text-primary">+16.24%</span>
                        <div className="part-icon rounded">
                            <span><i className="fa-light fa-credit-card"></i></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔥 Total Schemes Card */}
            <div className="col-lg-3 col-6 col-xs-12">
                <div className="dashboard-top-box rounded-bottom panel-bg">
                    <div className="left">
                        <h3><CountUp end={totalSchemes} /></h3>
                        <p>Total Schemes</p>
                        <Link to="#">View schemes</Link>
                    </div>
                    <div className="right">
                        <div className="part-icon rounded">
                            <span><i className="fa-light fa-chart-bar"></i></span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DashboardCards;
