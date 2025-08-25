import { Navigate } from "react-router-dom";

function PrivateRoute({ user, role, children }) {
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
