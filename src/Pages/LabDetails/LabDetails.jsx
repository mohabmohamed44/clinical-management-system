import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../Config/Supabase";
import { DNA } from "react-loader-spinner";
import { Phone, MapPin } from "lucide-react";
import MetaData from "../../Components/MetaData/MetaData";

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
    
    // Check if this lab_id exists
    const { data: laboratoryData, error: laboratoryError } = await supabase
      .from("Laboratories")
      .select("id")
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
  } else {
    labId = infoData.lab_id;
  }

  // Fetch the lab details
  const { data, error } = await supabase
    .from("LaboratoriesInfo")
    .select(`
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
        description,
        image
      )
    `)
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
    otherLocations: locations || []
  };
};

export default function LabDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['lab', id],
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

  if (isError)
    return <div className="p-4 text-center">{error.message}</div>;

  if (!data?.lab)
    return <div className="p-4 text-center">Lab not found</div>;

  const { lab, otherLocations } = data;

  // Format location display properly
  const renderLocation = () => {
    if (!lab.location) return "N/A";

    // Check if location is an object with coordinates
    if (typeof lab.location === "object" && lab.location !== null) {
      // Check for latitude and longitude (with correct spelling)
      if ("latitude" in lab.location && "longitude" in lab.location) {
        return `${lab.location.latitude}, ${lab.location.longitude}`;
      }
      // Check for latitude and longtude (with typo)
      if ("latitude" in lab.location && "longtude" in lab.location) {
        return `${lab.location.latitude}, ${lab.location.longtude}`;
      }
      // For any other object structure, return a JSON string
      return JSON.stringify(lab.location);
    }

    // If it's just a string, return as is
    return lab.location;
  };

  return (
    <>
    <MetaData
      title={`${lab.laboratory?.name || 'Lab'} Details - ${lab.city} Branch`}
      description={`Detailed information about the ${lab.laboratory?.name || 'lab'} in ${lab.city}, ${lab.government}`}
      keywords={"lab, details, information, medical laboratory"}
      author={"Mohab Mohammed"}
    />
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-[#005d] mb-5 font-semibold text-2xl md:text-3xl" role="heading" aria-level="1">
          Lab Details - {lab.city} Branch
        </h1>
        <div className="bg-white rounded-lg shadow overflow-hidden" role="article">
          <img
            src={lab.laboratory?.image || "/placeholder-lab.jpg"}
            alt={`${lab.laboratory?.name || 'Laboratory'} facility in ${lab.city}, ${lab.government}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-lab.jpg";
            }}
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2" role="heading" aria-level="1">
              {lab.laboratory?.name || 'Unknown Lab'}
            </h1>
            <div className="flex items-center text-gray-600 mb-4" role="contentinfo" aria-label="Laboratory location">
              <MapPin size={16} className="mr-1 text-blue-600" aria-hidden="true"/>
              <span>{lab.city}, {lab.government} Branch</span>
            </div>
            <p className="text-gray-600 mb-6" role="description">
              {lab.laboratory?.description || 'No description available'}
            </p>

            {otherLocations.length > 0 && (
              <div className="mb-6 bg-blue-50 p-4 rounded-lg" role="region" aria-label="Other laboratory branches">
                <h2 className="text-lg font-semibold mb-2" role="heading" aria-level="2">Other Branches</h2>
                <div className="grid grid-cols-2 gap-2" role="list">
                  {otherLocations.map((location) => (
                    <Link
                      key={`location-${location.id}`}
                      to={`/labs/${location.id}`}
                      className="text-blue-600 hover:underline bg-white p-2 rounded flex items-center"
                      role="listitem"
                      aria-label={`Visit ${location.city}, ${location.government} branch`}
                    >
                      <MapPin size={14} className="mr-1" aria-hidden="true"/>
                      {location.city}, {location.government}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Location Details</h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Lab ID:</span> {lab.lab_id}
                  </p>
                  <p>
                    <span className="font-medium">Government:</span>{" "}
                    {lab.government}
                  </p>
                  <p>
                    <span className="font-medium">City:</span> {lab.city}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">
                  Contact Information
                </h2>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Phone:</span>{" "}
                    <span className="text-lg font-medium">{lab.phones}</span>
                  </p>
                  {lab.phones && (
                    <button
                      onClick={() => (window.location.href = `tel:${lab.phones}`)}
                      className="flex items-center gap-2 text-white cursor-pointer bg-blue-700 px-3 py-3 rounded-md hover:bg-blue-800 transition duration-200"
                    >
                      <Phone size={20} className="text-white"/>
                      Make a call
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Address Details</h2>
                {lab.address && lab.address.length > 0 ? (
                  lab.address.map((addr, index) => (
                    <div key={`address-${index}`} className="mb-2 p-2 bg-white rounded">
                      <p>
                        <span className="font-medium">Street:</span>{" "}
                        {addr.streat}
                      </p>
                      <p>
                        <span className="font-medium">Building:</span>{" "}
                        {addr.building}
                      </p>
                      <p>
                        <span className="font-medium">Floor:</span> {addr.floor}
                      </p>
                      <p>
                        <span className="font-medium">Sign:</span> {addr.sign}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No address information available</p>
                )}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Services</h2>
                {lab.services && lab.services.length > 0 ? (
                  lab.services.map((service, index) => (
                    <div key={`service-${index}`} className="mb-2 p-2 bg-white rounded">
                      <p className="font-medium">{service.service}</p>
                      <p className="text-sm text-gray-600">{service.price}</p>
                    </div>
                  ))
                ) : (
                  <p>No services information available</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Working Hours</h2>
                {lab.work_times && lab.work_times.length > 0 ? (
                  lab.work_times.map((time, index) => (
                    <div key={`worktime-${index}`} className="mb-2 p-2 bg-white rounded">
                      <p className="font-medium">
                        {time.day}
                      </p>
                      <p className="text-sm text-gray-600">
                        {time.start} am to {time.end} pm
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No working hours information available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};