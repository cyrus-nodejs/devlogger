import { Navigate } from "react-router-dom";

import { useUser } from "../../context/UserContext";
const PrivateRoute = ({ children }:{ children: React.ReactNode }) => {
   

    const   {isAuthenticated, authUser} = useUser()

  return authUser && isAuthenticated ? children : <Navigate to="/auth" replace />;
};

export default PrivateRoute;