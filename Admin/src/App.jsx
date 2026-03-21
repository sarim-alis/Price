import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Layout from "./Components/Layout/Layout";
import { isLoggedIn } from "./services/auth";
import Seller from "./pages/Seller";

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/admin/login" replace />;
}
function PublicRoute({ children }) {
  return isLoggedIn() ? <Navigate to="/admin/dashboard" replace /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login"     element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/admin/register"  element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/admin/sellers"   element={<ProtectedRoute><Layout><Seller /></Layout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
