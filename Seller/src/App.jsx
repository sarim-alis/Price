import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import { isLoggedIn } from "./services/auth";

// Protected Route.
function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/seller/login" replace />;
}

// Public Route (redirect if logged in).
function PublicRoute({ children }) {
  return isLoggedIn() ? <Navigate to="/seller/dashboard" replace /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/seller/login" replace />} />
        <Route path="/seller/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/seller/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/seller/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/seller/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
