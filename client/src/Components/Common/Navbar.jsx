import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const navigate=useNavigate()
    return (
        <div>
        <div>
          <nav class="navbar navbar-dark bg-dark border-bottom border-body">
            <div class="container-fluid">
              <a href="http://localhost:3000/" class="navbar-brand">
                Procortex
              </a>
              <div class="d-flex">
                <a href="/student/login" class="btn btn-outline-success me-2">Student Login</a>
                <a href="/student/signup" class="btn btn-outline-success me-2">Student SignUp</a>
                <a href="/institution/login" class="btn btn-outline-success me-2">Institution Login</a>
                <a href="/institution/signup" class="btn btn-outline-success">Institution SignUp</a>
              </div>
            </div>
          </nav>
        </div>
      </div>
      
    )
}

export default Navbar