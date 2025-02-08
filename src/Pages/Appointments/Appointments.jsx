import React, { useState, useEffect} from "react";
import Style from "./Appointments.module.css";
import { useTranslation } from "react-i18next";
export default function Appointments() {
  const { t } = useTranslation();
  return (
    <>
     <h2 className={Style.text}>{t("Appointments")}</h2>
    </>
  );
}
