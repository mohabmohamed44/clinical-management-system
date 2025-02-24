import React from "react";
import { Navigate } from "react-router-dom";
import Style from "./ProtectedRoute.module.css";
import Cookies from 'js-cookie';
export default function ProtectedRoute({ children }) {
  // If token exists, render children
  // If no token, redirect to login
  return Cookies.get("token") ? children : <Navigate to={"/login"} />;
}