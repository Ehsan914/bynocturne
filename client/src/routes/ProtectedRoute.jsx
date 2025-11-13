import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    // Show nothing while checking authentication
    if (loading) {
        return <div>Loading...</div>;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the protected component
    return children;
}

export default ProtectedRoute