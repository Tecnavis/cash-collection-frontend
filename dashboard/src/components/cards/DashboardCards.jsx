import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../../api";

const DashboardCards = () => {
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalSchemes, setTotalSchemes] = useState(0);
    const [weeklyCollection, setWeeklyCollection] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const token = Cookies.get("access_token");
                const response = await axios.get(`${BASE_URL}/partner/customers/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalCustomers(response.data.length);
            } catch (error) {
                console.error("Error fetching total customers:", error);
            }
        };

        const fetchSchemes = async () => {
            try {
                const token = Cookies.get("access_token");
                const response = await axios.get(`${BASE_URL}/cashcollection/schemes/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalSchemes(response.data.length);
            } catch (error) {
                console.error("Error fetching schemes:", error);
            }
        };

        const fetchTransactions = async () => {
            try {
                const token = Cookies.get("access_token");
                const response = await axios.get(`${BASE_URL}/cashcollection/cashcollection/bycustomer/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setTotalTransactions(response.data.length); // Count total transactions
            } catch (error) {
                console.error("Error fetching total transactions:", error);
            }
        };

        const fetchWeeklyCollection = async () => {
            try {
                const token = Cookies.get("access_token");
                const response = await axios.get(`${BASE_URL}/cashcollection/cashcollection/bycustomer/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Get today's date and calculate the date 7 days ago
                const today = new Date();
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(today.getDate() - 7);

                // Filter records from the last 7 days
                const weeklyData = response.data.filter((record) => {
                    const createdAt = new Date(record.created_at);
                    return createdAt >= sevenDaysAgo;
                });

                // Calculate the total amount
                const totalAmount = weeklyData.reduce((sum, record) => sum + parseFloat(record.amount), 0);
                setWeeklyCollection(totalAmount);
            } catch (error) {
                console.error("Error fetching weekly collection:", error);
            }
        };

        // Call all functions inside useEffect
        fetchCustomers();
        fetchSchemes();
        fetchTransactions();
        fetchWeeklyCollection();
    }, []);

    return (
        <div className="row mb-30">
            {/* Total Weekly Collection Card */}
            <div className="col-lg-3 col-6 col-xs-12">
               <div className="dashboard-top-box rounded-bottom panel-bg" style={{ backgroundColor: "#FFE5E5" }}>  {/* Light Red */}

                    <div className="left">
                        <h3>₹<CountUp end={weeklyCollection} decimals={2} /></h3>
                        <p>Weekly Collection</p>
                        <Link to="#">View details</Link>
                    </div>
                    <div className="right">
                        <div className="part-icon rounded">
                            <span><i className="fa-light fa-wallet"></i></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Transactions Card */}
            <div className="col-lg-3 col-6 col-xs-12">
                <div className="dashboard-top-box rounded-bottom panel-bg" style={{ backgroundColor: "#E5F4FF" }}>  {/* Light Blue */}

                    <div className="left">
                        <h3><CountUp end={totalTransactions} /></h3>
                        <p>Total Transactions</p>
                        <Link to="#">See details</Link>
                    </div>
                    <div className="right">
                        <div className="part-icon rounded">
                            <span><i className="fa-light fa-receipt"></i></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Customers Card */}
            <div className="col-lg-3 col-6 col-xs-12">
                <div className="dashboard-top-box rounded-bottom panel-bg" style={{ backgroundColor: "#E5FFE5" }}>  {/* Light Green */}

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

            {/* Total Schemes Card */}
            <div className="col-lg-3 col-6 col-xs-12">
                <div className="dashboard-top-box rounded-bottom panel-bg" style={{ backgroundColor: "#FFF5E5" }}>  {/* Light Orange */}

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
