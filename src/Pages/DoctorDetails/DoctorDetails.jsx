// export default function DcotorDetails() {
//   return (
//     <div className="w-full object-cover min-h-screen">
//       {/* Header Banner */}
//       <div className="flex justify-start">
//         <h2 className="text-3xl font-bold text-gray-800 mb-8 px-4 sm:px-0">Doctor Details</h2>
//       </div>
//       <div className="w-full absolute right-0 left-0">
//         <div className="h-[300px] md:h-[400px] bg-[#00155D] w-full right-0 left-0 z-50">
//           <div className="container mx-auto p-4 h-full md:flex md:justify-end md:items-start">
//             <div className="max-w-lg text-left mt-2 px-4 md:px-0 md:mr-100 py-10">
//               <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">Dr. Sarah Lee, MD, MPH, FAPA</h1>
//               <h2 className="text-lg sm:text-xl mb-4 text-white">Board-certified Psychiatrist</h2>
//               <p className="text-white text-sm sm:text-base">
//                 With more than 15 years of experience spanning human psychology and behavior, Dr. Lee is an expert in managing mood disorders and anxiety disorders
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content - Adjusted margin-top to lower the photo */}
//       <div className="max-w-7xl mx-auto px-4 mt-60 md:mt-32 relative z-10">
//         <div className="grid md:grid-cols-12 gap-8">
//           {/* Left Column - Doctor Info */}
//           <div className="md:col-span-4">
//             <div className="bg-white rounded-lg overflow-hidden shadow-lg transform translate-y-0">
//               <img
//                 src="https://placehold.co/400x400/0A2357/FFFFFF.png"
//                 alt="Dr. Sarah Lee"
//                 className="w-full h-64 sm:h-80 object-cover"
//               />
//               <div className="bg-[#3182CE] text-white py-3 px-4 text-center text-lg font-semibold">
//                 Psychiatry Department
//               </div>
              
//               <div className="p-6 space-y-6">
//                 <div>
//                   <h3 className="font-semibold text-lg mb-3">Contact Info</h3>
//                   <div className="space-y-2 text-sm sm:text-base">
//                     <p className="flex items-center">
//                       <span>+123-456-7890</span>
//                     </p>
//                     <p className="flex items-center">
//                       <span>sarahlee@prohealth.com</span>
//                     </p>
//                   </div>
//                 </div>
                
//                 <div>
//                   <h3 className="font-semibold text-lg mb-3">Appointment Schedules</h3>
//                   <div className="space-y-3 text-sm sm:text-base">
//                     <div className="flex justify-between items-center">
//                       <span>Monday</span>
//                       <div className="flex items-center">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
//                         <span>09:00-12:00</span>
//                       </div>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span>Wednesday</span>
//                       <div className="flex items-center">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
//                         <span>15:00-18:00</span>
//                       </div>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span>Friday</span>
//                       <div className="flex items-center">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
//                         <span>09:00-12:00</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Doctor Details */}
//           <div className="md:col-span-8 mt-10 md:mt-40">
//             <div className="bg-white rounded-lg p-6 sm:p-8 shadow-lg space-y-8">
//               {/* Degrees Section */}
//               <div>
//                 <div className="flex items-center gap-2 mb-4">
//                   <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 3.94 1.687a1 1 0 00.788 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zm9.3 0A11.115 11.115 0 0113 13.12a1 1 0 01-.89.89 8.968 8.968 0 00-1.05.174V10.12l1.67-.723z" />
//                   </svg>
//                   <h3 className="text-lg sm:text-xl font-semibold">Degrees</h3>
//                 </div>
//                 <ul className="space-y-4 text-gray-600 text-sm sm:text-base">
//                   <li>
//                     <h4 className="font-semibold">University of California, San Francisco</h4>
//                     <p className="text-sm">Medical degree</p>
//                   </li>
//                   <li>
//                     <h4 className="font-semibold">University of California, Los Angeles (UCLA) Medical Center</h4>
//                     <p className="text-sm">Completed residency training in psychiatry</p>
//                   </li>
//                   <li>
//                     <h4 className="font-semibold">University of California, Berkeley</h4>
//                     <p className="text-sm">Master of Public Health degree</p>
//                   </li>
//                 </ul>
//               </div>

//               {/* Experience Section */}
//               <div>
//                 <div className="flex items-center gap-2 mb-4">
//                   <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
//                   </svg>
//                   <h3 className="text-lg sm:text-xl font-semibold">Experiences</h3>
//                 </div>
//                 <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
//                   <li className="flex items-start gap-2">
//                     <span>•</span>
//                     <span>Worked in community mental health clinics, private practice, and academic medical centers</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span>•</span>
//                     <span>Expertise in the treatment of mood disorders, anxiety disorders, and psychotic disorders</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span>•</span>
//                     <span>Special interest in women's mental health and perinatal psychiatry</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span>•</span>
//                     <span>Experience managing complex cases that involve both mental health and medical issues</span>
//                   </li>
//                 </ul>
//               </div>

