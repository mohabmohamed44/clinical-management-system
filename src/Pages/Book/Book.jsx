import React, { useState, useEffect } from "react";
import Style from "./Book.module.css";
import MetaData from "../../Components/MetaData/MetaData";
export default function Book() {
  return (
    <>
      <MetaData
        title="Book an Appointment"
        description="Book an appointment with your preferred healthcare provider."
        keywords="book appointment, healthcare, medical services, schedule visit"
        author="Mohab Mohammed"
      />
      
    </>
  );
}
