import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/redux.ts"; // Adjust path to your hooks

interface ProtectedRouteProps {
    redirectPath?: string;
}

const ProtectedRoute = ({ redirectPath = "/" }: ProtectedRouteProps) => {
    const user = useAppSelector((state) => state.authReducer.user);

    // If there is no logged-in user, redirect them to the home page or login screen
    if (!user) {
        return <Navigate to={redirectPath} replace />;
    }

    // If the user exists, render the nested child routes
    return <Outlet />;
};

export default ProtectedRoute;