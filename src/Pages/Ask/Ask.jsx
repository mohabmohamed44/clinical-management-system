// components/AskQuestionForm.jsx
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {supabase} from '../../Config/Supabase';

const generateQuestionId = () => {
  // Get current year's last 2 digits
  const yearPart = new Date().getFullYear().toString().slice(-2);
  // Generate 4 random digits
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `Quest-${yearPart}${randomPart}`;
};

export default function AskQuestionForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    specialty: '',
    gender: 'Choose',
    age: '',
    type: 'medical',
  });

  // Fetch specialties from database
  const { data: specialties, isLoading: specialtiesLoading } = useQuery({
    queryKey: ['Specialties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Specialties')
        .select('specialty')
        .order('specialty', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('questions')
        .insert([{
          id: generateQuestionId(),
          specialty: formData.specialty,
          gender: formData.gender,
          age: parseInt(formData.age),
          type: formData.type,
          user_id: user?.id,
          doctor_id: null,
          answer: null,
          created_at: new Date().toISOString(),
        }]);

      if (error) throw error;
      return;
    },
    onSuccess: () => {
      navigate('/questions');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.specialty) return alert('Please select a specialty');
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-blue-700">
        Ask a Medical Question
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Specialty Field */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-blue-700">
              Specialty
            </label>
            <select
              className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 
                focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              required
            >
              <option value="" disabled>Select a specialty</option>
              {specialtiesLoading ? (
                <option>Loading specialties...</option>
              ) : (
                specialties?.map((spec, id) => (
                  <option key={spec.specialty} value={spec.specialty}>
                    {spec.specialty}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Gender Field */}
          <div>
            <label className="block text-sm font-medium mb-2 text-blue-700">
              Gender
            </label>
            <select
              className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 
                focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <option value="Choose" selected disabled>Choose Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Age Field */}
          <div>
            <label className="block text-sm font-medium mb-2 text-blue-700">
              Age
            </label>
            <input
              type="number"
              required
              min="0"
              className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 
                focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>

          {/* Question Type Field */}
          <div>
            <label className="block text-sm font-medium mb-2 text-blue-700">
              Question Type
            </label>
            <select
              className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 
                focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="medical">Medical</option>
              <option value="insurance">Insurance</option>
              <option value="medication">Medication</option>
              <option value="symptoms">Symptoms</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg 
            hover:bg-blue-700 disabled:bg-blue-300 transition-all font-semibold
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {mutation.isPending ? 'Submitting...' : 'Submit Question'}
        </button>
      </form>
    </div>
  );
}