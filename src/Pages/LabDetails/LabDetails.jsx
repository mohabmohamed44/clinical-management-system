// 4. LabDetails.jsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../Config/Supabase';
import { DNA } from 'react-loader-spinner';

const LabDetails = () => {
  const { id } = useParams()
  const [lab, setLab] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLabDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('LaboratoriesInfo')
          .select(`
            id,
            government,
            city,
            lab_id,
            location,
            address,
            services,
            work_times,
            laboratory:lab_id (
              name,
              description,
              image
            )
          `)
          .eq('id', id)
          .single()

        if (error) throw error
        
        // Format all JSONB fields to ensure they're arrays
        const formattedData = {
          ...data,
          address: Array.isArray(data.address) ? data.address : [data.address].filter(Boolean),
          services: Array.isArray(data.services) ? data.services : [data.services].filter(Boolean),
          work_times: Array.isArray(data.work_times) ? data.work_times : [data.work_times].filter(Boolean)
        }
        setLab(formattedData)
      } catch (error) {
        console.error('Error fetching lab details:', error)
        setError('Failed to fetch laboratory details')
      } finally {
        setLoading(false)
      }
    }

    fetchLabDetails()
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-4 text-center">
        <DNA width={100} height={100} ariaLabel="dna-loaders" />
      </div>
    </div>
  )
  if (error) return <div className="p-4 text-center">{error}</div>
  if (!lab) return <div className="p-4 text-center">Lab not found</div>

  // Format location display properly
  const renderLocation = () => {
    if (!lab.location) return "N/A";
    
    // Check if location is an object with coordinates
    if (typeof lab.location === 'object' && lab.location !== null) {
      // Check for latitude and longitude (with correct spelling)
      if ('latitude' in lab.location && 'longitude' in lab.location) {
        return `${lab.location.latitude}, ${lab.location.longitude}`;
      }
      // Check for latitude and longtude (with typo)
      if ('latitude' in lab.location && 'longtude' in lab.location) {
        return `${lab.location.latitude}, ${lab.location.longtude}`;
      }
      // For any other object structure, return a JSON string
      return JSON.stringify(lab.location);
    }
    
    // If it's just a string, return as is
    return lab.location;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className='text-[#005d] mb-5 font-semibold text-2xl md:text-3xl'>Lab Details</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <img
            src={lab.laboratory?.image || '/placeholder-lab.jpg'}
            alt={lab.laboratory?.name}
            className="w-full h-full object-contain"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{lab.laboratory?.name}</h1>
            <p className="text-gray-600 mb-6">{lab.laboratory?.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Location Details</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Lab ID:</span> {lab.lab_id}</p>
                  <p><span className="font-medium">Government:</span> {lab.government}</p>
                  <p><span className="font-medium">City:</span> {lab.city}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Address Details</h2>
                {lab.address && lab.address.map((addr, index) => (
                  <div key={index} className="mb-2 p-2 bg-white rounded">
                    <p><span className="font-medium">Street:</span> {addr.streat}</p>
                    <p><span className="font-medium">Building:</span> {addr.building}</p>
                    <p><span className="font-medium">Floor:</span> {addr.floor}</p>
                    <p><span className="font-medium">Sign:</span> {addr.sign}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Services</h2>
                {lab.services && lab.services.map((service, index) => (
                  <div key={index} className="mb-2 p-2 bg-white rounded">
                    <p className="font-medium">{service.service}</p>
                    <p className="text-sm text-gray-600">{service.price}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Working Hours</h2>
                {lab.work_times && lab.work_times.map((time, index) => (
                  <div key={index} className="mb-2 p-2 bg-white rounded">
                    <p className="font-medium">
                      {time.from} - {time.to}
                    </p>
                    <p className="text-sm text-gray-600">
                      {time.start} am to {time.end} pm
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LabDetails