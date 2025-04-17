import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../Config/Supabase';
import { DNA } from 'react-loader-spinner';

const Labs = () => {
  const [labs, setLabs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const { data, error } = await supabase
          .from('labs')
          .select('id, name, description, image_url, capacity')

        if (error) throw error
        setLabs(data)
      } catch (error) {
        console.error('Error fetching labs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLabs()
  }, [])

  if (loading) return <div className="flex items-center justify-center h-screen">
    <div className='text-center'>
      <DNA width={100} height={100} ariaLabel='dna-loaders'/>
    </div>
  </div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-8 text-3xl font-bold text-[#005D]">Available Labs</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => (
          <div
            key={lab.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={lab.image_url || '/placeholder-lab.jpg'}
              alt={lab.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/placeholder-lab.jpg'
              }}
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{lab.name}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{lab.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  Capacity: {lab.capacity}
                </span>
                <Link
                  to={`/labs/${lab.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Labs;
