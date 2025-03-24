import React, { useState, useEffect } from "react";
import Style from "./Departments.module.css";
export default function Departments() {
  return (
    <>
      <div className="text-center ">
        <h1 className="inline-block border text-xl font-semibold rounded-full border-[#3454c1] py-1 px-4 text-[#3454c1]">
          Departments
        </h1>
        <p className="text-xl font-medium text-black mt-3 tracking-wide">Here is all Departments</p>
      </div>
    </>
  );
}
