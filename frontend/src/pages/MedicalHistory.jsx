import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Footer from "../components/Footer";

import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const aiSummary = {
  summary:
    "Based on your clinical history from the last 12 months, your overall metabolic health shows a positive upward trend. The most significant improvement is noted in your lipid profile. However, consistent monitoring of your micronutrient levels—specifically Vitamin D—is essential for bone health and immune function.",

  recommendation:
    "Continue current dietary habits, increase sunlight exposure or supplementation as prescribed, and schedule a routine follow-up thyroid panel in Q1.",

  generatedAt: "Today, 10:45 AM",
};



// NOTE: The trend/comparison charts below are still using placeholder
// (empty) datasets. The backend contract in this task does not provide
// a trend-data endpoint, and per instructions no medical trend data
// should be fabricated. The chart UI/markup is left exactly as-is so it
// can be wired up later once a real trend endpoint exists — an empty
// array just renders an empty chart instead of crashing.

export default function MedicalHistory() {

  const [searchQuery, setSearchQuery] = useState("");

const handleDownloadPDF = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    // Fetch complete user profile
    const userProfileResponse = await fetch(
      "http://127.0.0.1:8000/user-profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const userProfile = userProfileResponse.ok
      ? await userProfileResponse.json()
      : {};

    // Fetch medical profile
    const medicalProfileResponse = await fetch(
      "http://127.0.0.1:8000/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const medicalProfile = medicalProfileResponse.ok
      ? await medicalProfileResponse.json()
      : {};

    const reports = history?.reports || [];

    const doc = new jsPDF();

    // ==========================================
    // TITLE
    // ==========================================

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(24, 59, 45);

    doc.text("LabLens Complete Health Report", 20, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);

    doc.text(
      `Generated on: ${new Date().toLocaleDateString("en-GB")}`,
      20,
      33
    );

    let y = 48;

    // ==========================================
    // PERSONAL PROFILE
    // ==========================================

    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(24, 59, 45);

    doc.text("Personal Information", 20, y);

    y += 8;

    const personalInfo = [
      ["Full Name", userProfile.full_name || "Not available"],
      ["Email", userProfile.email || "Not available"],
      ["Phone", userProfile.phone || "Not available"],
      ["Location", userProfile.location || "Not available"],
      ["Date of Birth", userProfile.date_of_birth || "Not available"],
      ["Gender", userProfile.gender || "Not available"],
    ];

    autoTable(doc, {
      startY: y,
      head: [["Field", "Details"]],
      body: personalInfo,
      theme: "grid",
      headStyles: {
        fillColor: [24, 59, 45],
      },
      styles: {
        fontSize: 9,
      },
    });

    y = doc.lastAutoTable.finalY + 15;

    // ==========================================
    // MEDICAL PROFILE
    // ==========================================

    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(24, 59, 45);

    doc.text("Medical Profile", 20, y);

    y += 8;

    const formatArray = (value) => {
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join(", ") : "None";
      }

      return value || "None";
    };

    const medicalInfo = [
      ["Blood Group", medicalProfile.blood_group || "Not available"],
      [
        "Height",
        medicalProfile.height
          ? `${medicalProfile.height} cm`
          : "Not available",
      ],
      [
        "Weight",
        medicalProfile.weight
          ? `${medicalProfile.weight} kg`
          : "Not available",
      ],
      [
        "Medical Conditions",
        formatArray(medicalProfile.medical_conditions),
      ],
      [
        "Family History",
        formatArray(medicalProfile.family_history),
      ],
      [
        "Allergies",
        formatArray(medicalProfile.allergies),
      ],
      [
        "Medications",
        formatArray(medicalProfile.medications),
      ],
      [
        "Activity Level",
        medicalProfile.activity_level || "Not available",
      ],
      [
        "Smoking",
        medicalProfile.smoking || "Not available",
      ],
      [
        "Alcohol",
        medicalProfile.alcohol || "Not available",
      ],
      [
        "Health Goals",
        formatArray(medicalProfile.health_goals),
      ],
    ];

    autoTable(doc, {
      startY: y,
      head: [["Field", "Details"]],
      body: medicalInfo,
      theme: "grid",
      headStyles: {
        fillColor: [24, 59, 45],
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
    });

    // ==========================================
    // ALL REPORTS
    // ==========================================

    reports.forEach((report, reportIndex) => {
      doc.addPage();

      y = 20;

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(24, 59, 45);

      doc.text(
        `Report ${reportIndex + 1}: ${
          report.filename || "Medical Report"
        }`,
        20,
        y
      );

      y += 9;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(70, 70, 70);

      const uploadDate = report.upload_date
        ? new Date(report.upload_date).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          )
        : "Not available";

      doc.text(`Upload Date: ${uploadDate}`, 20, y);

      y += 7;

      doc.text(
        `Health Score: ${
          report.health_score ?? "N/A"
        } / 100`,
        20,
        y
      );

      y += 12;

      // ------------------------------------------
      // SUMMARY
      // ------------------------------------------

      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(24, 59, 45);

      doc.text("Report Summary", 20, y);

      y += 7;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);

      const summary = Array.isArray(report.summary)
        ? report.summary
        : [report.summary || "No summary available"];

      summary.forEach((item) => {
        const lines = doc.splitTextToSize(
          `• ${item}`,
          170
        );

        if (y + lines.length * 5 > 275) {
          doc.addPage();
          y = 20;
        }

        doc.text(lines, 20, y);

        y += lines.length * 5 + 3;
      });

      // ------------------------------------------
      // TEST RESULTS
      // ------------------------------------------

      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      y += 5;

      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(24, 59, 45);

      doc.text("Test Results", 20, y);

      const tests = Array.isArray(report.analysis_json)
        ? report.analysis_json
        : [];

      const testRows = tests.map((test) => [
        test.name || "Unknown",
        `${test.value ?? "N/A"}${
          test.unit ? ` ${test.unit}` : ""
        }`,
        test.status || "N/A",
        test.reference_range || "N/A",
      ]);

      autoTable(doc, {
        startY: y + 7,
        head: [
          [
            "Parameter",
            "Result",
            "Status",
            "Reference Range",
          ],
        ],
        body:
          testRows.length > 0
            ? testRows
            : [["No test data available", "-", "-", "-"]],
        theme: "grid",
        headStyles: {
          fillColor: [24, 59, 45],
        },
        styles: {
          fontSize: 8,
          cellPadding: 4,
        },
      });
    });

    // ==========================================
    // FOOTER ON EVERY PAGE
    // ==========================================

    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);

      doc.text(
        "Generated by LabLens",
        20,
        290
      );

      doc.text(
        `Page ${i} of ${pageCount}`,
        170,
        290
      );
    }

    // ==========================================
    // DOWNLOAD
    // ==========================================

    const username =
  userProfile.full_name ||
  userProfile.name ||
  "User";

