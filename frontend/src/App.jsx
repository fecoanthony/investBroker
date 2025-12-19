import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import BlogDetail from "./pages/BlogDetail";

import AdminLayout from "./admin/layout/AdminLayout";
import AdminDashboard from "./admin/Dashboard/AdminDashboard";
import AdminPlansPage from "./admin/plans/AdminPlansPage";
import AdminTransactionsPage from "./admin/transactions/AdminTransactionsPage";
import AdminUsersPage from "./admin/users/AdminUsersPage";
import AdminInvestmentsPage from "./admin/investments/AdminInvestmentsPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import { useUserStore } from "./stores/useUserStore";
import { allPosts } from "./components/BlogSection";

const App = () => {
  const { user, getCurrentUser, checkingAuth } = useUserStore();

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog/:id" element={<BlogDetail posts={allPosts} />} />

        {/* Auth */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />

        {/* User Dashboard */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN (SINGLE SOURCE OF TRUTH) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route index element={<AdminDashboard />} />
          <Route path="plans" element={<AdminPlansPage />} />
          <Route path="investments" element={<AdminInvestmentsPage />} />
          <Route path="transactions" element={<AdminTransactionsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
