import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState } from "react";

import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart";
import Preview from "./pages/Preview";
import Suggest from "./pages/Suggest";
import AdminLogin from "./pages/AdminLogin";
import Manage from "./pages/Manage";
import ViewPurchase from "./pages/ViewPurchase";
import ViewSuggest from "./pages/ViewSuggest";
import Items from "./pages/Items";
import GroupPurchase from "./pages/GroupPurchase";

const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    purpose: "",
    department: "",
  });

  const [cartItems, setCartItems] = useState([]);

  return (
    <div className="relative min-h-screen w-full">
      <Routes>
        <Route path="/" element={<Cart />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/suggest" element={<Suggest />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/manage-department"
          element={
            <ProtectedRoute>
              <Manage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-pr"
          element={
            <ProtectedRoute>
              <ViewPurchase />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-suggestion"
          element={
            <ProtectedRoute>
              <ViewSuggest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <Items />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group-purchase"
          element={
            <ProtectedRoute>
              <GroupPurchase />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
};

export default App;
