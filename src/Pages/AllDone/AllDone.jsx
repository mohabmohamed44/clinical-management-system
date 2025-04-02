import React, { useState, useEffect } from "react";
import Style from "./AllDone.module.css";
import Success from '../../assets/Vector.webp';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function AllDone() {
  const {t} = useTranslation();
  return (
    <>
      <section className="container mx-auto pb-30 flex flex-col items-center justify-center h-screen text-center">
        <img loading="lazy" src={Success} className="w-25 h-25" alt="Success"/>
        <h2 className={Style.text_center}>{t("AllDone")}</h2>
        <p className="font-semibold text-gray-500 text-xl">
          {t("ResetPasswordMessage")}
        </p>
        <Link to="/login" className="w-1/3 text-white bg-[#11319e] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-3 text-center mt-4">
          {t("GoToLogin")}
        </Link>
      </section>
    </>
  );
}