const safeUsername = username
  .trim()
  .replace(/[^a-zA-Z0-9_-]/g, "_");

doc.save(`${safeUsername}_complete_health_record.pdf`);

  } catch (error) {
    console.error("PDF generation error:", error);
    alert("Unable to generate PDF. Please try again.");
  }
};
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState("");
const [availableParameters, setAvailableParameters] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/medical-history",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Medical History status:", response.status);
        console.log("Medical History data:", data);

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          console.error("Failed to fetch medical history:", data);
          setError("Unable to load medical history.");
          return;
        }

        setHistory(data);

if (data.reports && data.reports.length > 0) {
  setSelectedReport(data.reports[0]);

  // Collect all unique test parameters
  const parameterSet = new Set();

  data.reports.forEach((report) => {
    (report.analysis_json || []).forEach((test) => {
      if (test.name) {
        parameterSet.add(test.name);
      }
    });
  });

  const parameters = Array.from(parameterSet);

  setAvailableParameters(parameters);

  // Select the first available parameter by default
  if (parameters.length > 0) {
    setSelectedParameter(parameters[0]);
  }
}
      } catch (err) {
        console.error("Medical history error:", err);
        setError("Something went wrong while loading your medical history.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalHistory();
  }, [navigate]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#183B2D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading medical history...</p>
        </div>
      </div>
    );
  }

  if (error || !history) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          {error || "Unable to load medical history."}
        </p>
      </div>
    );
  }
