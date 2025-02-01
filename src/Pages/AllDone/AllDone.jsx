import React, { useState, useEffect } from "react";
import Style from "./AllDone.module.css";
import Success from '../../assets/Vector.png';
import { Link } from "react-router-dom";
export default function AllDone() {
  return (
    <>
      <div className="container mx-auto pb-30 flex flex-col items-center justify-center h-screen text-center">
        <img src={Success} className="w-25 h-25" alt="Success"/>
        <h2 className={Style.text_center}>All Done</h2>
        <p className="font-semibold text-gray-500 text-xl">
          Your Password has been reset Successfully.
        </p>
        <Link to="/login" className="w-1/3 text-white bg-[#11319e] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-3 text-center mt-4">
          Go to Login
        </Link>
      </div>
    </>
  );
}
