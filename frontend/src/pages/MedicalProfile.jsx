import { Link } from "react-router-dom";
import { FaHeartbeat, FaUserCircle } from "react-icons/fa";
import { HiMenuAlt3 } from "react-icons/hi";
import Navbar from "../components/Navbar";
import { FaRegUserCircle } from "react-icons/fa";
import { useState ,useEffect} from "react";
import { FaBrain } from "react-icons/fa";
import Footer from "../components/Footer";





export default function MedicalProfile() {
    
     const [isEditing, setIsEditing] = useState(true); 

    const [profile, setProfile] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    blood_group: "",

    height: "",
    weight: "",

    medical_conditions: [],
    family_history: [],
    allergies: [],
    medications: [],

    activity_level: "",
    smoking: "",
    alcohol: "",

    health_goals: [],
  });



  const fetchProfile = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Response:", data);

    if (!response.ok) {
      console.error(data);
      return;
    }

    setProfile({
      full_name: data.full_name || "",
      date_of_birth: data.date_of_birth || "",
      gender: data.gender || "",
      blood_group: data.blood_group || "",

      height: data.height || "",
      weight: data.weight || "",

      medical_conditions: data.medical_conditions || [],
      family_history: data.family_history || [],
      allergies: data.allergies || [],
      medications: data.medications || [],

      activity_level: data.activity_level || "",
      smoking: data.smoking || "",
      alcohol: data.alcohol || "",

      health_goals: data.health_goals || [],
    });

  const hasProfileData =
  data.full_name ||
  data.date_of_birth ||
  data.gender ||
  data.blood_group ||
  data.height ||
  data.weight ||
  data.medical_conditions?.length ||
  data.family_history?.length ||
  data.allergies?.length ||
  data.medications?.length ||
  data.activity_level ||
  data.smoking ||
  data.alcohol ||
  data.health_goals?.length;