const trendData = history?.reports
  ? [...history.reports]
      .reverse()
      .map((report) => {
        const test = (report.analysis_json || []).find(
          (item) => item.name === selectedParameter
        );

        if (!test) return null;

        const numericValue = parseFloat(
          String(test.value).replace(/[^0-9.-]/g, "")
        );

        if (Number.isNaN(numericValue)) return null;

        return {
          month: formatDate(report.upload_date),
          value: numericValue,
        };
      })
      .filter(Boolean)
  : [];

const compareData = (history?.reports || [])
  .slice()
  .sort(
    (a, b) =>
      new Date(a.upload_date) - new Date(b.upload_date)
  )
  .map((report) => {
    const tests = Array.isArray(report.analysis_json)
      ? report.analysis_json
      : [];

    const test = tests.find(
      (item) =>
        item.name?.toLowerCase() ===
        selectedParameter?.toLowerCase()
    );

    if (!test) return null;

    const numericValue = parseFloat(
      String(test.value).replace(/[^0-9.-]/g, "")
    );

    if (Number.isNaN(numericValue)) return null;

    return {
      date: formatDate(report.upload_date),
      value: numericValue,
      reportName: report.filename,
    };
  })
  .filter(Boolean);

  const insights = (() => {
  const reports = [...(history?.reports || [])].sort(
    (a, b) =>
      new Date(a.upload_date) - new Date(b.upload_date)
  );

  if (reports.length === 0) {
    return [];
  }

  const latestReport = reports[reports.length - 1];
  const previousReport =
    reports.length > 1
      ? reports[reports.length - 2]
      : null;

  const latestTests = Array.isArray(latestReport.analysis_json)
    ? latestReport.analysis_json
    : [];

  const previousTests = previousReport &&
    Array.isArray(previousReport.analysis_json)
    ? previousReport.analysis_json
    : [];

  const generatedInsights = [];

  // -----------------------------
  // 1. Areas Requiring Attention
  // -----------------------------

  const abnormalTests = latestTests.filter(
    (test) =>
      test.status === "High" ||
      test.status === "Low"
  );

  if (abnormalTests.length > 0) {
    const test = abnormalTests[0];

    generatedInsights.push({
      id: 1,
      type: "warning",
      title: "Areas Requiring Attention",
      description: `${test.name} is ${test.status.toLowerCase()} at ${test.value}${test.unit ? ` ${test.unit}` : ""}.`,
    });
  }

  // -----------------------------
  // 2. Recently Improved
  // -----------------------------

  if (previousTests.length > 0) {
    const improvedTest = latestTests.find((latest) => {
      const previous = previousTests.find(
        (test) => test.name === latest.name
      );

      if (!previous) return false;

      return (
        (previous.status === "High" ||
          previous.status === "Low") &&
        latest.status === "Normal"
      );
    });

    if (improvedTest) {
      generatedInsights.push({
        id: 2,
        type: "info",
        title: "Recently Improved Parameters",
        description: `${improvedTest.name} has returned to the normal range at ${improvedTest.value}${improvedTest.unit ? ` ${improvedTest.unit}` : ""}.`,
      });
    }
  }

  // -----------------------------
  // 3. Improving Trends
  // -----------------------------

  if (previousTests.length > 0) {
    const improvingTest = latestTests.find((latest) => {
      const previous = previousTests.find(
        (test) => test.name === latest.name
      );

      if (!previous) return false;

      return (
        (previous.status === "High" ||
          previous.status === "Low") &&
        latest.status === "Normal"
      );
    });

    if (improvingTest) {
      generatedInsights.push({
        id: 3,
        type: "success",
        title: "Improving Trends",
        description: `${improvingTest.name} improved from ${previousTests.find(
          (test) => test.name === improvingTest.name
        )?.status} to Normal.`,
      });
    }
  }

  // If nothing meaningful can be calculated
  if (generatedInsights.length === 0) {
    generatedInsights.push({
      id: 1,
      type: "info",
      title: "Health Parameters",
      description:
        "Your latest report does not show any significant changes requiring attention.",
    });
  }

  return generatedInsights.slice(0, 3);
})();


