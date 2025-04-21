// 4. LabDetails.jsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../Config/Supabase';
import { DNA } from 'react-loader-spinner';

const LabDetails = () => {
  const { id } = useParams()
  const [lab, setLab] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLabDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('Laboratories')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setLab(data)
      } catch (error) {
        console.error('Error fetching lab details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLabDetails()
  }, [id])

  if (loading) return 
    <div className="flex items-center justify-center h-screen">
      <div className="p-4 text-center">
        <DNA width={100} height={100} ariaLabel="dna-loaders" />
      </div>
    </div>
  if (!lab) return <div className="p-4 text-center">Lab not found</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={lab.images || '/placeholder-lab.jpg'}
            alt={lab.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{lab.name}</h1>
            <p className="text-gray-600 mb-6">{lab.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Equipment</h2>
                <ul className="list-disc pl-5">
                  {lab.equipment?.map((item, index) => (
                    <li key={index} className="text-gray-600">{item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Details</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Capacity:</span> {lab.capacity}</p>
                  <p><span className="font-medium">Availability:</span> {lab.availability}</p>
                  <p><span className="font-medium">Contact:</span> {lab.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Additional Information</h2>
              <p className="text-gray-600">{lab.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LabDetails;