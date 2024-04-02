import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@context/AuthContext";

function RolValidator({ rolRoute }) {
    const {user} = useAuth();

    /* rolRoute can be array or a string */
    if (Array.isArray(rolRoute)) {
        if (!rolRoute.includes(user.role.name)) return <Navigate to="/" />;
    }
    else if (typeof rolRoute === "string") {
        if (user.role.name !== rolRoute) return <Navigate to="/" />;
    }

    return <Outlet />;
}

export default RolValidator