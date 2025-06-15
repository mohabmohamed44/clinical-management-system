import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../Config/Supabase";
import { DNA } from "react-loader-spinner";
import { Phone, MapPin } from "lucide-react";
import MetaData from "../../Components/MetaData/MetaData";
import { useTranslation } from "react-i18next";

const fetchLabDetails = async (id) => {
  // First check if the ID exists in LaboratoriesInfo
  const { data: infoData, error: infoError } = await supabase
    .from("LaboratoriesInfo")
    .select("id, lab_id")
    .eq("id", id)
    .single();

  let labId;

  // If there's no match in LaboratoriesInfo by ID, check if it's a lab_id
  if (infoError) {
    labId = id;

    // Get lab details from Laboratories table
    const { data: laboratoryData, error: laboratoryError } = await supabase
      .from("Laboratories")
      .select("id, name, name_ar, description, description_ar, image")
      .eq("id", labId)
      .single();

    if (laboratoryError) {
      throw new Error("Lab not found");
    }

    // Get the first location for this lab
    const { data: firstLocation, error: locationError } = await supabase
      .from("LaboratoriesInfo")
      .select("id")
      .eq("lab_id", labId)
      .order("id")
      .limit(1)
      .single();

    if (!locationError && firstLocation) {
      return { redirect: firstLocation.id };
    }

    // If no location, return minimal lab data
    return {
      lab: {
        laboratory: laboratoryData,
      },
      otherLocations: [],
    };
  } else {
    labId = infoData.lab_id;
  }

  // Fetch the lab details
  const { data, error } = await supabase
    .from("LaboratoriesInfo")
    .select(
      `
      id,
      government,
      city,
      lab_id,
      location,
      address,
      services,
      work_times,
      phones,
      laboratory:lab_id (
        name,
        name_ar,
        description,
        description_ar,
        image
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  // Fetch other locations
  const { data: locations } = await supabase
    .from("LaboratoriesInfo")
    .select("id, government, city")
    .eq("lab_id", labId)
    .neq("id", id);

  return {
    lab: {
      ...data,
      address: Array.isArray(data.address)
        ? data.address
        : [data.address].filter(Boolean),
      services: Array.isArray(data.services)
        ? data.services
        : [data.services].filter(Boolean),
      work_times: Array.isArray(data.work_times)
        ? data.work_times
        : [data.work_times].filter(Boolean),
    },
    otherLocations: locations || [],
  };
};

export default function LabDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const navigate = useNavigate();
  const currentLang = i18n.language;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["lab", id],
    queryFn: () => fetchLabDetails(id),
  });

  // Handle redirect if needed
  if (data?.redirect) {
    navigate(`/labs/${data.redirect}`, { replace: true });
    return null;
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-4 text-center">
          <DNA width={100} height={100} ariaLabel="dna-loaders" />
        </div>
      </div>
    );

  if (isError) return <div className="p-4 text-center">{error.message}</div>;

  if (!data?.lab) return <div className="p-4 text-center">Lab not found</div>;

  const { lab, otherLocations } = data;

  // Get localized content based on current language
  const getLocalizedContent = (field, fallback = "") => {
    return currentLang === "ar" 
      ? lab.laboratory?.[`${field}_ar`] || lab.laboratory?.[field] || fallback
      : lab.laboratory?.[field] || fallback;
  };

  const labName = getLocalizedContent("name", t("UnknownLab"));
  const labDescription = getLocalizedContent("description", t("NoDescriptionAvailable"));

  return (
    <>
      <MetaData
        title={labName}
        description={labDescription.substring(0, 160)}
        keywords={t("labDetailsKeywords")}
        author="Mohab Mohammed"
      />
      <main
        className={`min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 ${
          isRTL ? "rtl" : "ltr"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-3xl md:max-w-3xl mx-auto w-full">
          <header
            className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}
            aria-label={t("LabDetailsHeader")}
          >
            <h1 className="text-[#005d] font-semibold text-2xl md:text-3xl">
              {t("LabDetails")} - {t(lab.city, { defaultValue: lab.city })}{" "}
              {t("Branch")}
            </h1>
          </header>
          <article
            className="bg-white rounded-lg shadow overflow-hidden w-full"
            role="region"
            aria-labelledby="lab-details-heading"
          >
            <div
              className="aspect-w-16 aspect-h-9 relative"
              role="img"
              aria-label={t("LabImageAlt", {
                name: labName,
                city: t(lab.city),
                government: t(lab.government),
              })}
            >
              <img
                src={lab.laboratory?.image || "/default-lab.webp"}
                alt=""
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
                aria-hidden="true"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-lab.webp";
                }}
              />
            </div>

            <div className={`p-6 ${isRTL ? "text-right" : "text-left"}`}>
              <h1 id="lab-details-heading" className="text-3xl font-bold mb-2">
                {labName}
              </h1>

              <div
                className={`flex items-center text-gray-600 mb-4 gap-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
                role="contentinfo"
                aria-label={t("LocationInformation")}
              >
                <MapPin
                  className={`text-blue-600 ${
                    isRTL ? "ml-1" : "mr-1"
                  } flex-shrink-0`}
                  aria-hidden="true"
                  width={16}
                  height={16}
                />
                <span>
                  {t(lab.city)}, {t(lab.government)} {t("Branch")}
                </span>
              </div>

              <div
                className="text-gray-600 mb-6"
                aria-label={t("LabDescription")}
              >
                {labDescription}
              </div>

              {otherLocations.length > 0 && (
                <section
                  className="mb-6 bg-blue-50 p-4 rounded-lg"
                  aria-labelledby="other-branches-heading"
                >
                  <h2
                    id="other-branches-heading"
                    className="text-lg font-semibold mb-2"
                  >
                    {t("OtherBranches")}
                  </h2>
                  <ul className="grid grid-cols-2 gap-2">
                    {otherLocations.map((location) => (
                      <li key={`location-${location.id}`}>
                        <Link
                          to={`/labs/${location.id}`}
                          className="text-blue-600 hover:underline bg-white p-2 rounded flex items-center"
                          aria-label={t("VisitBranch", {
                            city: location.city,
                            government: location.government,
                          })}
                        >
                          <MapPin
                            size={14}
                            className={isRTL ? "ml-1" : "mr-1"}
                            aria-hidden="true"
                          />
                          <span>
                            {location.city}, {location.government}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">
                    {t("LocationDetails")}
                  </h2>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">{t("Government")}:</span>{" "}
                      {t(lab.government)}
                    </p>
                    <p>
                      <span className="font-medium">{t("City")}:</span> {t(lab.city)}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">
                    {t("ContactInformation")}
                  </h2>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="font-medium">{t("Phone")}:</span>{" "}
                      <span className="text-lg font-medium">{lab.phones}</span>
                    </p>
                    {lab.phones && (
                      <button
                        onClick={() =>
                          (window.location.href = `tel:${lab.phones}`)
                        }
                        className="flex items-center gap-2 text-white cursor-pointer bg-blue-700 px-3 py-3 rounded-md hover:bg-blue-800 transition duration-200"
                      >
                        <Phone size={20} className="text-white" />
                        {t("MakeACall")}
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">
                    {t("AddressDetails")}
                  </h2>
                  {lab.address && lab.address.length > 0 ? (
                    lab.address.map((addr, index) => (
                      <div
                        key={`address-${index}`}
                        className="mb-2 p-2 bg-white rounded"
                      >
                        <p>
                          <span className="font-medium">{t("Street")}:</span>{" "}
                          {i18n.language === "ar"
                            ? addr.streat_ar || addr.streat
                            : addr.streat}
                        </p>
                        <p>
                          <span className="font-medium">{t("Building")}:</span>{" "}
                          {i18n.language === "ar"
                            ? addr.building_ar || addr.building
                            : addr.building}
                        </p>
                        <p>
                          <span className="font-medium">{t("Floor")}:</span>{" "}
                          {i18n.language === "ar"
                            ? addr.floor_ar || addr.floor
                            : addr.floor}
                        </p>
                        <p>
                          <span className="font-medium">{t("Sign")}:</span>{" "}
                          {i18n.language === "ar"
                            ? addr.sign_ar || addr.sign
                            : addr.sign}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>{t("NoAddressInfo")}</p>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">{t("Services")}</h2>
                  {lab.services && lab.services.length > 0 ? (
                    lab.services.map((service, index) => (
                      <div
                        key={`service-${index}`}
                        className="mb-2 p-2 bg-white rounded"
                      >
                        <p className="font-medium">
                          {i18n.language === "ar"
                            ? service.service_ar || service.service
                            : service.service}
                        </p>
                        <p className="text-sm text-gray-600">{service.price}</p>
                      </div>
                    ))
                  ) : (
                    <p>{t("NoServicesInfo")}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">{t("WorkingHours")}</h2>
                  {lab.work_times && lab.work_times.length > 0 ? (
                    lab.work_times.map((time, index) => (
                      <div
                        key={`worktime-${index}`}
                        className="mb-2 p-2 bg-white rounded"
                      >
                        <p className="font-medium">{t(time.day)}</p>
                        <p className="text-sm text-gray-600">
                          {time.start} {t("AM")} {t("to")} {time.end} {t("PM")}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>{t("NoWorkingHoursInfo")}</p>
                  )}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">{t("BookATest")}</h2>
                  <button className="flex items-center gap-2 text-white cursor-pointer bg-blue-700 px-4 py-3 rounded-md hover:bg-blue-800 transition duration-200">
                    <Link to={`/lab/${lab.id}`}>
                      {t("BookNow")}
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
