
import { Link } from "react-router-dom";
import { FaHeartbeat, FaUserCircle } from "react-icons/fa";
import { HiMenuAlt3 } from "react-icons/hi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FBF8] overflow-x-hidden">
      <Navbar />
      

     {/* ================= HERO SECTION ================= */}

    <section className="relative w-full min-h-[560px] sm:min-h-[650px] lg:min-h-[620px] xl:min-h-[600px] overflow-hidden">
      {/* Background */}
      {/* ECG Background */}
      {/* ================= Decorative Hero Background ================= */}
      <div className="absolute right-0 top-0 hidden md:block w-full max-w-[700px] h-[420px] lg:h-[620px] overflow-hidden pointer-events-none">

        {/* Green Glow */}
        <div className="absolute right-4 top-10 lg:right-8 lg:top-10 w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] lg:w-[330px] lg:h-[330px] rounded-full bg-[#4F7B63]/30 blur-[60px] lg:blur-[90px]" />

        {/* Glass Orb */}
        <div
          className="
            absolute
            right-8 sm:right-16 lg:right-24
            top-10 sm:top-12 lg:top-20
            w-[220px] h-[220px]
            sm:w-[300px] sm:h-[300px]
            lg:w-[420px] lg:h-[420px]
            rounded-full
            bg-gradient-to-br
            from-white/45
            via-white/15
            to-white/5
            backdrop-blur-3xl
            border
            border-white/30
            shadow-[0_25px_80px_rgba(0,0,0,0.18)]
          "
        >
          {/* Shine */}
          <div className="absolute top-5 left-5 lg:top-10 lg:left-10 w-20 h-20 lg:w-44 lg:h-44 rounded-full bg-white/45 blur-2xl lg:blur-3xl" />

          {/* Bottom Glow */}
          <div className="absolute bottom-5 right-6 lg:bottom-10 lg:right-12 w-16 h-16 lg:w-36 lg:h-36 rounded-full bg-[#8DB39D]/30 blur-2xl lg:blur-3xl" />
        </div>

        {/* Floating Card 1 */}
        <div
          className="
            absolute
            top-4 sm:top-8 lg:top-12
            right-[110px] sm:right-[160px] lg:right-[180px]
xl:right-[260px]
2xl:right-[320px]
            w-36 sm:w-44 lg:w-52
            rounded-2xl
            border
            border-white/30
            bg-white/25
            backdrop-blur-xl
            p-2.5 sm:p-3 lg:p-4
            shadow-xl
            
          "
        >
          <p className="text-[10px] sm:text-xs text-gray-500">Heart Rate</p>

          <h2 className="text-lg sm:text-2xl lg:text-3xl font-semibold text-[#214739] mt-1">
            72 <span className="text-xs sm:text-sm lg:text-base font-normal">BPM</span>
          </h2>

          <div className="mt-2 h-1.5 sm:h-2 rounded-full bg-green-200 overflow-hidden">
            <div className="w-3/4 h-full bg-[#4F7B63]" />
          </div>
        </div>

        {/* Floating Card 2 */}
        <div
          className="
            absolute
            bottom-16 sm:bottom-20 lg:bottom-24
            right-4 sm:right-6 lg:right-10
            w-40 sm:w-48 lg:w-56
            rounded-2xl
            border
            border-white/30
            bg-white/20
            backdrop-blur-xl
            p-2.5 sm:p-3 lg:p-4
            shadow-xl
            
          "
        >
          <p className="text-[10px] sm:text-xs text-gray-500">Blood Sugar</p>

          <h2 className="text-lg sm:text-2xl lg:text-3xl font-semibold text-[#214739] mt-1">
            96 <span className="text-xs sm:text-sm lg:text-base font-normal">mg/dL</span>
          </h2>

          <span className="inline-block mt-2 sm:mt-3 rounded-full bg-green-100 px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm text-[#3F6E59]">
            Normal
          </span>
        </div>

        {/* Floating Card 3 — hidden below lg to avoid crowding the glass orb on tablets */}
        <div
          className="
            hidden lg:block
            absolute
            top-[340px]
            right-[330px]
            w-48
            rounded-2xl
            border
            border-white/30
            bg-white/20
            backdrop-blur-xl
            p-4
            shadow-xl
            
          "
        >
          <p className="text-xs text-gray-500">Vitamin D</p>

          <h2 className="text-3xl font-semibold text-[#214739]">
            38
          </h2>

          <p className="text-sm text-[#4F7B63] mt-2">
            Healthy
          </p>
        </div>

      </div>

      <div className="absolute right-0 top-4 sm:top-8 lg:top-16 hidden sm:flex w-full max-w-[650px]
