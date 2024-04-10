import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownButton, Dropdown } from 'react-bootstrap';
import Cookies from 'js-cookie';
import './Navbar.css';

const Navbar = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [access, setAccess] = useState(false);
    const [showStudentDropdown, setShowStudentDropdown] = useState(false);
    const [showInstitutionDropdown, setShowInstitutionDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const name = Cookies.get('name');
        const type = Cookies.get('type');
        const access = Cookies.get('access');
        if (name && type && access) {
            setName(name);
            setType(type);
            setAccess(true);
        }
    }, [])

    const handleLogout = async () => {
        try {
            const refresh = Cookies.get('refresh');
            const access = Cookies.get('access');

            const sendFormData = new FormData();
            sendFormData.append('refresh', refresh);

            const response = await fetch('http://127.0.0.1:8000/logout/', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${access}`
                },
                body: sendFormData
            });

            if (response.ok) {
                Cookies.remove('access');
                Cookies.remove('refresh');
                Cookies.remove('type');
                Cookies.remove('name');
                setType('');
                navigate('/');
            } else {
                console.log("Logout Failed Please try again");
            }
        } catch (err) {
            console.log("Error in Logout, Please try again");
        }
    }

    return (
        <div>
            <nav className="navbar navbar-dark bg-dark border-bottom border-body">
                <div className="container-fluid">
                    <a href="http://localhost:3000/" className="navbar-brand">
              </a>
              {
                type==='institute'?(
                  <div>
                    <a href="http://localhost:3000/institution" class="navbar-brand">
                      Institute
                    </a>
                    <button onClick={handleLogout} class="navbar-brand">LOGOUT</button>
                  </div>
                ):
                type==='student'?(
                    <div>
                    <a href="http://localhost:3000/student" class="navbar-brand">
                      Student
                    </a>
                    {
                        type === 'institute' ? (
                            <div>
                                <button onClick={() => navigate('/institution/')} className="navbar-brand dashboard-button">Dashboard</button>
                                <button onClick={handleLogout} className="navbar-brand logout-button">LOGOUT</button>
                            </div>
                        ) : type === 'student' ? (
                            <div>
                                <button onClick={() => navigate('/student/')} className="navbar-brand dashboard-button">Dashboard</button>
                                <button onClick={handleLogout} className="navbar-brand logout-button">LOGOUT</button>
                            </div>
                        ) : (
                            <div className="d-flex">
                                <DropdownButton
                                    variant="outline-info"
                                    title="Student"
                                    className="me-2"
                                    onMouseEnter={() => setShowStudentDropdown(true)}
                                    onMouseLeave={() => setShowStudentDropdown(false)}
                                    show={showStudentDropdown}
                                >
                                    <Dropdown.Item href="/student/login" style={{ color: '#17a2b8' }}>Login</Dropdown.Item>
                                    <Dropdown.Item href="/student/signup" style={{ color: '#17a2b8' }}>SignUp</Dropdown.Item>
                                </DropdownButton>

                                <DropdownButton
                                    variant="outline-info"
                                    title="Institution"
                                    onMouseEnter={() => setShowInstitutionDropdown(true)}
                                    onMouseLeave={() => setShowInstitutionDropdown(false)}
                                    show={showInstitutionDropdown}
                                >
                                    <Dropdown.Item href="/institution/login" style={{ color: '#17a2b8' }}>Login</Dropdown.Item>
                                    <Dropdown.Item href="/institution/signup" style={{ color: '#17a2b8' }}>SignUp</Dropdown.Item>
                                </DropdownButton>
                            </div>
                        )
                    }
                </div>
            </nav>
        </div>
    )
}

export default Navbar;
