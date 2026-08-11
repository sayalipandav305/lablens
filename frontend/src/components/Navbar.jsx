import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";

export default function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const [profile, setProfile] = useState({
    full_name: "",
    profile_image: "",
  });

  // =========================
  // FETCH USER PROFILE
  // =========================

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user-profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch navbar profile");
          return;
        }

        const data = await response.json();

        console.log("PROFILE IMAGE:", profile.profile_image);

        setProfile({
          full_name: data.full_name || "",
          profile_image: data.profile_image || "",
        });
      } catch (error) {
        console.error("Navbar profile error:", error);
      }
    };

    fetchProfile();
  }, []);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  // =========================
  // NAVIGATION STYLES
  // =========================

  const navLink =
    "text-base lg:text-[18px] transition px-2 py-1";

  const activeLink =
    "text-[#183B2D] font-semibold border-b-2 border-[#183B2D]";

  const inactiveLink =
    "text-[#365E4B] hover:text-[#183B2D]";

  return (
    <nav className="w-full bg-[#F8FBF8]">

      {/* =========================
          DESKTOP NAVBAR
      ========================= */}

      <div className="max-w-7xl mx-auto flex items-center justify-between px-10 pt-9 pb-2">

        {/* Mobile Menu Button */}

        <button
          className="md:hidden text-[#183B2D]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <IoClose size={28} />
          ) : (
            <IoMenu size={28} />
          )}
        </button>

        {/* =========================
            DESKTOP NAVIGATION
        ========================= */}

        <div className="hidden md:flex flex-1 justify-center items-center gap-8 lg:gap-16 xl:gap-28">

          <NavLink
            to="/upload-reports"
            className={({ isActive }) =>
              `${navLink} ${
                isActive ? activeLink : inactiveLink
              }`
            }
          >
            Upload reports
          </NavLink>

          <NavLink
            to="/medical-history"
            className={({ isActive }) =>
              `${navLink} ${
                isActive ? activeLink : inactiveLink
              }`
            }
          >
            Medical history
          </NavLink>

          <NavLink
            to="/medical-profile"
            className={({ isActive }) =>
              `${navLink} ${
                isActive ? activeLink : inactiveLink
              }`
            }
          >
            Medical Profile
          </NavLink>

          <NavLink
            to="/consult-doctor"
            className={({ isActive }) =>
              `${navLink} ${
                isActive ? activeLink : inactiveLink
              }`
            }
          >
            Consult doctor
          </NavLink>

        </div>

        {/* =========================
            PROFILE + LOGOUT
        ========================= */}

        <div className="flex items-center gap-4">

          <Link
            to="/Profile"
            className="flex items-center gap-2.5 hover:opacity-80 transition"
          >

            {/* Profile Picture */}

            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#183B2D] flex items-center justify-center shrink-0">

             {profile.profile_image ? (
  <img
  src={
    profile.profile_image.startsWith("http")
      ? profile.profile_image
      : `http://127.0.0.1:8000${profile.profile_image}`
  }
  alt="Profile"
  className="w-full h-full object-cover"
  onError={(e) => {
    e.currentTarget.style.display = "none";
  }}
/>
)  : profile.full_name ? (
                <span className="text-white text-sm font-semibold">
                  {profile.full_name
                    .charAt(0)
                    .toUpperCase()}
                </span>
              ) : (
                <FaRegUserCircle
                  size={24}
                  className="text-white"
                />
              )}

            </div>

            {/* Username */}

            <span className="hidden lg:block text-[#183B2D] font-medium text-sm">
              Hi,{" "}
              {profile.full_name
  ? profile.full_name.split(" ")[0]
  : "Profile"}
            </span>

          </Link>

          {/* Logout */}

       <button
  onClick={handleLogout}
  title="Logout"
  className="
    w-9 h-9
    rounded-full
    flex items-center justify-center
    text-[#183B2D]
    hover:bg-[#183B2D]
    hover:text-white
    transition-all
    duration-300
  "
>
  <IoLogOutOutline size={22} />
</button>

        </div>
      </div>

      {/* =========================
          MOBILE MENU
      ========================= */}

      {menuOpen && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-5">

          <NavLink
            to="/upload-reports"
            className={({ isActive }) =>
              `${navLink} ${
                isActive ? activeLink : inactiveLink
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            Upload reports
          </NavLink>

          <NavLink
            to="/medical-history"
            className={({ isActive }) =>
              `${navLink} ${
                isActive ? activeLink : inactiveLink
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            Medical history
          </NavLink>

          <NavLink
            to="/medical-profile"
            className={({ isActive }) =>
              `${navLink} ${
                isActive ? activeLink : inactiveLink
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            Medical Profile
          </NavLink>

          <NavLink
            to="/consult-doctor"
            className={({ isActive }) =>
              `${navLink} ${
                isActive ? activeLink : inactiveLink
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            Consult doctor
          </NavLink>

        </div>
      )}

      <div className="max-w-7xl mx-auto border-b border-[#365E4B]" />

    </nav>
  );
}