xl:max-w-[820px] h-[260px] sm:h-[340px] lg:h-[420px] items-center justify-center pointer-events-none">

        <svg
          className="w-full h-full"
          viewBox="0 0 900 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Glow */}
          <path
            d="M0 150
               L120 150
               L150 150
               L180 120
               L200 190
               L225 70
               L255 230
               L290 150
               L420 150
               L450 150
               L480 120
               L500 190
               L525 70
               L555 230
               L590 150
               L900 150"
            stroke="#4F7B63"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
            filter="url(#glow)"
          />

          {/* Main ECG */}
          <path
            className="ecg-line"
            d="M0 150
               L120 150
               L150 150
               L180 120
               L200 190
               L225 70
               L255 230
               L290 150
               L420 150
               L450 150
               L480 120
               L500 190
               L525 70
               L555 230
               L590 150
               L900 150"
            stroke="#3F6E59"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

      </div>

      {/* Glass Card */}
      <div
        className="
          relative
          mx-4 sm:mx-8 lg:mx-0
          lg:absolute
          
          top-0 lg:top-40
          mt-8 sm:mt-16 md:mt-[440px] lg:mt-0
          
          left-4
sm:left-8
lg:left-14
xl:left-24

w-[92%]
sm:w-[80%]
lg:w-[600px]
xl:w-[720px]
2xl:w-[780px]

max-w-[780px]
          overflow-hidden
          rounded-[8px]
          border
          border-white/50
          backdrop-blur-[58px]
        "
      >
        {/* Top glossy reflection */}
        <div className="absolute -top-24 -left-32 w-[420px] h-[220px] rounded-full bg-white/55 blur-3xl opacity-90" />

        {/* Right green glow */}
        <div className="absolute top-0 right-0 w-[180px] h-full" />

        {/* Bottom highlight */}
        <div className="absolute bottom-[-80px] left-24 w-[500px] h-[150px] rounded-full bg-white/20 blur-3xl" />

        {/* Thin inner shine */}

        <div className="relative z-10 p-6 sm:p-8 lg:p-0">

          <h3
            className="text-[34px]
sm:text-[44px]
lg:text-[54px]
xl:text-[66px]
2xl:text-[72px] text-[#08372D] leading-[0.95] lg:leading-[0.92] drop-shadow-md"
            style={{ fontFamily: "Manrope", fontWeight: "500" }}
            
          >
            Get started..
          </h3>

          <p
            className="mt-3 text-[#A5A5A5] text-base
sm:text-lg
lg:text-xl
xl:text-xl leading-7 sm:leading-8 lg:leading-10 max-w-full lg:max-w-[720px]"
            style={{ fontFamily: "Manrope", fontWeight: "100" }}
          >
            Set up your profile to unlock personalized health
            insights and smarter report explanations.
          </p>

          <button
            className="
              mt-8 sm:mt-10
              px-6 sm:px-8 lg:px-10
              h-12 sm:h-14 lg:h-15
              rounded-md
              bg-[#3E664F]
              text-white
              text-base sm:text-xl lg:text-2xl
              hover:bg-[#31523F]
              transition
              shadow-lg
              font-weight-50
              w-full sm:w-auto
            "
          >
            <Link to="/medical-profile" className="w-full h-full flex items-center justify-center">
              Complete profile →
            </Link>
          </button>

        </div>
      </div>

    </section>

      <section
  id="why"
  className="flex justify-center py-24 bg-[#F8FBF8]"
>
  <div
    className="
      w-[90%]
max-w-6xl
xl:max-w-7xl
      bg-[#F8F5ED]
      shadow-md
      px-10
      md:px-16
      py-16
      text-center
    "
  >
    <h2
      className="text-xl
lg:text-5xl
xl:text-6xl text-[#183B2D]"
      style={{
        fontFamily: "Sansation",
        fontWeight: 400,
      }}
    >
      Why Choose LabLens?
    </h2>

    <p
       className="
    mt-10
    text-[#6D6D6D]
    text-lg
xl:text-xl

leading-9
xl:leading-[48px]

max-w-5xl
    mx-auto
  "
  style={{
    fontFamily: "Manrope",
    fontWeight: 300,
  }}
    >
      LabLens transforms complex medical reports into clear,
      easy-to-understand insights, helping you take control of
      your health with confidence. Instead of struggling to
      interpret technical medical terms and numbers, users
      receive simplified explanations of their test results
      along with personalized insights tailored to their health
      data.

      <br />
      <br />

      The platform securely stores all uploaded reports in one
      place, making it easy to access past records and track
      health progress over time. With intelligent trend
      analysis, LabLens helps identify changes in important
      health parameters such as blood sugar, cholesterol,
      hemoglobin, and more through interactive graphs and
      visualizations.

      <br />
      <br />

      The platform highlights abnormal values, explains their
      significance, and provides actionable recommendations to
      support healthier lifestyle choices. By combining medical
      data organization, AI-powered analysis, and long-term
      health tracking, LabLens empowers users to make informed
      decisions and better understand their overall well-being.
    </p>
  </div>
</section>

    <Footer />
  </div>

);}
