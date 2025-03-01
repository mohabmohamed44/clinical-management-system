import React, { useState, useEffect} from "react";
import Style from "./About.module.css";
import MetaData from "../../Components/MetaData/MetaData";
import { useTranslation } from "react-i18next";
export default function About() {
  const {t} = useTranslation();
  return (
    <>
     <MetaData 
      title="about"
      description="about"
      keywords="about, our services"
      author="Mohab Mohammed"
      />
      <h2>{t("About")}</h2>
    </>
  );
}
