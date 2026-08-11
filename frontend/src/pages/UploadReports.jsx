import { useState,useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function UploadReports() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
const [loading, setLoading] = useState(false);
const [previousReports, setPreviousReports] = useState([]);

useEffect(() => {
  const fetchReports = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reports`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Reports status:", response.status);
      console.log("Reports data:", data);

      if (!response.ok) {
        console.error("Failed to fetch reports:", data);
        return;
      }

      setPreviousReports(data);
    } catch (error) {
      console.error("Error fetching previous reports:", error);
    }
  };

  fetchReports();
}, [navigate]);

  const handleUpload = async (e) => {
  e.preventDefault();

  if (!file) {
    alert("Please select a PDF report.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  setLoading(true);

  try {
    const token = localStorage.getItem("token");

if (!token) {
  alert("Please login again.");
  navigate("/login");
  return;
}

const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

    const data = await response.json();

    navigate("/report-summary", {
      state: {
        result: data,
      },
    });
  }catch (error) {
  console.error("Upload Error:", error);
  alert(error.message);
}finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#F8FBF8]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#183B2D] mb-3">
          Upload Reports
        </h1>

        <p className="text-[#365E4B] mb-8">
          Please upload your medical reports in PDF format. Ensure the file is
          clear and readable.
        </p>

        {/* Upload Card */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-10">
          <form onSubmit={handleUpload}>
            <label className="block text-sm font-medium text-[#183B2D] mb-2">
              Select Report
            </label>

            <input
  type="file"
  accept=".pdf"
  onChange={(e) => setFile(e.target.files[0])}
  className="w-full border border-gray-300 rounded-lg p-3 mb-6"
/>

           <button
  type="submit"
  disabled={loading}
  className="bg-[#183B2D] text-white px-8 py-3 rounded-lg hover:bg-[#2c5744] transition disabled:opacity-50"
>
  {loading ? "Analyzing Report..." : "Upload Report"}
</button>
          </form>
        </div>

        {/* Previous Reports */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-[#183B2D] mb-6">
            Previously Uploaded Reports
          </h2>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
             <thead className="bg-[#F3F7F4]">
  <tr>
    <th className="text-left px-6 py-4">Report Name</th>
    <th className="text-left px-6 py-4">Upload Date</th>
    <th className="text-left px-6 py-4">Summary</th>
    <th className="text-right px-6 py-4">Action</th>
  </tr>
</thead>

              <tbody>
  {previousReports.length > 0 ? (
    previousReports.map((report) => (
      <tr
        key={report.id}
        className="border-t border-gray-200"
      >
        {/* Report Name */}
        <td className="px-6 py-5">
          <p className="font-medium text-[#183B2D]">
            {report.filename}
          </p>
        </td>

        {/* Upload Date */}
        <td className="px-6 py-5 text-gray-600">
          {new Date(report.upload_date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </td>

        {/* Summary */}
        <td className="px-6 py-5">
          {Array.isArray(report.summary) ? (
            <ul className="text-sm text-gray-600 space-y-1">
              {report.summary.map((item, index) => (
                <li key={index}>
                  • {item}
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-sm text-gray-600">
              {report.summary || "No summary available"}
            </span>
          )}
        </td>

        {/* Action */}
        <td className="px-6 py-5 text-right">
          <button
  type="button"
  className="text-[#183B2D] hover:underline font-medium"
  onClick={() =>
    navigate("/report-summary", {
      state: {
        result: {
          id: report.id,
          filename: report.filename,
          upload_date: report.upload_date,
          health_score: report.health_score,
          summary: report.summary,
          tests: report.analysis_json || [],
        },
      },
    })
  }
>
  View Analysis
</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan={4}
        className="text-center py-8 text-gray-500"
      >
        No reports uploaded yet.
      </td>
    </tr>
  )}
</tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}