import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Pencil, MapPin, CalendarDays, UserRound } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  // =========================
  // PROFILE STATE
  // =========================
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    location: "",
    date_of_birth: "",
    gender: "",
    profile_image: "",
  });

  const [originalProfile, setOriginalProfile] = useState({
    full_name: "",
    phone: "",
    location: "",
    date_of_birth: "",
    gender: "",
    profile_image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [reportCount, setReportCount] = useState(0);

  // =========================
  // NOTIFICATIONS
  // =========================
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    uploads: true,
    consultation: false,
    reminders: true,
  });

  // =========================
  // PRIVACY
  // =========================
  const [privacy, setPrivacy] = useState({
    shareReports: true,
    aiAnalysis: true,
  });

  // =========================
  // FETCH PROFILE
  // =========================
useEffect(() => {
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/user-profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("User profile status:", response.status);
      console.log("User profile:", data);
      console.log("PROFILE IMAGE FROM API:", data.profile_image);

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        console.error("Failed to fetch user profile:", data);
        return;
      }

      const savedProfile = {
        full_name: data.full_name || "",
        phone: data.phone || "",
        location: data.location || "",
        date_of_birth: data.date_of_birth || "",
        gender: data.gender || "",
        profile_image: data.profile_image || "",
      };

      setProfile(savedProfile);
      setOriginalProfile(savedProfile);

      setNotifications({
        emailDigest: data.email_digest ?? true,
        uploads: data.upload_notifications ?? true,
        consultation: data.consultation_notifications ?? false,
        reminders: data.daily_reminders ?? true,
      });

      setPrivacy({
        shareReports: data.share_reports ?? true,
        aiAnalysis: data.allow_ai_analysis ?? true,
      });

    } catch (error) {
      console.error("Fetch user profile error:", error);
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // FETCH REPORT COUNT
  // =========================
  const fetchReports = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/reports",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("IMAGE UPLOAD STATUS:", response.status);
console.log("IMAGE UPLOAD RESPONSE:", data);

      console.log("Reports status:", response.status);
      console.log("Reports data:", data);

      if (!response.ok) {
        console.error("Failed to fetch reports:", data);
        return;
      }

      if (Array.isArray(data)) {
        setReportCount(data.length);
        console.log("Report count:", data.length);
      }

    } catch (error) {
      console.error("Fetch reports error:", error);
    }
  };


  fetchUserProfile();
  fetchReports();

}, [navigate]);
  // =========================
  // HANDLE INPUT CHANGES
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      navigate("/login");
      return false;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/user-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            full_name: profile.full_name,
            phone: profile.phone,
            location: profile.location,
            date_of_birth: profile.date_of_birth,
            gender: profile.gender,
            profile_image: profile.profile_image,

            email_digest: notifications.emailDigest,
            upload_notifications: notifications.uploads,
            consultation_notifications: notifications.consultation,
            daily_reminders: notifications.reminders,

            share_reports: privacy.shareReports,
            allow_ai_analysis: privacy.aiAnalysis,
          }),
        }
      );

      const data = await response.json();

      console.log("User profile status:", response.status);
      console.log("Saved user profile:", data);

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return false;
      }

      if (!response.ok) {
        alert(data.detail || "Failed to save profile.");
        return false;
      }

      const savedProfile = {
        full_name: data.full_name || "",
        phone: data.phone || "",
        location: data.location || "",
        date_of_birth: data.date_of_birth || "",
        gender: data.gender || "",
        profile_image: data.profile_image || "",
      };

      setProfile(savedProfile);
      setOriginalProfile(savedProfile);
      setNotifications({
        emailDigest: data.email_digest ?? true,
        uploads: data.upload_notifications ?? true,
        consultation: data.consultation_notifications ?? false,
        reminders: data.daily_reminders ?? true,
      });
      setPrivacy({
        shareReports: data.share_reports ?? true,
        aiAnalysis: data.allow_ai_analysis ?? true,
      });

      setIsEditing(false);
      alert("Profile saved successfully!");
      return true;
    } catch (error) {
      console.error("Save profile error:", error);
      alert("Server error while saving profile.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // CANCEL EDITING
  // =========================
  const handleCancelEdit = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) return "Not provided";

    const parts = date.split("-");

    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    return date;
  };

  // =========================
  // CALCULATE AGE
  // =========================
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "--";

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference =
      today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 0 ? age : "--";
  };

  // =========================
  // EDIT PROFILE SCROLL
  // =========================
  const openEditProfile = () => {
    setIsEditing(true);

    setTimeout(() => {
      document
        .getElementById("personal-information")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#183B2D]/20 border-t-[#183B2D] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#183B2D] text-lg">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* =========================
          HERO
      ========================= */}
      <div className="relative bg-[#183B2D] h-[220px]">
        <div className="max-w-7xl mx-auto px-8 h-full relative">

          <Link
            to="/upload-reports"
            className="absolute top-16 left-8 text-white hover:opacity-80 transition"
            aria-label="Go back"
          >
            <ArrowLeft size={32} />
          </Link>

          <div className="flex flex-col justify-center items-center h-full text-center">
            <p className="text-[#C8D7D0] uppercase tracking-[0.25em] text-xs mb-3">
              LabLens Account
            </p>

            <h1 className="text-4xl font-semibold text-white">
              Profile
            </h1>

            <p className="mt-3 text-base md:text-lg font-light text-[#C8D7D0]">
              Manage your personal information and preferences.
            </p>
          </div>
        </div>
      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="max-w-5xl mx-auto px-5 pb-20">

        {/* =========================
            PROFILE CARD
        ========================= */}
        <div className="-mt-10 relative z-10">
          <div className="bg-[#F8F4ED] border border-gray-200 shadow-lg p-7 md:p-10 rounded-2xl">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-7">

              {/* Avatar + Details */}
              <div className="flex items-center gap-6">

                <div className="relative shrink-0">

  {/* Profile Picture */}
  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#183B2D] flex items-center justify-center text-white shadow-md overflow-hidden">

    {profile.profile_image ? (
      <img
        src={`http://127.0.0.1:8000${profile.profile_image}`}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    ) : profile.full_name ? (
      <span className="text-4xl font-semibold">
        {profile.full_name.charAt(0).toUpperCase()}
      </span>
    ) : (
      <UserRound size={48} />
    )}

  </div>

  {/* Upload Image Button */}
  <label
    htmlFor="profile-image-upload"
    className="absolute bottom-0 right-0
    w-8 h-8 rounded-full
    bg-[#183B2D] text-white
    flex items-center justify-center
    cursor-pointer
    border-2 border-white
    hover:bg-[#275541]
    transition"
    title="Change profile picture"
  >
    <Pencil size={14} />
  </label>

  {/* Hidden File Input */}
  <input
    id="profile-image-upload"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={async (e) => {

      const selectedFile = e.target.files?.[0];

      if (!selectedFile) return;

      if (!selectedFile.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB.");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {

        const response = await fetch(
          "http://127.0.0.1:8000/user-profile/profile-image",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.detail || "Failed to upload profile picture.");
          return;
        }

        setProfile((prev) => ({
          ...prev,
          profile_image: data.profile_image,
        }));

        setOriginalProfile((prev) => ({
          ...prev,
          profile_image: data.profile_image,
        }));

      } catch (error) {
        console.error("Profile image upload error:", error);
        alert("Failed to upload profile picture.");
      }

    }}
  />

</div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                    Account Profile
                  </p>

                  <h2 className="text-2xl md:text-3xl font-semibold text-[#183B2D] mt-1">
                    {profile.full_name || "Your Name"}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={15} />
                      {profile.date_of_birth
                        ? formatDate(profile.date_of_birth)
                        : "DOB not provided"}
                    </span>

                    <span>
                      {profile.gender || "Gender not provided"}
                    </span>

                    {profile.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={15} />
                        {profile.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button
                type="button"
                onClick={openEditProfile}
                className="inline-flex items-center justify-center gap-2 border border-[#183B2D] px-7 py-3 rounded-lg text-[#183B2D] hover:bg-[#183B2D] hover:text-white transition font-medium"
              >
                <Pencil size={17} />
                Edit Profile
              </button>

            </div>
          </div>
        </div>

        {/* =========================
            PROFILE STATISTICS
        ========================= */}
        <div className="grid grid-cols-2 gap-5 mt-8 mb-10">

          <div className="bg-[#F8F4ED] border border-gray-200 shadow-sm rounded-xl py-6 text-center">
            <p className="uppercase tracking-wide text-gray-500 text-xs">
              Reports
            </p>
            <h2 className="text-3xl font-semibold text-[#183B2D] mt-2">
  {reportCount}
</h2>
            <p className="text-xs text-gray-500 mt-1">
              Uploaded medical reports
            </p>
          </div>

          <div className="bg-[#F8F4ED] border border-gray-200 shadow-sm rounded-xl py-6 text-center">
            <p className="uppercase tracking-wide text-gray-500 text-xs">
              Age
            </p>
            <h2 className="text-3xl font-semibold text-[#183B2D] mt-2">
              {calculateAge(profile.date_of_birth)}
              {profile.date_of_birth ? "y" : ""}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Based on date of birth
            </p>
          </div>

        </div>

        {/* =========================
            PERSONAL INFORMATION
        ========================= */}
        <section
          id="personal-information"
          className="bg-[#F8F4ED] border border-gray-200 shadow-sm rounded-2xl p-7 md:p-10 scroll-mt-8"
        >

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-[#202020]">
                Personal Information
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isEditing
                  ? "Update your personal details below."
                  : "Your saved personal details."}
              </p>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center gap-2 text-[#183B2D] font-medium hover:underline"
              >
                <Pencil size={16} />
                Edit
              </button>
            )}
          </div>

          <hr className="my-7 border-gray-300" />

          {!isEditing ? (
            /* =========================
               VIEW MODE
            ========================= */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Full Name
                </p>
                <p className="text-lg font-medium text-[#202020] mt-2">
                  {profile.full_name || "Not provided"}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Email
                </p>
                <p className="text-lg font-medium text-[#202020] mt-2">
                  Your account email
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Phone
                </p>
                <p className="text-lg font-medium text-[#202020] mt-2">
                  {profile.phone || "Not provided"}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Date of Birth
                </p>
                <p className="text-lg font-medium text-[#202020] mt-2">
                  {formatDate(profile.date_of_birth)}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Gender
                </p>
                <p className="text-lg font-medium text-[#202020] mt-2">
                  {profile.gender || "Not provided"}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Location
                </p>
                <p className="text-lg font-medium text-[#202020] mt-2">
                  {profile.location || "Not provided"}
                </p>
              </div>

            </div>
          ) : (
            /* =========================
               EDIT MODE
            ========================= */
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                {/* Full Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-[#202020]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#183B2D]/20 focus:border-[#183B2D]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-[#202020]">
                    Email
                  </label>
                  <input
                    type="email"
                    value="Your account email"
                    disabled
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Email is managed through your account.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-[#202020]">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#183B2D]/20 focus:border-[#183B2D]"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-[#202020]">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={profile.date_of_birth}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#183B2D]/20 focus:border-[#183B2D]"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Displayed as DD/MM/YYYY after saving.
                  </p>
                </div>

                {/* Gender */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-[#202020]">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#183B2D]/20 focus:border-[#183B2D]"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-[#202020]">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#183B2D]/20 focus:border-[#183B2D]"
                  />
                </div>

              </div>

              {/* Edit Actions */}
              <div className="flex justify-end gap-3 mt-10">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="px-7 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-7 py-3 rounded-lg bg-[#183B2D] text-white hover:bg-[#244a3b] transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* =========================
            ACCOUNT SECURITY
        ========================= */}
        <section className="bg-[#F8F4ED] border border-gray-200 shadow-sm rounded-2xl p-7 md:p-10 mt-8">

          <h2 className="text-2xl font-semibold text-[#202020]">
            Account Security
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage your account security settings.
          </p>

          <hr className="my-7 border-gray-300" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <h3 className="font-medium text-[#202020]">
                Password
              </h3>
              <p className="text-gray-500 mt-1 text-sm">
                Your password is securely protected.
              </p>
            </div>

            <p className="text-sm tracking-[5px] text-gray-500">
              ••••••••••
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <button
              type="button"
              className="rounded-lg border border-gray-300 py-3 bg-white text-sm hover:bg-gray-100 transition"
            >
              Change Password
            </button>

            <button
              type="button"
              className="rounded-lg border border-gray-300 py-3 bg-white text-sm hover:bg-gray-100 transition"
            >
              Enable 2FA
            </button>
          </div>
        </section>

        {/* =========================
            NOTIFICATIONS
        ========================= */}
        <section className="bg-[#F8F4ED] border border-gray-200 shadow-sm rounded-2xl p-7 md:p-10 mt-8">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-[#202020]">
                Notifications
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Choose which updates you want to receive.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg border border-[#183B2D] text-[#183B2D] hover:bg-[#183B2D] hover:text-white transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>

          <hr className="my-7 border-gray-300" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <label className="rounded-xl border border-gray-200 bg-white p-5 flex items-center gap-4 cursor-pointer hover:border-[#183B2D] transition">
              <input
                type="checkbox"
                checked={notifications.emailDigest}
                onChange={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    emailDigest: !prev.emailDigest,
                  }))
                }
                className="w-5 h-5 accent-[#183B2D]"
              />
              <div>
                <p className="font-medium">Email Digest</p>
                <p className="text-xs text-gray-500 mt-1">
                  Receive useful account updates by email.
                </p>
              </div>
            </label>

            <label className="rounded-xl border border-gray-200 bg-white p-5 flex items-center gap-4 cursor-pointer hover:border-[#183B2D] transition">
              <input
                type="checkbox"
                checked={notifications.uploads}
                onChange={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    uploads: !prev.uploads,
                  }))
                }
                className="w-5 h-5 accent-[#183B2D]"
              />
              <div>
                <p className="font-medium">Report Uploads</p>
                <p className="text-xs text-gray-500 mt-1">
                  Get updates after report processing.
                </p>
              </div>
            </label>

            <label className="rounded-xl border border-gray-200 bg-white p-5 flex items-center gap-4 cursor-pointer hover:border-[#183B2D] transition">
              <input
                type="checkbox"
                checked={notifications.consultation}
                onChange={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    consultation: !prev.consultation,
                  }))
                }
                className="w-5 h-5 accent-[#183B2D]"
              />
              <div>
                <p className="font-medium">Consultation Alerts</p>
                <p className="text-xs text-gray-500 mt-1">
                  Receive consultation-related reminders.
                </p>
              </div>
            </label>

            <label className="rounded-xl border border-gray-200 bg-white p-5 flex items-center gap-4 cursor-pointer hover:border-[#183B2D] transition">
              <input
                type="checkbox"
                checked={notifications.reminders}
                onChange={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    reminders: !prev.reminders,
                  }))
                }
                className="w-5 h-5 accent-[#183B2D]"
              />
              <div>
                <p className="font-medium">Daily Reminders</p>
                <p className="text-xs text-gray-500 mt-1">
                  Receive reminders for important health activities.
                </p>
              </div>
            </label>

          </div>
        </section>

        {/* =========================
            PRIVACY
        ========================= */}
        <section className="bg-[#F8F4ED] border border-gray-200 shadow-sm rounded-2xl p-7 md:p-10 mt-8">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-[#202020]">
                Privacy Settings
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Control how your LabLens data is used.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg border border-[#183B2D] text-[#183B2D] hover:bg-[#183B2D] hover:text-white transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Privacy"}
            </button>
          </div>

          <hr className="my-7 border-gray-300" />

          <div className="space-y-4">

            <label className="rounded-xl border border-gray-200 bg-white px-5 py-4 flex justify-between items-center gap-5 cursor-pointer">
              <div>
                <p className="font-medium">Share Reports with Family</p>
                <p className="text-xs text-gray-500 mt-1">
                  Allow reports to be shared when family features are enabled.
                </p>
              </div>

              <input
                type="checkbox"
                className="w-5 h-5 accent-[#183B2D]"
                checked={privacy.shareReports}
                onChange={() =>
                  setPrivacy((prev) => ({
                    ...prev,
                    shareReports: !prev.shareReports,
                  }))
                }
              />
            </label>

            <label className="rounded-xl border border-gray-200 bg-white px-5 py-4 flex justify-between items-center gap-5 cursor-pointer">
              <div>
                <p className="font-medium">Allow AI Analysis</p>
                <p className="text-xs text-gray-500 mt-1">
                  Allow LabLens to analyze uploaded medical reports.
                </p>
              </div>

              <input
                type="checkbox"
                className="w-5 h-5 accent-[#183B2D]"
                checked={privacy.aiAnalysis}
                onChange={() =>
                  setPrivacy((prev) => ({
                    ...prev,
                    aiAnalysis: !prev.aiAnalysis,
                  }))
                }
              />
            </label>

            <button
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 hover:bg-gray-100 transition"
            >
              Download My Data ⤓
            </button>

          </div>
        </section>

      </main>

      {/* =========================
          FOOTER
      ========================= */}
      <footer className="bg-[#183B2D] text-white mt-10">
        <div className="max-w-7xl mx-auto px-8 py-14">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Brand */}
            <div>
              <h2 className="text-3xl font-semibold">
                LabLens
              </h2>

              <p className="mt-4 text-[#C8D7D0] leading-7 max-w-md">
                Making healthcare reports easy to understand through
                AI-powered analysis, smart insights and personalized
                recommendations.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-5">
                Quick Links
              </h3>

              <ul className="space-y-3 text-[#C8D7D0]">
                <li>
                  <Link
                    to="/home"
                    className="hover:text-white transition"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    to="/upload-reports"
                    className="hover:text-white transition"
                  >
                    Upload Reports
                  </Link>
                </li>

                <li>
                  <Link
                    to="/medical-history"
                    className="hover:text-white transition"
                  >
                    Medical History
                  </Link>
                </li>

                <li>
                  <Link
                    to="/consult-doctor"
                    className="hover:text-white transition"
                  >
                    Consult Doctor
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-semibold mb-5">
                Contact
              </h3>

              <p className="text-[#C8D7D0]">
                support@lablens.ai
              </p>

              <p className="mt-3 text-[#C8D7D0]">
                Pune, Maharashtra
              </p>
            </div>

          </div>

          <hr className="border-white/20 my-10" />

          <div className="flex flex-col md:flex-row justify-between items-center text-[#B7C9C1] text-sm">
            <p>
              © 2026 LabLens. All rights reserved.
            </p>

            <div className="flex gap-8 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="hover:text-white transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="hover:text-white transition"
              >
                Terms of Service
              </Link>

              <Link
                to="/help"
                className="hover:text-white transition"
              >
                Help Center
              </Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}