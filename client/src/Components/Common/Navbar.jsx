import React , { useState , useEffect } from "react";
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

    useEffect(() => {
        const name = Cookies.get('name');
        const type = Cookies.get('type');
        const access = Cookies.get('access');
        if(name && type && access){
            setName(name);
            setType(type);
            setAccess(true);
        }
    },[])
    const navigate=useNavigate()

    const handleLogout = async() => {
      const data = {'refresh': Cookies.get('refresh')};
      const response = await fetch('http://127.0.0.1:8000/logout/', {
        headers: {
          'Authourization': 'Bearer '+Cookies.get('access')
        },
        method: "POST",
        body: data
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.delete('access');
        Cookies.delete('refresh');
        Cookies.delete('type');
        Cookies.delete('name');
        if (data.ok) {
          console.log("Login Successfully");   

          navigate("/");  
        } else {
          const errMsg = data?.error || "Error in Logout, Please try again";
          alert(errMsg);
          console.log(errMsg);
        }
      } else {
        console.log("Logout Failed Please try again");
      }
    }

    return (
        <div>
        <div>
          <nav class="navbar navbar-dark bg-dark border-bottom border-body">
            <div class="container-fluid">
              <a href="http://localhost:3000/" class="navbar-brand">
              </a>
              {
                type==='institute'?(
                  <div>
                    <a href="http://localhost:3000/institution" class="navbar-brand">
                      Institute
                    </a>
                    <a href="http://localhost:3000/institute/verify" class="navbar-brand">
                      Verify
                    </a>
                    <button onClick={handleLogout} class="navbar-brand">LOGOUT</button>
                  </div>
                ):
                type==='student'?(
                  <div>
                    <a href="http://localhost:3000/student" class="navbar-brand">
                      Student
                    </a>
                    <a href="http://localhost:3000/student/verify" class="navbar-brand">
                      Verify
                    </a>
                  </div>
                ):(
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
      </div>
      
    )
}

export default Navbar