import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const navigate=useNavigate()
    return (
        <div>
            <button onClick={()=>navigate('/student/login')}>Student Login</button>
            <button onClick={()=>navigate('/student/signup')}>Student SignUp</button>
            <button onClick={()=>navigate('/institution/login')}>Institution Login</button>
            <button onClick={()=>navigate('/institution/signup')}>Institution SignUp</button>
        </div>
    )
}

export default Navbar