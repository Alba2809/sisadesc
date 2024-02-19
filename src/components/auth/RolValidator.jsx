import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@context/AuthContext";

function RolValidator({ rolRoute }) {
    const {user} = useAuth();

    if (user.role.name !== rolRoute) return <Navigate to="/" />;

    return <Outlet />;
}

export default RolValidator