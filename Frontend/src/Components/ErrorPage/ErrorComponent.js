import React from "react";
import "./ErrorPage.css";
import { useNavigate } from "react-router-dom";
const ErrorComponent = () => {
  const navigate = useNavigate();

   const handleNavigateHome = () => {
     navigate("/"); 
   };
  return (
    <div className="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred..</p>
      <span>
        Go back to <button onClick={handleNavigateHome} >Home</button>
      </span>
    </div>
  );
};

export default ErrorComponent;
