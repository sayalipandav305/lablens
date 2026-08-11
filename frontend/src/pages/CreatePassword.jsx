import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function CreatePassword() {
  const location = useLocation();
  const navigate = useNavigate();

  // Email passed from EmailSignUp after OTP verification
  const email = location.state?.email || "";

  const emailVerified = location.state?.emailVerified === true;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ============================================================
  // CREATE ACCOUNT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make sure user came through OTP verification
    if (!email || !emailVerified) {
      alert(
        "Please verify your email before creating your account."
      );

      navigate("/email-signup");

      return;
    }

    // Check password
    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            email: email.trim().toLowerCase(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Registration status:",
        response.status
      );

      console.log(
        "Registration response:",
        data
      );

      if (!response.ok) {
        alert(
          typeof data.detail === "string"
            ? data.detail
            : "Registration failed."
        );

        return;
      }

      alert(
        "Account created successfully!"
      );

      // Go to login
      navigate("/login");

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );

      alert(
        "Unable to connect to server."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBF8] flex items-center justify-center">

      <div className="absolute inset-0 bg-[#F8FBF8]" />

      <div
        className="
          relative
          w-[430px]
          overflow-hidden
          rounded-none
          border border-white/40
          bg-gradient-to-br
          from-white/30
          via-white/15
          to-white/10
          backdrop-blur-3xl
          shadow-[0_18px_45px_rgba(0,0,0,0.12)]
        "
      >

        {/* Background Glow */}

        <div className="absolute inset-0">

          <div
            className="
              absolute
              -top-24
              -left-24
              h-72
              w-72
              rounded-full
              bg-white/40
              blur-3xl
            "
          />

          <div
            className="
              absolute
              bottom-0
              right-0
              h-60
              w-60
              rounded-full
              bg-[#A5BEAE]/40
              blur-3xl
            "
          />

        </div>


        <div className="relative z-10 px-10 py-10">

          {/* Heading */}

          <h1
            className="
              text-center
              text-[30px]
              font-semibold
              text-[#183B2D]
            "
            style={{
              fontFamily: "Manrope",
            }}
          >
            Create Your Account
          </h1>


          <p className="mt-2 text-center text-[#183B2D]/80 text-sm">
            Complete your account setup
          </p>


          {/* Verified Email */}

          <div className="mt-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-center">

            <p className="text-sm text-green-700 font-medium">
              ✓ Email verified
            </p>

            <p className="text-xs text-green-700 mt-1">
              {email}
            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >

            {/* Name */}

            <div>

              <label className="block text-[#183B2D] mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="
                  w-full
                  h-12
                  rounded-xl
                  border
                  border-white/40
                  bg-white/70
                  px-4
                  outline-none
                  focus:border-[#183B2D]
                "
              />

            </div>


            {/* Password */}

            <div>

              <label className="block text-[#183B2D] mb-2">
                Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    h-12
                    rounded-xl
                    border
                    border-white/40
                    bg-white/70
                    px-4
                    pr-12
                    outline-none
                    focus:border-[#183B2D]
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-[#183B2D]
                  "
                >

                  {showPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}

                </button>

              </div>

            </div>


            {/* Confirm Password */}

            <div>

              <label className="block text-[#183B2D] mb-2">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                  required
                  className={`
                    w-full
                    h-12
                    rounded-xl
                    border
                    bg-white/70
                    px-4
                    pr-12
                    outline-none
                    transition
                    ${
                      formData.confirmPassword &&
                      formData.password !==
                        formData.confirmPassword
                        ? "border-red-500"
                        : "border-white/40 focus:border-[#183B2D]"
                    }
                  `}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-[#183B2D]
                  "
                >

                  {showConfirmPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}

                </button>

              </div>


              {/* Password mismatch */}

              {formData.confirmPassword &&
                formData.password !==
                  formData.confirmPassword && (

                  <p className="mt-2 text-sm text-red-500">
                    Passwords do not match.
                  </p>

                )}


              {/* Password match */}

              {formData.confirmPassword &&
                formData.password ===
                  formData.confirmPassword && (

                  <p className="mt-2 text-sm text-green-600">
                    Passwords match ✓
                  </p>

                )}

            </div>


            {/* Create Account */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-12
                rounded-full
                bg-[#183B2D]
                text-white
                hover:bg-[#234636]
                transition
                disabled:opacity-50
              "
            >

              {loading
                ? "Creating Account..."
                : "Create Account"}

            </button>

          </form>


          {/* Login */}

          <div className="mt-8 text-center">

            <p className="text-[#183B2D]">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="
                font-semibold
                hover:underline
                text-[#183B2D]
              "
            >
              Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}