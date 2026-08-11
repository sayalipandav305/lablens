import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#183B2D] text-white">
      <div className="max-w-7xl mx-auto px-8 py-10">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold">
              LabLens
            </h2>

            <p className="mt-2 text-sm text-[#C8D7D0]">
              Smarter insights from your medical reports.
            </p>
          </div>


          {/* Navigation */}
          <div className="flex items-center gap-8 text-sm text-[#C8D7D0]">

            <Link
              to="/home"
              className="hover:text-white transition"
            >
              Home
            </Link>

            <Link
              to="/upload-reports"
              className="hover:text-white transition"
            >
              Upload Reports
            </Link>

            <Link
              to="/medical-history"
              className="hover:text-white transition"
            >
              Medical History
            </Link>

            <Link
              to="/profile"
              className="hover:text-white transition"
            >
              Profile
            </Link>

          </div>

        </div>


        {/* Divider */}
        <div className="border-t border-white/10 mt-8 pt-6">

          <p className="text-center text-xs text-[#AFC1B9]">
            © 2026 LabLens. All rights reserved.
          </p>

        </div>

      </div>
    </footer>
  );
}