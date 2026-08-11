import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { googleAuth } from "../api/googleAuth";
export default function Signup() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F8FBF8] flex items-center justify-center overflow-hidden relative">

      {/* Left Panel */}
      <div className="absolute left-0 top-[22%] h-[58%] w-[62%] bg-[#A5BEAE]" />

      <div className="absolute left-24 top-1/2 -translate-y-1/2 w-[42%] text-right">
        <h1
          className="text-[80px] font-light text-white leading-[0.9] tracking-[-0.01em]"
          style={{ fontFamily: "Sansation" }}
        >
          START YOUR
          <br />
          HEALTH
          <br />
          JOURNEY
        </h1>

        <p
          className="mt-8 w-full text-right text-white/90 text-xl"
          style={{ fontFamily: "Manrope" }}
        >
          Create your account to upload reports, track your health
          history, and understand your results with confidence.
        </p>
      </div>

      {/* Glass Card */}
      <div className="relative ml-[500px] w-[500px] rounded-none border border-white/40 bg-white/25 backdrop-blur-xl shadow-2xl p-12">

        <h2
          className="text-center text-4xl font-semibold text-[#183B2D]"
          style={{ fontFamily: "Manrope" }}
        >
          SIGN UP
        </h2>

        {/* Google Sign In */}
        
<GoogleLogin
  onSuccess={async (credentialResponse) => {
    console.log("STEP 1: Google Success");
    console.log(credentialResponse);

    try {
      console.log("STEP 2: Calling backend");

      const data = await googleAuth(credentialResponse.credential);

      console.log("STEP 3: Backend response", data);

      navigate("/home");
    } catch (err) {
      console.error("STEP 4:", err);
      alert(err.message);
    }
  }}
  onError={() => {
    console.log("Google Login Failed");
  }}
/>

        <p className="text-center text-3xl my-6 text-[#183B2D]">or</p>

        {/* Email Sign Up */}
        <Link to="/email-signup">
          <button className="w-full h-16 rounded-full border border-[#183B2D] hover:bg-white/40 transition">
            Continue with Email
          </button>
        </Link>

        <div className="border-t border-black/40 my-10" />

        <p className="text-center text-[#183B2D]">
          Already have an account?
        </p>

        <Link
          to="/login"
          className="block text-center font-semibold mt-2 text-[#183B2D] hover:underline"
        >
          Login
        </Link>

      </div>
    </div>
  );
}