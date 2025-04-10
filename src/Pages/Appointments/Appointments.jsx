// AppointmentsPage.jsx
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../Config/Supabase";
import { DNA } from "react-loader-spinner";
import { 
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCcVisa,
  FaUser,
  FaMapMarkerAlt
} from "react-icons/fa";
import { SiCashapp } from "react-icons/si";

const fetchAppointments = async () => {
  const { data, error } = await supabase
    .from('Appointments')
    .select(`
      id,
      status,
      payment_method,
      type,
      clinic_id,
      hos_id,
      User:Users (
        id,
        first_name,
        last_name,
        phone,
        gender,
        addresses
      )
    `)
    .order('id', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export default function AppointmentsPage() {
  const { 
    data: appointments,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments,
    staleTime: 5 * 60 * 1000
  });

  const getStatusBadge = (status) => {
    const statusStyles = {
      completed: {
        color: "bg-green-100 !text-green-800",
        icon: <FaCheckCircle className="w-4 h-4" />,
      },
      pending: {
        color: "bg-yellow-100 !text-yellow-800",
        icon: <FaClock className="w-4 h-4" />,
      },
      cancelled: {
        color: "bg-red-100 !text-red-800",
        icon: <FaTimesCircle className="w-4 h-4" />,
      },
      confirmed: {
        color: "bg-blue-100 !text-blue-800",
        icon: <FaCheckCircle className="w-4 h-4" />,
      },
    };
  
    const normalizedStatus = (status || '').toLowerCase();
  
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-2 rounded-full text-xs font-medium ${
        statusStyles[normalizedStatus]?.color || 'bg-gray-100 !text-gray-800'
      }`}>
        {statusStyles[normalizedStatus]?.icon}
        <span className="capitalize">{normalizedStatus}</span>
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => { 
    return method === 'Visa' ? (
      <FaCcVisa className="w-4 h-4" />
    ) : (
      <SiCashapp className="w-4 h-4" />
    );
  };

  const formatAddress = (addresses) => {
    if (!addresses || addresses.length === 0) return 'No address';
    const primary = addresses.find(a => a.is_primary) || addresses[0];
    return `${primary.street}, ${primary.city}`;
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center py-8">
        <DNA width={80} height={80} ariaLabel="dna-appointments-loader" />
      </div>
    </div>
  );

  if (isError) return (
    <div className="text-red-500 text-center py-8">
      Error: {error.message}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Appointments
        </h1>

        <div className="bg-white rounded-lg shadow overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments?.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <FaUser className="w-8 h-8 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {appointment.User?.first_name} {appointment.User?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.User?.gender}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.User?.phone}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatAddress(appointment.User?.addresses)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(appointment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(appointment.payment_method)}
                      <span className="text-sm capitalize">
                        {appointment.payment_method}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {appointment.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.clinic_id ? `Clinic #${appointment.clinic_id}` : `Hospital #${appointment.hos_id}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}