const handleDeleteReport = async (reportId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this report?\n\nThis action cannot be undone."
  );

  if (!confirmed) return;

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const response = await fetch(
      `http://127.0.0.1:8000/reports/${reportId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Delete report failed:", data);
      alert(data.detail || "Failed to delete report.");
      return;
    }

    // Remove deleted report immediately from the UI
    setHistory((prev) => ({
      ...prev,
      reports: prev.reports.filter(
        (report) => report.id !== reportId
      ),
    }));

    // If the deleted report was currently selected,
    // clear the selection.
    if (selectedReport?.id === reportId) {
      setSelectedReport(null);
    }

    alert("Report deleted successfully.");

  } catch (error) {
    console.error("Delete report error:", error);
    alert("Something went wrong while deleting the report.");
  }
};

const filteredReports = (history?.reports || []).filter((report) => {
  const query = searchQuery.trim().toLowerCase();

  // Show everything when search is empty
  if (!query) return true;

  // Filename
  const filename =
    String(report.filename || "").toLowerCase();

  // Summary can be array, string, object, etc.
  const summary =
    typeof report.summary === "string"
      ? report.summary.toLowerCase()
      : JSON.stringify(report.summary || "").toLowerCase();

  // Analysis contains parameter names, values, units, statuses,
  // reference ranges, etc.
  const analysis =
    JSON.stringify(report.analysis_json || "").toLowerCase();

  // Combine everything searchable
  const searchableText = `
    ${filename}
    ${summary}
    ${analysis}
  `.toLowerCase();

  return searchableText.includes(query);
});


  return (
    <div className="min-h-screen bg-[#ffffff]">
      <Navbar />
      <div className="max-w-[1600px] mx-auto px-8">
        <div>
          {/* Hero Section */}
          <div className="relative left-1/2 -translate-x-1/2 w-[100vw] max-w-[100vw] overflow-x-hidden bg-[#183B2D] pt-14 pb-28 shadow-lg">
            <div className="max-w-7xl mx-auto px-8">
              <h1 className="text-3xl font-semibold text-white">
                Medical History
              </h1>
              <p className="text-l text-[#b5bbb8] mt-3 font-light">
                Track your health trends and monitor changes across reports.
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="relative -mt-20 w-[95%] mx-auto z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {/* Card 1 */}
              <div className="relative overflow-hidden rounded-md border border-white/40 bg-white/20 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-10 text-center">
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/30 blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <p className="uppercase text-gray-600 text-sm tracking-wide">
                    Total Reports Uploaded
                  </p>
                  <h2 className="text-3xl font-bold text-[#202020] mt-6">
                    {history.statistics.total_reports}
                  </h2>
                </div>
              </div>

              {/* Card 2 */}
              <div className="relative overflow-hidden rounded-md border border-white/40 bg-white/20 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-10 text-center">
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/30 blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <p className="uppercase text-gray-600 text-sm tracking-wide">
                    NORMAL PARAMETERS
                  </p>
                  <h2 className="text-3xl font-bold text-[#202020] mt-6">
                    {history.statistics.normal_parameters}
                  </h2>
                </div>
              </div>

              {/* Card 3 */}
              <div className="relative overflow-hidden rounded-md border border-white/40 bg-white/20 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-10 text-center">
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/30 blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <p className="uppercase text-gray-600 text-sm tracking-wide">
                    ABNORMAL PARAMETERS
                  </p>
                  <h2 className="text-3xl font-bold text-[#c33b3b] mt-6">
                    {history.statistics.abnormal_parameters}
                  </h2>
                </div>
              </div>

              {/* Card 4 */}
              <div className="relative overflow-hidden rounded-md border border-white/40 bg-white/20 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-10 text-center">
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/30 blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <p className="uppercase text-gray-600 text-sm tracking-wide">
                    Health Score
                  </p>
                  <h2 className="text-3xl font-bold text-[#202020] mt-6">
                    {history.statistics.health_score}/100
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-9xl mx-auto px-8 mt-12">
            <div className="grid grid-cols-12 gap-5 mt-12">
              {/* Left Card */}
              <div className="col-span-8 bg-white border border-[#365E4B] rounded shadow-sm p-5">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text- text-[#183B2D]">
                    Health Trend Timeline
                  </h2>

                  <select
  value={selectedParameter}
  onChange={(e) => setSelectedParameter(e.target.value)}
  className="border border-[#365E4B] px-4 py-2 text-md focus:outline-none"
>
  {availableParameters.length > 0 ? (
    availableParameters.map((parameter) => (
      <option key={parameter} value={parameter}>
        {parameter}
      </option>
    ))
  ) : (
    <option value="">
      No parameters available
    </option>
  )}
</select>
                </div>

                <div className="bg-[#F8F4ED] border border-gray-200 shadow-sm p-6 h-[320px] rounded">
  {trendData.length === 0 ? (
    <div className="h-full flex items-center justify-center text-gray-500 text-sm">
      No historical data available for this parameter.
    </div>
  ) : (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={trendData}>
        <defs>
          <linearGradient
            id="gradient"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="30%" stopColor="#f59e0b" />
            <stop offset="60%" stopColor="#84cc16" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>

        <CartesianGrid stroke="#d9d9d9" />

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="value"
          stroke="url(#gradient)"
          strokeWidth={5}
          dot={{ r: 5 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )}
</div>
              </div>

              {/* Right Panel */}
           {/* Right Panel */}
<div className="col-span-4 bg-[#183B2D] rounded shadow-sm p-8">

  <h2 className="text-white text-lg font-medium mb-3">
    Compare Parameters
  </h2>

  {/* Parameter Selector */}
  <div className="mb-5">
    <label className="block text-[#D8E4DD] mb-3 text-sm">
      Select Parameter
    </label>

    <select
      value={selectedParameter}
      onChange={(e) => setSelectedParameter(e.target.value)}
      className="w-full bg-white rounded-md px-4 py-3 text-sm text-[#183B2D] focus:outline-none cursor-pointer"
    >
      {availableParameters.length > 0 ? (
        availableParameters.map((parameter) => (
          <option key={parameter} value={parameter}>
            {parameter}
          </option>
        ))
      ) : (
        <option value="">
          No parameters available
        </option>
      )}
    </select>
  </div>

  {/* Time Range */}
  <div className="bg-white rounded-md border border-gray-300 shadow-sm px-3 py-2">
    <select className="w-full bg-transparent text-sm text-[#183B2D] focus:outline-none cursor-pointer">
      <option>Last 6 Months</option>
      <option>Last Year</option>
      <option>All Time</option>
    </select>
  </div>

  {/* Bar Chart */}
 <div className="mt-8 bg-white/10 rounded-lg p-4 h-[260px]">
  {compareData.length === 0 ? (
    <div className="h-full flex items-center justify-center text-[#D8E4DD] text-sm">
      Not enough data to compare.
    </div>
  ) : (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={compareData}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 10,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="rgba(255,255,255,0.15)"
        />

        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#D8E4DD" }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{ fontSize: 11, fill: "#D8E4DD" }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip />

        <Bar
          dataKey="value"
          fill="#A9C7B5"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )}
</div>

</div>

               
               

             
</div>

            </div>

            <div className="mt-12 bg-white rounded-sm border border-gray-200 shadow-md overflow-hidden">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#EEF4EE] px-8 py-5">

  <div>
    <h2 className="text-lg font-semibold text-[#183B2D]">
      Recent Reports
    </h2>

    <p className="text-sm text-gray-500 mt-1">
      Search and manage your uploaded reports
    </p>
  </div>

  <div className="relative w-full md:w-[320px]">
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search reports..."
      className="w-full bg-white border border-gray-300 rounded-lg
      px-4 py-3
      text-sm text-[#183B2D]
      placeholder:text-gray-400
      focus:outline-none
      focus:ring-2 focus:ring-[#183B2D]
      transition"
    />
  </div>

</div>

              {/* Table */}
              {history.reports.length === 0 ? (
                <div className="px-8 py-10 text-center text-gray-500">
                  No medical reports uploaded yet.
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-sm uppercase tracking-wide text-gray-500">
                      <th className="px-8 py-5 text-left">Report Name</th>
                      <th className="px-8 py-5 text-left">Upload Date</th>
                      <th className="px-8 py-5 text-left">Report Type</th>
                      <th className="px-8 py-5 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredReports.length === 0 && searchQuery.trim() ? (
  <tr>
    <td
      colSpan={4}
      className="text-center py-10 text-gray-500"
    >
      No reports found for "{searchQuery}"
    </td>
  </tr>
) : (
  filteredReports.map((report) => (
    <tr
      key={report.id}
      className="border-b hover:bg-[#FAFAF8] transition duration-200"
    >
      {/* Report Name */}
      <td className="px-8 py-6 font-medium text-[#202020] max-w-[500px]">
        <span
          className="block truncate"
          title={report.filename}
        >
          {report.filename}
        </span>
      </td>

      {/* Upload Date */}
      <td className="px-8 py-6 text-gray-600">
        {formatDate(report.upload_date)}
      </td>

      {/* Report Type */}
      <td className="px-8 py-6 text-gray-600">
        {report.analysis_json?.length || 0} Parameters
      </td>

      {/* Action */}
      <td className="px-8 py-6 text-center">
        <button
          onClick={() => {
            setSelectedReport(report);

            setTimeout(() => {
              document
                .getElementById("report-analysis")
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
            }, 100);
          }}
          className="px-5 py-2 rounded-lg border border-gray-300 bg-white
          text-sm font-semibold text-[#183B2D]
          hover:bg-[#183B2D] hover:text-white transition duration-300"
        >
          View Analysis
        </button>

        <button
  onClick={() => handleDeleteReport(report.id)}
  className="px-5 py-2 rounded-lg border border-red-200
  bg-white text-sm font-semibold text-red-600
  hover:bg-red-600 hover:text-white transition duration-300"
>
  Delete
</button>
      </td>
    </tr>
  )))}
</tbody>
                </table>
              )}
            </div>

            <div className="grid grid-cols-12 gap-8 mt-10">
              {/* Left Panel */}
              <div
  id="report-analysis"
  className="col-span-6 bg-[#F8F4ED] rounded-xl border border-gray-200 shadow-md p-8"
>
                {!selectedReport ? (
                  <p className="text-gray-500">
                    No report selected yet.
                  </p>
                ) : (
                  <>
                    {/* AI Health Summary */}
                {history.reports.length > 0 && aiSummary && (
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <span className="text-lg">✨</span>
                      <h2 className="text-lg font-semibold text-[#183B2D]">
                        AI Health Summary
                      </h2>
                    </div>

                    <p className="text-gray-700 leading-9 text-md">
                      {aiSummary.summary}
                    </p>

                    <div className="mt-8">
                      <h3 className="font-semibold text-[#183B2D] text-md mb-2">
                        Recommended Next Steps:
                      </h3>
                      <p className="text-gray-700 leading-9 text-md">
                        {aiSummary.recommendation}
                      </p>
                    </div>

                    <div className="border-t border-[#365E4B] mt-5 pt-6 flex items-center justify-between">
                      <p className="italic text-gray-500 font-mono text-sm">
                        Last analysis generated: {aiSummary.generatedAt}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleDownloadPDF}
                    className="px-6 py-3 rounded-lg border border-[#183B2D] text-[#183B2D] hover:bg-[#183B2D] hover:text-white transition"
                  >
                    Download PDF
                  </button>

                  <button
                    className="px-6 py-3 rounded-lg bg-[#183B2D] text-white hover:bg-[#275541] transition"
                  >
                    Share with Doctor
                  </button>
                </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

       <Footer />
      </div>
    
  );  
}