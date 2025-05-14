import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../Config/Supabase';
import { ImLab } from "react-icons/im";
import { DNA } from 'react-loader-spinner';
import MetaData from '../../Components/MetaData/MetaData';
import LabFilters from '../../Components/LabFilters/LabFilters';

const Labs = () => {
  const [labs, setLabs] = useState([])
  const [labLocations, setLabLocations] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);

  useEffect(() => {
    const fetchLabsData = async () => {
      try {
        // Fetch labs from Laboratories table
        const { data: labsData, error: labsError } = await supabase
          .from('Laboratories')
          .select(`
            id,
            name,
            description,
            image,
            specialty,
            rate,
            services,
            patients
          `)
          .order('id')

        if (labsError) {
          throw labsError
        }

        // Fetch lab info to get all locations for each lab
        const { data: labInfoData, error: labInfoError } = await supabase
          .from('LaboratoriesInfo')
          .select(`
            id,
            lab_id,
            city,
            government
          `)

        if (labInfoError) {
          throw labInfoError
        }

        // Group locations by lab_id
        const locationsByLab = {}
        labInfoData.forEach(info => {
          if (!locationsByLab[info.lab_id]) {
            locationsByLab[info.lab_id] = []
          }
          locationsByLab[info.lab_id].push({
            infoId: info.id,
            city: info.city,
            government: info.government
          })
        })

        setLabLocations(locationsByLab)
        setLabs(labsData)
        setError(null)
      } catch (error) {
        console.error('Error fetching labs data:', error)
        setError('Failed to fetch laboratories information')
      } finally {
        setLoading(false)
      }
    }

    fetchLabsData()
  }, [])

  const handleFilterChange = (selectedSpecialties) => {
    setFilteredSpecialties(selectedSpecialties);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className='text-center'>
        <DNA width={100} height={100} ariaLabel='dna-loaders'/>
      </div>
    </div>
  )

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-600">
          <p className='text-sm md:text-md'>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const filteredLabs = labs.filter(lab => 
    filteredSpecialties.length === 0 || filteredSpecialties.includes(lab.specialty)
  );

  return (
    <>
    <MetaData 
      title={"Labs"}
      description={"Labs page"}
      keywords={"labs, laboratories, medical labs"}
      author={"Mohab Mohammed"}
    />
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <ImLab className="text-3xl text-[#005D] mr-2" />
          <h1 className="text-3xl font-bold text-[#005D]">Available Labs</h1>
        </div>
        <LabFilters onFilterChange={handleFilterChange} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLabs.map((lab) => {
          const locations = labLocations[lab.id] || [];
          
          return (
            <div
              key={`lab-${lab.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={lab.image || '/placeholder-lab.jpg'}
                alt={lab.name}
                className="w-full h-60 object-cover"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/placeholder-lab.jpg'
                }}
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{lab.name}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{lab.description}</p>
                
                {locations.length > 0 && (
                  <div className="mt-2 mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Available Locations:</h3>
                    <div className="space-y-1 max-h-28 overflow-y-auto">
                      {locations.map((location, index) => (
                        <div key={`location-${lab.id}-${index}`} className="flex justify-between">
                          <span className="text-md text-gray-600">{location.city}, {location.government}</span>
                          <Link
                            to={`/labs/${location.infoId}`}
                            className="text-md text-blue-600 hover:underline"
                          >
                            View
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    Services: {lab.services}
                  </span>
                  {locations.length > 0 ? (
                    <span className="text-sm text-gray-500">
                      {locations.length} {locations.length === 1 ? 'location' : 'locations'}
                    </span>
                  ) : (
                    <Link
                      to={`/labs/${lab.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  )
}

export default Labs;