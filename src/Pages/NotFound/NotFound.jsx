import React, { useState, useEffect } from "react";
import "./NotFound.module.css";
import MetaData from "../../Components/MetaData/MetaData";
import Error_404 from "../../assets/404.png";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <>
      <MetaData
        title="404 Not Found"
        description="This page is not found"
        keywords="404, not found, error"
        author="Mohab Mohammed"
      />
      <div className="container mx-auto pb-30 flex flex-col items-center justify-center h-screen text-center">
        <img
          src={Error_404}
          alt="Not found"
          className="w-1/2 max-w-md lg:max-w-lg"
        />
        <h1 className="text-3xl font-bold text-gray-800 mt-3">
          Oops! This page is not found
        </h1>
        <p className="text-gray-500 text-lg font-medium mt-2">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link to="/" className="text-white bg-[#11319e] px-4 py-3 rounded-md shadow-md mt-4">
          Go back to home
        </Link>
      </div>
    </>
  );
}
