import React from "react";
import Login from "./Login";         // Your login form
import SignInSide from "./SignInSide"; // Description component
import "./LoginPage.css";            // Optional: for styling side-by-side

const LoginPage = ({ setUser }) => {
  return (
    <div className="login-page-container">
      <div className="description-section">
        <SignInSide />
      </div>
      <div className="form-section">
        <Login setUser={setUser} />
      </div>
    </div>
  );
};

export default LoginPage;
