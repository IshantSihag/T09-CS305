import React, { useState } from "react";

const InstituteLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = () => {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  };

  const handleLogin = () => {
    // Perform login logic here
    if (isValidEmail) {
      // Assuming you have a login function
      // You can replace the following with your actual login logic
      console.log("Institute Login with email:", email, "and password:", password);
    } else {
      console.error("Invalid email address");
    }
  };

  return (
    <div>
      <h2>Institute Login Page</h2>
      <div>
        <label>Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validateEmail}
        />
        {!isValidEmail && <p style={{ color: "red" }}>Invalid email address</p>}
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default InstituteLogin