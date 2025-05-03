import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { supabase } from '../../Config/Supabase';

const FindMedicinePage = () => {
  const [medicineName, setMedicineName] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!medicineName.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please enter a medicine name' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: 'loading', message: 'Submitting your request...' });

    try {
      // Get user ID from authentication (assuming it's available)
      // This is just a placeholder - replace with actual auth implementation
      const userId = "PAT-0"; // Sample user ID

      let imageUrl = null;

      // Upload image to Firebase if available
      if (image) {
        const storage = getStorage();
        // Generate a unique file name using timestamp
        const fileName = `${Date.now()}_${medicineName.replace(/\s+/g, '_')}.jpg`;
        const storageRef = ref(storage, `FindMedicine/${fileName}`);
        
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Add record to Supabase
      const { data, error } = await supabase
        .from('FindMedicine')
        .insert([
          {
            name: medicineName,
            notes: notes || "EMPTY", // Use "EMPTY" if notes are empty
            image_url: imageUrl,
            answer: null, // Will be filled by pharmacy later
            is_found: false, // Initial status
            user_id: userId,
            pharmacy_id: null, // Will be assigned when pharmacy responds
            created_at: new Date().toISOString() // ISO format for timestamps
          }
        ]);

      if (error) throw error;

      // Reset form
      setMedicineName('');
      setNotes('');
      setImage(null);
      setImagePreview(null);
      setSubmitStatus({ type: 'success', message: 'Your request has been submitted! We will notify you when a pharmacy responds.' });
    } catch (error) {
      console.error("Error submitting request:", error);
      setSubmitStatus({ type: 'error', message: 'There was a problem submitting your request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Find My Medicine</h1>
      
      <p className="mb-4 text-gray-600">
        Can't find a specific medicine? Let us help you locate it. Fill out the details below and nearby pharmacies will check if they have it in stock.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Medicine Name */}
        <div>
          <label htmlFor="medicineName" className="block text-sm font-medium text-gray-700 mb-1">
            Medicine Name *
          </label>
          <input
            type="text"
            id="medicineName"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter medicine name"
            required
          />
        </div>
        
        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Details (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Dosage, form (tablets, syrup, etc.), or any other details"
            rows="3"
          />
        </div>
        
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Image (optional)
          </label>
          <div className="mt-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview ? (
              <div className="w-full">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="h-48 mx-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="mt-2 px-3 py-1 text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label htmlFor="image" className="flex flex-col items-center cursor-pointer">
                <Camera className="h-12 w-12 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">
                  Click to upload an image of the medicine or prescription
                </span>
              </label>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
      
      {/* Status Message */}
      {submitStatus && (
        <div 
          className={`mt-4 p-3 rounded-md ${
            submitStatus.type === 'success' ? 'bg-green-100 text-green-800' :
            submitStatus.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}
        >
          {submitStatus.message}
        </div>
      )}
    </div>
  );
};

export default FindMedicinePage;