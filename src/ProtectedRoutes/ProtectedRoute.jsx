import { use } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {                                   
    const {user, isLoading} = use(AuthContext)

    if(isLoading) {
        return <span>Loading...</span>
    }

    if(!user) {
        return <Navigate state={location?.pathname} to='/login'></Navigate>
    }

    return children
};

export default ProtectedRoute;