import { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Importing page components for routing
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";

// Importing ProtectedRoute component to handle protected routes
import ProtectedRoute from "./components/ProtectedRoute";

// Importing UserContext to manage user state globally
import UserContext from "./context/UserContext";

import "./App.css";

function App() {
  // State to hold user profile data
  const [userProfileData, setUserProfileData] = useState({});

  // Function to update user profile data
  const addUserProfileData = (data) => {
    setUserProfileData(data);
  };

  return (
    // Providing userProfileData and setter function to the context
    <UserContext.Provider
      value={{ userProfileData, setUserProfileData: addUserProfileData }}
    >
      {/* Defining routes for the application */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protected routes that require user to be authenticated */}
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/tasks" element={<ProtectedRoute element={<Tasks />} />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
