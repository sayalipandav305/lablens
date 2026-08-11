import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { Headset,Search,Star} from "lucide-react";
import Footer from "../components/Footer";

export default function ConsultDoctor() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

const doctors = [
  {
    id: 1,
    name: "Dr. Elena Ross",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 128,
    image: "",
  },
  {
    id: 2,
    name: "Dr. Marcus Thorne",
    specialty: "Neurologist",
    rating: 4.7,
    reviews: 85,
    image: "",
  },
  {
    id: 3,
    name: "Dr. Sarah Jenkins",
    specialty: "General Physician",
    rating: 5.0,
    reviews: 240,
    image: "",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Pediatrician",
    rating: 4.8,
    reviews: 92,
    image: "",
  },
];

  return (
    <div className="min-h-screen bg-[#F8FBF8]">
      <Navbar />

     

          {/* Hero Section */}
  <div className="relative left-1/2 -translate-x-1/2 w-[100vw] max-w-[100vw] overflow-x-hidden bg-[#183B2D] pt-14 pb-28 shadow-lg">
    <div className="max-w-7xl mx-auto px-8">
      <h1 className="text-3xl font-semibold text-white">
        Consult a Doctor
      </h1>
      <p className="text-l text-[#b5bbb8] mt-3 font-light">
        Book a virtual or in-person consultation with a healthcare professional.
      </p>
    </div>
  </div>

<div className="max-w-8xl mx-auto px-8 mt-10">

  <div className="grid grid-cols-12 gap-8">

    {/* Quick Consult */}
    <div className="col-span-8 bg-[#F8F4ED] border border-gray-200 rounded-sm shadow-md p-7">

      <span className="inline-block border border-red-400 text-red-500 text-xs uppercase tracking-wider px-4 py-1 rounded-md">
        Urgent
      </span>

      <h2 className="text-3xl font-bold text-[#202020] mt-8">
        Quick Consult
      </h2>

      <p className="text-gray-600 text-md leading-9 mt-6 max-w-4xl">
        Need immediate advice? Connect with our AI-assisted triage
        or start a chat with the next available practitioner.
      </p>

      <button
        className="mt-10 bg-black text-white px-10 py-4 rounded-md
        text-md font-semibold hover:bg-[#183B2D] transition"
      >
        Start Immediate Chat
      </button>

    </div>

    {/* Support Card */}
    <div className="col-span-4 border-2 border-[#183B2D] rounded-sm bg-white shadow-md flex flex-col justify-center items-center p-10">

      <div className="w-20 h-20 rounded-full bg-[#F5F8F6] flex items-center justify-center mb-6">

        <Headset
          size={42}
          className="text-[#202020]"
          strokeWidth={2}
        />

      </div>

      <h3 className="text-2xl font-semibold text-[#202020]">
        24/7 Support
      </h3>

      <p className="text-center text-gray-600 text-md leading-8 mt-6 max-w-xs">
        Our healthcare coordinators are always online
        to help you find the right specialist.
      </p>

    </div>

  </div>

</div>


 <div className="max-w-9xl mx-auto px-6 py-10">
       

<div className="mt-10 bg-white border border-gray-200 rounded-md shadow-md p-6">

  <div className="grid grid-cols-12 gap-4 items-end">

    {/* Search */}
    <div className="col-span-6">

      <label className="block text-sm font-medium text-[#202020] mb-3">
        Search for a Doctor
      </label>

      <div className="relative">

        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <input
          type="text"
          placeholder="Name, hospital or condition..."
          className="w-full border border-gray-400 rounded-sm h-12 pl-11 pr-4
          focus:outline-none focus:border-[#183B2D]" 
        />

      </div>

    </div>

    {/* Specialty */}
    <div className="col-span-4">

      <label className="block text-sm font-medium text-[#202020] mb-2">
        Specialty
      </label>

      <select
        className="w-full border border-gray-400 rounded-sm h-12 px-4
        focus:outline-none focus:border-[#183B2D]"
      >
        <option>General Physician</option>
        <option>Cardiologist</option>
        <option>Neurologist</option>
        <option>Dermatologist</option>
        <option>Pediatrician</option>
        <option>Orthopedic</option>
        <option>Gynecologist</option>
      </select>

    </div>

    {/* Button */}
    <div className="col-span-2">

      <button
        className="w-full h-12 bg-black text-white font-semibold rounded-sm
        hover:bg-[#183B2D] transition"
      >
        Find Specialists
      </button>

    </div>

  </div>

</div>
<div className="max-w-7xl mx-auto mt-10">

  {/* Heading */}
  <div className="flex justify-between items-center mb-8">

    <h2 className="text-2xl font-semibold text-[#202020]">
      Available Doctors
    </h2>

    <p className="text-sm text-gray-500 font-mono">
      Showing {doctors.length} Specialists
    </p>

  </div>

  {/* Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

    {doctors.map((doctor) => (

      <div
        key={doctor.id}
        className="bg-[#F8F4ED] border border-gray-300 rounded-none shadow-sm
        p-7 text-center hover:shadow-lg transition duration-300"
      >

        {/* Profile */}
        <div className="w-28 h-28 rounded-md bg-white border border-gray-300 mx-auto mb-6 flex items-center justify-center overflow-hidden">

          {doctor.image ? (

            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-full object-cover"
            />

          ) : (

            <span className="text-gray-400 text-sm">
              Photo
            </span>

          )}

        </div>

        {/* Name */}
        <h3 className="text-xl font-semibold text-[#202020]">
          {doctor.name}
        </h3>

        {/* Specialty */}
        <p className="text-gray-500 mt-2">
          {doctor.specialty}
        </p>

        {/* Rating */}
        <div className="flex justify-center items-center gap-2 mt-5">

          <Star
            size={16}
            fill="#202020"
            className="text-[#202020]"
          />

          <span className="font-semibold">
            {doctor.rating}
          </span>

          <span className="text-gray-500">
            ({doctor.reviews} reviews)
          </span>

        </div>

        {/* Button */}
        <button
          className="mt-8 w-full border border-[#202020]
          py-3 rounded-xs text-sm font-semibold
          hover:bg-[#183B2D] hover:text-white hover:border-[#183B2D]
          transition"
        >
          Book Appointment
        </button>

      </div>

    ))}

  </div>

  {/* Load More */}
  <div className="flex justify-center mt-14">

    <button
      className="border-2 border-[#183B2D]
      text-[#183B2D]
      px-10 py-2
      rounded-sm
      text-md
      hover:bg-[#183B2D]
      hover:text-white
      transition"
    >
      Load More Doctors
    </button>

  </div>

</div>

    </div>

    <Footer />
    </div>


       
  );
}   