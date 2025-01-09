import React from "react";
import { Navigate } from "react-router-dom";

// Example: Mock authentication function (you can replace it with your actual logic)
const getUserRole = () => {
    // This should return the current user's role, e.g., 'admin' or 'staff'
    return localStorage.getItem("userRole"); // Example: Fetch from localStorage
};

const ProtectedRoute = ({ role, children }) => {
    const userRole = getUserRole();

    // Check if the user has the required role
    if (userRole === role) {
        return children;
    }

    // Redirect if the user doesn't have the required role
    return <Navigate to="/" replace />;
};

export default ProtectedRoute;
