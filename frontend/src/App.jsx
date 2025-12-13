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
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />

        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog/:id" element={<BlogDetail posts={allPosts} />} />

        {/* Admin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* User */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
