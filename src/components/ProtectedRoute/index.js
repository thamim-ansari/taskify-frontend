import { Navigate } from "react-router-dom";
import Cookie from "js-cookie";

// A component to protect routes by checking for a valid JWT token
const ProtectedRoute = ({ element }) => {
  // Get the JWT token from cookies
  const token = Cookie.get("jwt_token");

  // If no token is found, redirect to the login page
  if (token === undefined) {
    return <Navigate to="/login" />;
  }

  // If a token is present, render the requested element (protected route)
  return element;
};

export default ProtectedRoute;
