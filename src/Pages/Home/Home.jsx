import React, { useState, useEffect } from "react";
import Style from "./Home.module.css";
import MetaData from "../../Components/MetaData/MetaData";
import { useTranslation } from "react-i18next";
export default function Home() {
  const {t} = useTranslation();
  return (
    <>
      <MetaData
        title="Home"
        description="This is the home page"
        keywords="home, page, welcome"
        author="Mohab Mohammed" 
      />
      <h2 className="text-center text-2xl font-medium mt-6">{t("Home")}</h2>
    </>
  );
}