//               {/* Awards Section */}
//               <div>
//                 <div className="flex items-center gap-2 mb-4">
//                   <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
//                   </svg>
//                   <h3 className="text-lg sm:text-xl font-semibold">Awards/Achievements</h3>
//                 </div>
//                 <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
//                   <li className="flex items-start gap-2">
//                     <span>•</span>
//                     <span>Fellow of the American Psychiatric Association (FAPA)</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span>•</span>
//                     <span>Recognized for research contributions with grants from the National Institute of Mental Health (NIMH) and the American Foundation for Suicide Prevention</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
export default function DcotorDetails() {
  return (
    <div className="w-full object-cover min-h-screen">
      {/* Header Banner */}
      <div className="flex justify-start">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 px-4 sm:px-0">Doctor Details</h2>
      </div>
      <div className="w-full absolute right-0 left-0">
        <div className="h-[300px] md:h-[400px] bg-[#00155D] w-full right-0 left-0 z-50">
          <div className="container mx-auto p-2 h-full md:flex md:justify-end md:items-start">
            <div className="max-w-lg text-left mt-2 px-4 md:px-0 md:lg:xl:mr-107 py-7">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">Dr. Sarah Lee, MD, MPH, FAPA</h1>
              <h2 className="text-lg sm:text-xl mb-2 text-white">Board-certified Psychiatrist</h2>
              <p className="text-white text-sm sm:text-base">
                With more than 15 years of experience spanning human psychology and behavior, Dr. Lee is an expert in managing mood disorders and anxiety disorders
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Adjusted margin-top to lower the photo */}
      <div className="max-w-7xl mx-auto px-4 sm:mt-68 mt-65 md:mt-32 relative z-10">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Left Column - Doctor Info */}
          <div className="md:col-span-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transform translate-y-0">
              <img
                src="https://placehold.co/400x400/0A2357/FFFFFF.png"
                alt="Dr. Sarah Lee"
                className="w-full h-64 sm:h-80 object-cover"
              />
              <div className="bg-[#3182CE] text-white py-3 px-4 text-center text-lg font-semibold">
                Psychiatry Department
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Contact Info</h3>
                  <div className="space-y-2 text-sm sm:text-base">
                    <p className="flex items-center">
                      <span>+123-456-7890</span>
                    </p>
                    <p className="flex items-center">
                      <span>sarahlee@prohealth.com</span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Appointment Schedules</h3>
                  <div className="space-y-3 text-sm sm:text-base">
                    <div className="flex justify-between items-center">
                      <span>Monday</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span>09:00-12:00</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Wednesday</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span>15:00-18:00</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Friday</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span>09:00-12:00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Doctor Details */}
          <div className="md:col-span-8 mt-10 md:mt-40">
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-lg space-y-8">
              {/* Degrees Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 3.94 1.687a1 1 0 00.788 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zm9.3 0A11.115 11.115 0 0113 13.12a1 1 0 01-.89.89 8.968 8.968 0 00-1.05.174V10.12l1.67-.723z" />
                  </svg>
                  <h3 className="text-lg sm:text-xl font-semibold">Degrees</h3>
                </div>
                <ul className="space-y-4 text-gray-600 text-sm sm:text-base">
                  <li>
                    <h4 className="font-semibold">University of California, San Francisco</h4>
                    <p className="text-sm">Medical degree</p>
                  </li>
                  <li>
                    <h4 className="font-semibold">University of California, Los Angeles (UCLA) Medical Center</h4>
                    <p className="text-sm">Completed residency training in psychiatry</p>
                  </li>
                  <li>
                    <h4 className="font-semibold">University of California, Berkeley</h4>
                    <p className="text-sm">Master of Public Health degree</p>
                  </li>
                </ul>
              </div>

              {/* Experience Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg sm:text-xl font-semibold">Experiences</h3>
                </div>
                <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Worked in community mental health clinics, private practice, and academic medical centers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Expertise in the treatment of mood disorders, anxiety disorders, and psychotic disorders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Special interest in women's mental health and perinatal psychiatry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Experience managing complex cases that involve both mental health and medical issues</span>
                  </li>
                </ul>
              </div>

              {/* Awards Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  <h3 className="text-lg sm:text-xl font-semibold">Awards/Achievements</h3>
                </div>
                <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Fellow of the American Psychiatric Association (FAPA)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Recognized for research contributions with grants from the National Institute of Mental Health (NIMH) and the American Foundation for Suicide Prevention</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};