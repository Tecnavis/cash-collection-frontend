import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../api";
import Cookies from 'js-cookie';

const UserInformation = () => {
    const [dropdownBtnOpen, setDropdownBtnOpen] = useState(false);
    const [user, setUser] = useState(null);

    const handleDropdownBtn = () => {
        setDropdownBtnOpen(!dropdownBtnOpen);
    };
    
    const headerRef = useRef(null);

    const handleOutsideClick = (event) => {
        if (headerRef.current && !headerRef.current.contains(event.target)) {
            setDropdownBtnOpen(false);
        }
    };
    
    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = Cookies.get('access_token'); 
                const response = await axios.get(`${BASE_URL}/users/users/`, {
                
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    return (
        <div className="panel">
            <div className="panel-body">
                <div className="profile-sidebar">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="profile-sidebar-title">User Information</h5>
                        {/* <div className="dropdown" ref={headerRef}>
                            <button className="btn btn-sm btn-icon btn-outline-primary" onClick={handleDropdownBtn}>
                                <i className="fa-solid fa-ellipsis"></i>
                            </button>
                            <ul className={`dropdown-menu dropdown-menu-sm dropdown-menu-sm-end ${dropdownBtnOpen ? 'show' : ''}`}>
                                <li><Link className="dropdown-item" to="/editProfile"><i className="fa-regular fa-pen-to-square"></i> Edit Information</Link></li>
                            </ul>
                        </div> */}
                    </div>
                    {user ? (
                        <>
                            <div className="top">
                                <div className="image-wrap">
                                    <div className="part-img rounded-circle overflow-hidden">
                                        <img src={user.photo || "assets/images/admin.png"} alt="user" />
                                    </div>
                                    <button className="image-change"><i className="fa-light fa-camera"></i></button>
                                </div>
                                <div className="part-txt">
                                    <h4 className="admin-name">{user.username}</h4>
                                    <span className="admin-role">{user.role || "User"}</span>
                                </div>
                            </div>
                            <div className="bottom">
                                <h6 className="profile-sidebar-subtitle">Communication Info</h6>
                                <ul>
                                    <li><span>Username:</span> {user.username}</li>
                                    <li><span>Email:</span> {user.email}</li>
                                    <li><span>Contact Number:</span> {user.contact_number || 'N/A'}</li>
                                    <li><span>Employee ID:</span> {user.id || 'N/A'}</li>
                                    <li><span>Role:</span> {user.role || 'N/A'}</li>
                                    <li><span>Joining Date:</span> {new Date(user.date_joined).toLocaleDateString()}</li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <p>Loading user data...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserInformation;
