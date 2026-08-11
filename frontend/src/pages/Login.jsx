import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../api/googleAuth";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

const [formData, setFormData] = useState({
  email: "",
  password: "",
});

const [loading, setLoading] = useState(false);

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleLogin = async () => {
  if (!formData.email || !formData.password) {
    alert("Please fill all fields.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Invalid email or password.");
      return;
    }

    // Save JWT
    localStorage.setItem("token", data.access_token);

    alert("Login Successful!");

    navigate("/home");

  } catch (err) {
    console.error(err);
    alert("Server error.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-[#F8FBF8] flex items-center justify-center overflow-hidden relative">

      {/* Left Background */}
      <div className="absolute left-0 top-[22%] h-[58%] w-[62%] bg-[#A5BEAE]" />

      {/* Left Content */}
      <div className="absolute left-24 top-[56%] -translate-y-1/2 w-[42%]">

        <h1
          className="w-full text-right text-[76px] text-white font-light leading-[0.9] tracking-[-0.02em]"
          style={{ fontFamily: "Sansation" }}
        >
          WELCOME
          <br />
          BACK
        </h1>

        <p
          className="mt-8 ml-auto max-w-md text-right text-white/90 text-lg leading-relaxed"
          style={{ fontFamily: "Manrope" }}
        >
          Log in to access your reports, monitor your health history,
          and stay informed with AI-powered insights.
        </p>

      </div>

      {/* Login Card */}
      <div className="relative ml-[500px] w-[500px] rounded-none border border-white/40 bg-white/25 backdrop-blur-2xl shadow-2xl px-8 py-8">

        <h2
          className="text-center text-[42px] font-semibold text-[#183B2D]"
          style={{ fontFamily: "Manrope" }}
        >
          LOGIN
        </h2>

        {/* Email */}
        <div className="mt-10">
          <label className="text-[#183B2D] text-sm">
            Email 
          </label>

          <input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="Enter your email"
  className="mt-2 w-full h-12 rounded-xl bg-white/70 px-5 outline-none border border-white/30 focus:border-[#183B2D]"
/>
        </div>

        {/* Password */}
       <div className="mt-6">
  <label className="text-[#183B2D] text-sm">
    Password
  </label>

  <div className="relative mt-2">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="Enter your password"
      className="w-full h-14 rounded-xl bg-white/70 px-5 pr-14 outline-none border border-white/30 focus:border-[#183B2D]"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#183B2D] hover:text-[#244a3b]"
    >
      {showPassword ? (
        <FiEyeOff size={20} />
      ) : (
        <FiEye size={20} />
      )}
    </button>
  </div>

  <div className="text-right mt-2">
    <button
      type="button"
      className="text-sm text-[#183B2D] hover:underline"
    >
      Forgot Password?
    </button>
  </div>
</div>

        {/* Login Button */}
        <button
  onClick={handleLogin}
  disabled={loading}
  className="mt-8 w-full h-14 rounded-full bg-[#183B2D] text-white hover:bg-[#244a3b] transition duration-300 disabled:opacity-60"
>
  {loading ? "Logging in..." : "Login"}
</button>

        {/* Divider */}
        <div className="flex items-center my-7">
          <div className="flex-1 border-t border-[#183B2D]/30"></div>
          <span className="mx-4 text-[#183B2D]">or</span>
          <div className="flex-1 border-t border-[#183B2D]/30"></div>
        </div>

        {/* Google Button */}
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
        {/* Signup */}
        <div className="mt-8 text-center">
          <p className="text-[#183B2D]">
            Don't have an account?
          </p>

          <Link
            to="/signup"
            className="font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </div>

      </div>

    </div>
  );
}