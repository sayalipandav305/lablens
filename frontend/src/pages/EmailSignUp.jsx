import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function EmailSignup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);

  const [verified, setVerified] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");


  // ============================================================
  // OTP INPUT
  // ============================================================

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      document
        .getElementById(`otp-${index + 1}`)
        ?.focus();
    }
  };


  // ============================================================
  // BACKSPACE
  // ============================================================

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {

      if (otp[index]) {
        const newOtp = [...otp];

        newOtp[index] = "";

        setOtp(newOtp);

        return;
      }

      if (index > 0) {
        document
          .getElementById(`otp-${index - 1}`)
          ?.focus();
      }
    }
  };


  // ============================================================
  // SEND OTP
  // ============================================================

  const handleSendOtp = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/send-signup-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Send OTP status:",
        response.status
      );

      console.log(
        "Send OTP response:",
        data
      );

      if (!response.ok) {
        setError(
          typeof data.detail === "string"
            ? data.detail
            : "Unable to send OTP."
        );

        return;
      }

      // OTP has been sent
      setOtpSent(true);

      // Reset OTP boxes
      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      setMessage(
        "OTP sent successfully. Check your email."
      );

    } catch (error) {

      console.error(
        "Send OTP error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );

    } finally {

      setLoading(false);

    }
  };


  // ============================================================
  // VERIFY OTP
  // ============================================================

  const handleVerifyOtp = async () => {

    setError("");
    setMessage("");

    const enteredOtp = otp.join("");

    // Make sure all 6 digits are entered
    if (enteredOtp.length !== 6) {
      setError(
        "Please enter the complete 6-digit OTP."
      );

      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
       `${import.meta.env.VITE_API_URL}/verify-signup-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            otp: enteredOtp,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Verify OTP status:",
        response.status
      );

      console.log(
        "Verify OTP response:",
        data
      );

      // --------------------------------------------------------
      // OTP INVALID
      // --------------------------------------------------------

      if (!response.ok) {

        setError(
          typeof data.detail === "string"
            ? data.detail
            : "Invalid OTP."
        );

        return;
      }


      // --------------------------------------------------------
      // OTP VERIFIED
      // --------------------------------------------------------

      setVerified(true);

      setMessage(
        "Email verified successfully ✓"
      );

      /*
        Wait briefly so the user can see
        the "Email Verified" state.
      */

      setTimeout(() => {

        navigate(
          "/create-password",
          {
            state: {
              email: email.trim(),
              emailVerified: true,
            },
          }
        );

      }, 800);

    } catch (error) {

      console.error(
        "Verify OTP error:",
        error
      );

      setError(
        "Unable to connect to the server."
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
              text-[40px]
              font-semibold
              text-[#183B2D]
            "
            style={{
              fontFamily: "Manrope",
            }}
          >
            SIGN UP
          </h1>


          {/* Email */}

          <div className="mt-10">

            <label className="block text-[#183B2D] mb-2">
              Enter email address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={otpSent}
              className="
                w-full
                h-12
                rounded-xl
                border
                border-white/40
                bg-white/70
                px-4
                outline-none
                transition
                focus:border-[#183B2D]
                disabled:opacity-60
              "
            />

          </div>


          {/* Error */}

          {error && (

            <p
              className="
                mt-3
                text-sm
                text-red-600
              "
            >
              {error}
            </p>

          )}


          {/* Success Message */}

          {message && (

            <p
              className="
                mt-3
                text-sm
                text-[#183B2D]
              "
            >
              {message}
            </p>

          )}


          {/* ================================================== */}
          {/* SEND OTP */}
          {/* ================================================== */}

          {!otpSent && (

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="
                mt-8
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
                ? "Sending OTP..."
                : "Send OTP"}

            </button>

          )}


          {/* ================================================== */}
          {/* OTP SECTION */}
          {/* ================================================== */}

          {otpSent && (

            <>

              <p
                className="
                  mt-8
                  text-center
                  text-[#183B2D]
                  font-medium
                "
              >
                Enter OTP
              </p>


              {/* OTP BOXES */}

              <div
                className="
                  flex
                  justify-between
                  mt-5
                "
              >

                {otp.map(
                  (digit, index) => (

                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      disabled={verified}
                      onChange={(e) =>
                        handleOtpChange(
                          e.target.value,
                          index
                        )
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(
                          e,
                          index
                        )
                      }
                      className="
                        h-12
                        w-12
                        rounded-lg
                        border
                        border-white/40
                        bg-white/70
                        text-center
                        text-xl
                        outline-none
                        focus:border-[#183B2D]
                        disabled:opacity-60
                      "
                    />

                  )
                )}

              </div>


              {/* ================================================== */}
              {/* VERIFY OTP BUTTON */}
              {/* ================================================== */}

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={
                  loading ||
                  verified
                }
                className="
                  mt-8
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

                {verified
                  ? "✓ Email Verified"
                  : loading
                    ? "Verifying..."
                    : "Verify OTP"}

              </button>


              {/* ================================================== */}
              {/* RESEND OTP */}
              {/* ================================================== */}

              {!verified && (

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="
                    mt-4
                    w-full
                    text-sm
                    text-[#183B2D]
                    hover:underline
                    disabled:opacity-50
                  "
                >
                  Resend OTP
                </button>

              )}

            </>

          )}


          {/* Login */}

          <div className="mt-10 text-center">

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