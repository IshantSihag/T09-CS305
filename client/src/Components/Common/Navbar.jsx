import React , { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const Navbar = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [access, setAccess] = useState(false);

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
                    <a href="http://localhost:3000/institute" class="navbar-brand">
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
                  <div class="d-flex">
                    <a href="/student/login" class="btn btn-outline-success me-2">Student Login</a>
                    <a href="/student/signup" class="btn btn-outline-success me-2">Student SignUp</a>
                    <a href="/institution/login" class="btn btn-outline-success me-2">Institution Login</a>
                    <a href="/institution/signup" class="btn btn-outline-success">Institution SignUp</a>
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