setIsEditing(!hasProfileData);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchProfile();
}, []);

  // Single consolidated state object — mirrors the backend profile shape


  const healthGoals = [
    "Weight Loss",
    "Weight Gain",
    "Improve Fitness",
    "Manage Diabetes",
    "Improve Heart Health",
    "Monitor Thyroid Health",
    "General Health Monitoring",
  ];

  const toggleGoal = (goal) => {
    setProfile((prev) => ({
      ...prev,
      health_goals: prev.health_goals.includes(goal)
        ? prev.health_goals.filter((g) => g !== goal)
        : [...prev.health_goals, goal],
    }));
  };

  const familyConditions = [
    "Diabetes",
    "Hypertension",
    "Thyroid Disorders",
    "Heart Disease",
    "Cancer",
    "None",
  ];


  // Transient UI-only state (not part of the saved profile payload)
  const [allergyInput, setAllergyInput] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherInput, setOtherInput] = useState("");

  const toggleFamilyCondition = (condition) => {
    setProfile((prev) => ({
      ...prev,
      family_history: prev.family_history.includes(condition)
        ? prev.family_history.filter((item) => item !== condition)
        : [...prev.family_history, condition],
    }));
  };

  const addAllergy = () => {
    if (!allergyInput.trim()) return;

    if (!profile.allergies.includes(allergyInput.trim())) {
      setProfile((prev) => ({
        ...prev,
        allergies: [...prev.allergies, allergyInput.trim()],
      }));
    }

    setAllergyInput("");
  };

  const removeAllergy = (index) => {
    setProfile((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
  };

  const addMedication = () => {
    const name = prompt("Medication Name");
    if (!name) return;

    const dosage = prompt("Dosage");
    const frequency = prompt("Frequency");

    setProfile((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          name,
          dosage,
          frequency,
        },
      ],
    }));
  };

  const removeMedication = (index) => {
    setProfile((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const handleSaveOther = () => {
    const value = otherInput.trim();

    if (!value) return;

    // Prevent duplicates
    if (profile.medical_conditions.includes(value)) {
      setOtherInput("");
      return;
    }

    setProfile((prev) => ({
      ...prev,
      medical_conditions: [...prev.medical_conditions, value],
    }));
    setOtherInput("");
  };

  const conditions = [
    "Diabetes",
    "Prediabetes",
    "Hypertension",
    "Thyroid Disorder",
    "PCOS",
    "Asthma",
    "Heart Disease",
    "Anemia",
    "Kidney Disease",
    "None",
  ];

  // Custom ("Other") conditions are the entries in medical_conditions
  // that aren't part of the predefined checkbox list
  const otherConditions = profile.medical_conditions.filter(
    (condition) => !conditions.includes(condition)
  );

  const removeOtherCondition = (index) => {
    const condition = otherConditions[index];
    setProfile((prev) => ({
      ...prev,
      medical_conditions: prev.medical_conditions.filter(
        (item) => item !== condition
      ),
    }));
  };

  const handleCondition = (condition) => {
    setProfile((prev) => ({
      ...prev,
      medical_conditions: prev.medical_conditions.includes(condition)
        ? prev.medical_conditions.filter((item) => item !== condition)
        : [...prev.medical_conditions, condition],
    }));
  };
const saveProfile = async () => {
  console.log("SAVE CLICKED");
  console.log(profile);
  try {

 const payload = {
  ...profile,
  height: profile.height === "" ? null : Number(profile.height),
  weight: profile.weight === "" ? null : Number(profile.weight),
};

console.log("Payload:", payload);

const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify(payload),
});

const data = await response.json();

console.log(response.status);
console.log(data);
alert(JSON.stringify(data, null, 2));

    if (!response.ok) {
      alert(data.detail || "Failed to save profile.");
      return;
    }

    alert("Medical profile saved successfully!");

    setIsEditing(false); // Reset editing state after saving
  } catch (err) {
    console.error(err);
    alert("Server error.");
  }
};
  const bmi =
    profile.height && profile.weight
      ? (
          Number(profile.weight) /
          Math.pow(Number(profile.height) / 100, 2)
        ).toFixed(1)
      : "";
      

  return (
    
    <div className="min-h-screen bg-[#F7F4ED]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8">
<div>
  {/* Hero Section */}
  <div className="relative left-1/2 -translate-x-1/2 w-[100vw] max-w-[100vw] overflow-x-hidden bg-[#183B2D] pt-14 pb-28 shadow-lg">
    <div className="max-w-7xl mx-auto px-8">
      <h1 className="text-3xl font-semibold text-white">
        Medical Profile
      </h1>
      <p className="text-l text-[#b5bbb8] mt-3 font-light">
        Add your health information to receive personalized report insights.
      </p>
    </div>
  </div>

</div>
        <div className="-mt-24 relative z-10 bg-white rounded-none shadow-xl p-8">

         {isEditing ? (
          <>
          <div className="flex items-center gap-4 mb-4">
            
            <div>
               <h2 className="text-xl font-semibold text-[#222] mb-10">
      Basic Health Information
    </h2>
    <div className="grid grid-cols-12 gap-8">
        {/* Profile Icon */}
      <div className="col-span-2 flex justify-center">
        <FaRegUserCircle
          className="text-black"
          size={120}
        />
      </div>

        {/* Form */}
      <div className="col-span-10">

        <div className="grid grid-cols-2 gap-x-8 gap-y-8">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name
            </label>

            <input
  type="text"
  placeholder=""
  value={profile.full_name}
  onChange={(e) => {
    console.log("Typing:", e.target.value);

    setProfile({
      ...profile,
      full_name: e.target.value,
    });
  }}
  className="w-full h-10 border border-gray-300 px-5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#183B2D]"
/>
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Date of Birth
            </label>

            <input
  type="date"
  value={profile.date_of_birth || ""}
  onChange={(e) =>
    setProfile({
      ...profile,
      date_of_birth: e.target.value,
    })
  }
  max={new Date().toISOString().split("T")[0]}
  className="w-full h-12 border border-gray-300 rounded-md px-4 text-sm focus:outline-none focus:border-[#183B2D]"
/>


          </div>

          {/* Gender */}
          <div>
            <label className="block text-m font-medium mb-2">
              Gender
            </label>

            <select
              value={profile.gender}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }
              className="w-full h-10 border border-gray-300 px-5 text-sm text-gray-700 focus:outline-none focus:border-[#183B2D]"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-md font-medium mb-2">
              Blood Group
            </label>

            <select
              value={profile.blood_group}
              onChange={(e) =>
                setProfile({ ...profile, blood_group: e.target.value })
              }
              className="w-full h-10 border border-gray-300 px-5 text-sm text-gray-700 focus:outline-none focus:border-[#183B2D]"
            >
              <option value="">Select Blood Group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
          </div>

        </div>
      </div>
      </div>
  
</div>

        </div>
        {/* Physical Information */}
<div className="bg-white border border-gray-200 shadow-lg p-8 mt-8">
  <h2 className="text-xl font-semibold text-[#222] mb-10">
    Physical Information
  </h2>

  <div className="grid grid-cols-3 gap-8">

    {/* Height */}
    <div>
  <label className="block text-sm font-medium mb-2">
    Height (cm)
  </label>

  <input
    type="number"
    value={profile.height}
    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
    placeholder="e.g. 175"
    className="w-full h-10 border border-gray-300 px-5 text-sm focus:outline-none focus:border-[#183B2D]"
  />
</div>

    {/* Weight */}
  <div>
  <label className="block text-sm font-medium mb-2">
    Weight (kg)
  </label>

  <input
    type="number"
    value={profile.weight}
    onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
    placeholder="e.g. 70"
    className="w-full h-10 border border-gray-300 px-5 text-sm focus:outline-none focus:border-[#183B2D]"
  />
</div>

    {/* BMI */}
    <div>
  <label className="block text-sm font-medium mb-2 invisible">
    BMI
  </label>

  <div className="h-10 border border-gray-300 bg-gray-50 flex items-center px-5 text-sm">
    <span className="font-semibold mr-2">BMI:</span>

    <span className="text-gray-700">
      {bmi || "Auto-calculated"}
    </span>
  </div>
</div>

  </div>
</div>

{/* Existing Medical Conditions */}
<div className="bg-white border border-gray-200 shadow-md p-8 mt-8">
  <h2 className="text-xl font-semibold text-[#222] mb-10">
    Existing Medical Conditions
  </h2>

  <div className="grid grid-cols-5 gap-y-6">

    {conditions.map((condition) => (
      <label
        key={condition}
        className="flex items-center gap-3 text-sm cursor-pointer"
      >
        <input
          type="checkbox"
          checked={profile.medical_conditions.includes(condition)}
          onChange={() => handleCondition(condition)}
          className="w-5 h-5 accent-black cursor-pointer"
        />
        {condition}
      </label>
    ))}

   
   {/* Other */}
<div className="col-span-5 mt-4">
  <label className="flex items-center gap-3 text-sm cursor-pointer mb-4">
    <input
      type="checkbox"
      checked={showOtherInput}
      onChange={(e) => setShowOtherInput(e.target.checked)}
      className="w-5 h-5 accent-black"
    />
    Other
  </label>

{showOtherInput && (
  <>
    {/* Saved Conditions */}
    {otherConditions.length > 0 && (
      <div className="flex flex-wrap gap-3 mb-4">
        {otherConditions.map((condition, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-[#EAF5EF] text-[#183B2D] px-3 py-2 rounded-full"
          >
            <span className="text-sm">
              {condition}
            </span>

            <button
              type="button"
              onClick={() => removeOtherCondition(index)}
              className="font-bold hover:text-red-600"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    )}

    {/* Input */}
    <div className="flex items-center gap-3">
      <input
        type="text"
        value={otherInput}
        onChange={(e) => setOtherInput(e.target.value)}
        placeholder="Enter medical condition"
        className="w-80 h-10 border border-gray-300 rounded px-3 text-sm focus:outline-none focus:border-[#183B2D]"
      />

      <button
        type="button"
        onClick={handleSaveOther}
        className="bg-[#183B2D] text-white px-6 py-2 rounded hover:bg-[#274B3E] transition"
      >
        Add
      </button>

      <button
        type="button"
        onClick={() => setOtherInput("")}
        className="text-[#183B2D] font-medium hover:underline"
      >
        Clear
      </button>
    </div>
  </>
)}
</div>

  </div>
</div>

<div className="bg-white border border-gray-200 shadow-md p-8 mt-8">

  <h2 className="text-xl font-semibold mb-8">
    Family Medical History
  </h2>

  <div className="grid grid-cols-6 gap-y-6">

    {familyConditions.map((condition) => (
      <label
        key={condition}
        className="flex items-center gap-3 text-sm cursor-pointer"
      >
        <input
          type="checkbox"
          checked={profile.family_history.includes(condition)}
          onChange={() => toggleFamilyCondition(condition)}
          className="w-5 h-5 accent-black"
        />

        {condition}
      </label>
    ))}



  </div>

</div>

<div className="bg-white border border-gray-200 shadow-md p-8 mt-8">

  <h2 className="text-xl font-semibold mb-8">
    Allergies
  </h2>

  {/* Chips */}

  <div className="flex flex-wrap gap-3 mb-6">

    {profile.allergies.map((allergy, index) => (

      <div
        key={index}
        className="flex items-center gap-2 border px-4 py-2 bg-gray-50"
      >
        {allergy}

        <button
          onClick={() => removeAllergy(index)}
          className="font-semibold hover:text-red-600"
        >
          ×
        </button>

      </div>

    ))}

  </div>

  <div className="flex gap-4">

    <input
      type="text"
      value={allergyInput}
      onChange={(e) => setAllergyInput(e.target.value)}
      placeholder="Enter allergy name..."
      className="flex-1 h-12 border border-gray-300 px-5 focus:outline-none"
    />

    <button
      onClick={addAllergy}
      className="bg-black text-white px-8"
    >
      + Add Allergy
    </button>

  </div>

</div>

<div className="bg-white border border-gray-200 shadow-md p-8 mt-8">

  <div className="flex justify-between items-center mb-8">

    <h2 className="text-xl font-semibold">
      Current Medications
    </h2>

    <button
      onClick={addMedication}
      className="border border-black px-6 py-2 hover:bg-black hover:text-white transition"
    >
      Add Medication
    </button>

  </div>

  <table className="w-full">

    <thead>

      <tr className="border-b">

        <th className="text-left py-4">
          Medication Name
        </th>

        <th className="text-left">
          Dosage
        </th>

        <th className="text-left">
          Frequency
        </th>

        <th className="text-right">
          Actions
        </th>

      </tr>

    </thead>

    <tbody>

      {profile.medications.length === 0 ? (

        <tr>

          <td className="py-6 text-gray-500">
            No medications added yet
          </td>

          <td>--</td>

          <td>--</td>

          <td className="text-right">--</td>

        </tr>


      ) : (

        profile.medications.map((medication, index) => (

          <tr
            key={index}
            className="border-b"
          >

            <td className="py-5">
              {medication.name}
            </td>

            <td>
              {medication.dosage}
            </td>

            <td>
              {medication.frequency}
            </td>

            <td className="text-right">

              <button
                onClick={() => removeMedication(index)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>

            </td>

          </tr>

        ))

      )}

    </tbody>

  </table>

</div>

<div className="bg-white border border-gray-200 shadow-md p-8 mt-8">

  <h2 className="text-xl font-semibold text-[#222] mb-8">
    Lifestyle Information
  </h2>

  {/* Activity Level */}

  <div className="mb-8">

    <label className="block text-sm font-bold mb-3">
      Activity Level
    </label>

    <div className="flex flex-wrap gap-8">

      {[
        "Sedentary",
        "Lightly Active",
        "Moderately Active",
        "Very Active",
      ].map((item) => (

        <label
          key={item}
          className="flex items-center gap-2 cursor-pointer text-sm"
        >
          <input
            type="radio"
            name="activity"
            value={item}
            checked={profile.activity_level === item}
            onChange={(e) =>
              setProfile({ ...profile, activity_level: e.target.value })
            }
            className="accent-[#183B2D]"
          />

          {item}
        </label>

      ))}

    </div>

  </div>

  <div className="grid grid-cols-2 gap-20">

    {/* Smoking */}

    <div>

      <label className="block text-sm font-bold mb-3">
        Smoking
      </label>

      <div className="flex gap-8">

        {["Never", "Former", "Current"].map((item) => (

          <label
            key={item}
            className="flex items-center gap-2 cursor-pointer text-sm"
          >
            <input
              type="radio"
              name="smoking"
              value={item}
              checked={profile.smoking === item}
              onChange={(e) =>
                setProfile({ ...profile, smoking: e.target.value })
              }
              className="accent-[#183B2D]"
            />

            {item}
          </label>

        ))}

      </div>

    </div>

    {/* Alcohol */}

    <div>

      <label className="block text-sm font-bold mb-3">
        Alcohol
      </label>

      <div className="flex gap-8">

        {["Never", "Occasionally", "Regularly"].map((item) => (

          <label
            key={item}
            className="flex items-center gap-2 cursor-pointer text-sm"
          >
            <input
              type="radio"
              name="alcohol"
              value={item}
              checked={profile.alcohol === item}
              onChange={(e) =>
                setProfile({ ...profile, alcohol: e.target.value })
              }
              className="accent-[#183B2D]"
            />

            {item}
          </label>

        ))}

      </div>

    </div>

  </div>

</div>

<div className="bg-white border border-gray-200 shadow-md p-8 mt-8">

  <h2 className="text-xl font-semibold mb-8">
    Health Goals
  </h2>

  <div className="flex flex-wrap gap-4">

    {healthGoals.map((goal) => (

      <button
        key={goal}
        type="button"
        onClick={() => toggleGoal(goal)}
        className={`px-7 py-3 border transition

        ${
          profile.health_goals.includes(goal)
            ? "bg-[#183B2D] text-white border-[#183B2D]"
            : "bg-white text-black border-gray-300 hover:border-[#183B2D]"
        }`}
      >
        {goal}
      </button>

    ))}

  </div>

</div>

<div className="mt-10 border-4 border-[#183B2D] rounded-3xl p-10">

  <div className="bg-white rounded-3xl p-14 text-center shadow-sm">

    <FaBrain
      className="mx-auto text-[#183B2D] mb-5"
      size={55}
    />

    <h2 className="text-xl font-semibold text-[#183B2D]">
      Personalized Insights Waiting
    </h2>

    <p className="mt-6 text-gray-500 text-l max-w-3xl mx-auto leading-9">

      Once you save your profile, our AI assistant
      will analyze this data alongside your uploaded
      reports to provide tailored health
      recommendations and trend analysis.

    </p>

  </div>

</div>

<div className="flex flex-col items-center mt-10">

  <p className="text-gray-500 text-sm mb-5">
    [PENDING SAVE]
  </p>

  <button
  type="button"
  onClick={saveProfile}
  className="bg-[#183B2D] text-white px-10 py-2 rounded-md text-xl shadow hover:bg-[#274B3E] transition"
>
  Save Medical Profile
</button>

  <button
    className="mt-5 text-m text-gray-700 hover:text-red-500 transition"
  >
    Cancel
  </button>

          
</div>
    </>
  ) : (
    <div className="bg-white shadow-xl p-10">

      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-semibold text-[#183B2D]">
            Your Medical Profile
          </h2>

          <p className="text-gray-500 mt-2">
            Your health information has been saved.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="bg-[#183B2D] text-white px-6 py-3 rounded-md hover:bg-[#274B3E]"
        >
          Edit Profile
        </button>
      </div>

      {/* Basic Information */}
      <div className="border-b pb-8 mb-8">
        <h3 className="text-lg font-semibold mb-6">
          Basic Health Information
        </h3>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium mt-1">
              {profile.full_name || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-medium mt-1">
              {profile.date_of_birth
  ? new Date(profile.date_of_birth + "T00:00:00").toLocaleDateString("en-GB")
  : "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium mt-1">
              {profile.gender || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Blood Group</p>
            <p className="font-medium mt-1">
              {profile.blood_group || "Not provided"}
            </p>
          </div>

        </div>
      </div>

      {/* Physical Information */}
      <div className="border-b pb-8 mb-8">

        <h3 className="text-lg font-semibold mb-6">
          Physical Information
        </h3>

        <div className="grid grid-cols-3 gap-6">

          <div>
            <p className="text-sm text-gray-500">Height</p>
            <p className="font-medium mt-1">
              {profile.height ? `${profile.height} cm` : "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Weight</p>
            <p className="font-medium mt-1">
              {profile.weight ? `${profile.weight} kg` : "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">BMI</p>
            <p className="font-medium mt-1">
              {bmi || "Not available"}
            </p>
          </div>

        </div>
      </div>

      {/* Medical Conditions */}
      <div className="border-b pb-8 mb-8">

        <h3 className="text-lg font-semibold mb-6">
          Medical Conditions
        </h3>

        {profile.medical_conditions.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {profile.medical_conditions.map((condition, index) => (
              <span
                key={index}
                className="bg-[#EAF5EF] text-[#183B2D] px-4 py-2 rounded-full"
              >
                {condition}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No medical conditions reported
          </p>
        )}

      </div>

      {/* Family History */}
      <div className="border-b pb-8 mb-8">

        <h3 className="text-lg font-semibold mb-6">
          Family Medical History
        </h3>

        {profile.family_history.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {profile.family_history.map((condition, index) => (
              <span
                key={index}
                className="bg-gray-100 px-4 py-2 rounded-full"
              >
                {condition}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No family history reported
          </p>
        )}

      </div>

      {/* Allergies */}
      <div className="border-b pb-8 mb-8">

        <h3 className="text-lg font-semibold mb-6">
          Allergies
        </h3>

        {profile.allergies.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {profile.allergies.map((allergy, index) => (
              <span
                key={index}
                className="bg-gray-100 px-4 py-2 rounded-full"
              >
                {allergy}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No allergies reported
          </p>
        )}

      </div>

      {/* Medications */}
      <div className="border-b pb-8 mb-8">

        <h3 className="text-lg font-semibold mb-6">
          Current Medications
        </h3>

        {profile.medications.length > 0 ? (
          <div className="space-y-4">

            {profile.medications.map((medication, index) => (
              <div
                key={index}
                className="border p-4"
              >
                <p className="font-medium">
                  {medication.name}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {medication.dosage} • {medication.frequency}
                </p>
              </div>
            ))}

          </div>
        ) : (
          <p className="text-gray-500">
            No medications added
          </p>
        )}

      </div>

      {/* Lifestyle */}
      <div className="border-b pb-8 mb-8">

        <h3 className="text-lg font-semibold mb-6">
          Lifestyle Information
        </h3>

        <div className="grid grid-cols-3 gap-6">

          <div>
            <p className="text-sm text-gray-500">
              Activity Level
            </p>
            <p className="font-medium mt-1">
              {profile.activity_level || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Smoking
            </p>
            <p className="font-medium mt-1">
              {profile.smoking || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Alcohol
            </p>
            <p className="font-medium mt-1">
              {profile.alcohol || "Not provided"}
            </p>
          </div>

        </div>

      </div>

      {/* Health Goals */}
      <div>

        <h3 className="text-lg font-semibold mb-6">
          Health Goals
        </h3>

        {profile.health_goals.length > 0 ? (
          <div className="flex flex-wrap gap-3">

            {profile.health_goals.map((goal, index) => (
              <span
                key={index}
                className="bg-[#183B2D] text-white px-5 py-2 rounded-full"
              >
                {goal}
              </span>
            ))}

          </div>
        ) : (
          <p className="text-gray-500">
            No health goals selected
          </p>
        )}

      </div>
         
    </div>
  )}
        </div>
      </div>
  




   


       <Footer />
    </div>

    

  );
}