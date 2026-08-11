import { useLocation,Navigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Footer from "../components/Footer";




export default function ReportSummary() {

const [file, setFile] = useState(null);
const [loading, setLoading] = useState(false);
const [previousReports, setPreviousReports] = useState([]);

const navigate = useNavigate();

useEffect(() => {
  const fetchReports = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Reports status:", response.status);
      console.log("Reports data:", data);

      if (!response.ok) {
        console.error(data);
        return;
      }

      setPreviousReports(data);
    } catch (error) {
      console.error("Error fetching previous reports:", error);
    }
  };

  fetchReports();
}, []);

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "good":
      return {
        card: "bg-[#EEF9EF] border-[#CFE9D3]",
        badge: "bg-[#D8F5DD] text-[#18864B] border-[#B7E5BF]",
      };

    case "normal":
      return {
        card: "bg-[#F4FAEF] border-[#F5E9B8] shadow-sm",
        badge: "bg-[#DBF5DB] text-[#008241] border-[#008241]",
      };

    case "high":
  return {
    card: "bg-[#FFF3D9] shadow-md",
    badge: "bg-[#FFD89B] text-[#A45A00] border-[#F0B860]",
  };

case "low":
  return {
    card: "bg-[#FCE7E7] shadow-md",
    badge: "bg-[#F7B9B9] text-[#B41414] border-[#E89A9A]",
  };

    default:
      return {
        card: "bg-white border-gray-200",
        badge: "bg-gray-100 text-gray-700 border-gray-300",
      };
  }
};


  const { state } = useLocation();

  if (!state?.result) {
    return <Navigate to="/upload-reports" replace />;
  }

const result = state.result;

if (!result) {
  return (
    <div className="p-6 sm:p-10">
      No report found.
    </div>
  );
}

// Make sure tests is always an array
const tests = Array.isArray(result.tests)
  ? result.tests
  : Array.isArray(result.analysis_json)
  ? result.analysis_json
  : [];

const parameters = tests.map((test) => test.name);

const [selectedParameter, setSelectedParameter] = useState("");

useEffect(() => {
  setSelectedParameter(parameters[0] || "");
}, [result.id]);

const [selectedDuration, setSelectedDuration] =
  useState("All Time");
const attentionTests = tests.filter(
  (test) => test.status === "High" || test.status === "Low"
);
const selectedTest = tests.find(
  (test) => test.name === selectedParameter
);

const graphData = previousReports
  .slice()
  .sort(
    (a, b) =>
      new Date(a.upload_date) -
      new Date(b.upload_date)
  )
  .filter((report) => {
    if (selectedDuration === "All Time") {
      return true;
    }

    const reportDate = new Date(report.upload_date);
    const now = new Date();

    let cutoff = new Date();

    if (selectedDuration === "Last 6 Months") {
      cutoff.setMonth(now.getMonth() - 6);
    }

    if (selectedDuration === "Last 3 Months") {
      cutoff.setMonth(now.getMonth() - 3);
    }

    if (selectedDuration === "Last 30 Days") {
      cutoff.setDate(now.getDate() - 30);
    }

    return reportDate >= cutoff;
  })
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

    const value = parseFloat(
      String(test.value).replace(/[^0-9.-]/g, "")
    );

    if (Number.isNaN(value)) return null;

    return {
      label: new Date(report.upload_date).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ),
      value,
      reportName: report.filename,
    };
  })
  .filter(Boolean);
const attentionInsight =
  result.attention_insight ||
  "Some parameters fall outside the healthy range. Please consult your healthcare provider for personalized advice and appropriate follow-up.";

const healthScore = result.health_score ?? 0;

let scoreColor = "text-red-600";
let progressText = "Needs Attention";

if (healthScore >= 80) {
  scoreColor = "text-[#2E473D]";
  progressText = "Excellent";
} else if (healthScore >= 60) {
  scoreColor = "text-yellow-600";
  progressText = "Good Progress";
} else if (healthScore >= 40) {
  scoreColor = "text-orange-500";
  progressText = "Needs Attention";
} else {
  scoreColor = "text-red-600";
  progressText = "Critical";
}

const healthyTests = tests.filter(
  (test) => test.status === "Normal"
);

const healthyInsight =
  result.healthy_insight ||
  "All highlighted parameters are within the healthy range. Continue maintaining a balanced diet, regular exercise, and routine health checkups.";


  
  // chartData...

  

  return (

     <div className="min-h-screen bg-[#ffffff]">
          <Navbar />

          <div className="py-6 sm:py-10">

  {/* Top Section */}
  
<div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

  {/* Top Section */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

    {/* Wellness Score */}
    <div className="lg:col-span-4">

     <div className="bg-[#F5F1E8] border border-[#E6E0D4] rounded-xl h-auto lg:h-[280px] px-6 sm:px-8 py-8 sm:py-6 flex flex-col items-center justify-center">   <h3 className="text-[#41584A] text-base sm:text-lg lg:text-xl tracking-wide uppercase text-center">
          Wellness Score
        </h3>

        <h1 className={`text-[60px] sm:text-[72px] lg:text-[90px] font-bold leading-none mt-6 ${scoreColor}`}>
  {healthScore}
</h1>

        <div className="mt-8 bg-white border border-gray-300 px-6 py-2 shadow-sm">
          <p className={`font-mono uppercase text-sm sm:text-md tracking-wide ${scoreColor}`}>
  {progressText}
</p>
        </div>

      </div>

    </div>

    {/* Health Story */}

<div className="lg:col-span-8">
  <div className="bg-white border border-[#D9D9D9] rounded-xl h-auto lg:h-[280px] px-5 sm:px-8 lg:px-10 py-6 sm:py-8 flex flex-col">

    {/* Top Content */}
    <div>
      <h2 className="text-lg sm:text-xl lg:text-[25px] font-semibold text-[#183B2D] mb-4">
        Your Health Story
      </h2>

      <p className="text-sm sm:text-md leading-7 sm:leading-9 lg:leading-10 text-[#4B4B4B]">
        {result.story ||
          "Based on your latest medical report, your overall health profile appears stable. Most parameters are within their healthy range while a few require attention. Maintaining a balanced diet, regular exercise and periodic health checkups will help improve your long-term wellness."}
      </p>
    </div>

    {/* Date Badge */}
    <div className="mt-6 lg:mt-auto">
      <div className="inline-flex flex-wrap items-center bg-[#F5F1E8] px-4 py-2 rounded gap-1 sm:gap-0">
        <span className="font-mono text-xs font-semibold tracking-[2px] text-[#2E473D]">
          LAST UPDATED :
        </span>

        <span className="sm:ml-4 font-mono text-xs sm:text-sm tracking-[2px]">
          {new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).toUpperCase()}
        </span>
      </div>
    </div>

  </div>
</div>

  </div>

  {/* Divider */}
  <div className="border-t border-gray-300 my-8 sm:my-10"></div>

{/* Healthy Results */}

<div className="mt-8 sm:mt-12">

  <h2 className="text-xl sm:text-2xl font-bold text-[#1E7B4E] mb-6 sm:mb-8">
    Healthy Results ({healthyTests.length})
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">

    {healthyTests.map((test, index) => {

      const style = getStatusStyle(test.status);

      return (

        <div
          key={index}
          className={`rounded-sm p-5 h-auto min-h-[210px] flex flex-col justify-between gap-3 ${style.card}`}
        >

          {/* Header */}

          <div className="flex justify-between items-start gap-2">

            <h3 className="text-base sm:text-lg font-semibold leading-tight max-w-[70%]">
              {test.name}
            </h3>

            <span
              className={`px-3 py-1 rounded-md text-xs sm:text-sm border whitespace-nowrap ${style.badge}`}
            >
              {test.status}
            </span>

          </div>

          {/* Value */}

          <div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
              {test.value}

              <span className="text-sm sm:text-base font-normal ml-1">
                {test.unit}
              </span>

            </h1>

          </div>

          {/* Range */}

          <p className="text-sm text-gray-600">
            Healthy Range
          </p>

          <p className="text-sm sm:text-base font-medium">
            {test.reference_range}
          </p>

        </div>

      );

    })}

  </div>

</div>

{/* Healthy AI Insights */}

<div className="mt-6 sm:mt-8 bg-[#EEF5FF] border border-[#C7DDFE] rounded-md shadow-sm p-5 sm:p-8">

  <h3 className="text-lg sm:text-xl font-semibold text-center text-[#1F2937] mb-4 sm:mb-5">
    AI Insights
  </h3>

  <p className="text-sm sm:text-md leading-7 sm:leading-9 text-[#374151]">
    {result.healthy_insight ||
      "Your report shows that most health parameters are within their recommended ranges, indicating good overall health. Maintaining a balanced diet, staying physically active, and continuing regular health checkups will help preserve these positive results. Keep following your current healthy habits to support long-term wellness."
    }
  </p>

</div>

{/* Needs Attention */}

<div className="mt-10 sm:mt-16">

  <h2 className="text-xl sm:text-2xl font-bold text-[#B41414] mb-6 sm:mb-8">
    Needs Attention ({attentionTests.length})
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">

    {attentionTests.map((test, index) => {

      const style = getStatusStyle(test.status);

      return (

        <div
          key={index}
          className={`rounded-sm p-5 h-auto min-h-[210px] flex flex-col justify-between gap-3 ${style.card}`}
        >

          <div className="flex justify-between items-start gap-2">

            <div>

              <h3 className="text-base sm:text-lg font-semibold leading-tight">
                {test.name}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Requires attention
              </p>

            </div>

            <span
              className={`px-3 py-1 rounded-md text-xs sm:text-sm border whitespace-nowrap ${style.badge}`}
            >
              {test.status}
            </span>

          </div>

          <div>

            <h1 className="text-2xl sm:text-3xl font-bold">
              {test.value}
              <span className="text-sm sm:text-base font-normal ml-1">
                {test.unit}
              </span>
            </h1>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Healthy Range
            </p>

            <p className="text-sm sm:text-base font-medium">
              {test.reference_range}
            </p>

          </div>

        </div>

      );

    })}

  </div>

</div>

<div className="mt-6 sm:mt-8 bg-[#FFF5F5] border border-[#F2D0D0] rounded-md shadow-sm p-5 sm:p-8">

  <h3 className="text-lg sm:text-xl font-semibold text-center mb-4 sm:mb-5">
    AI Insights
  </h3>
   

  <p className="text-sm sm:text-md text-gray-700 leading-7 sm:leading-9">
    {attentionInsight}
  </p>

</div>

 {/* Divider */}
  <div className="border-t border-gray-300 my-8 sm:my-10"></div>


  <div className="mt-10 sm:mt-16">

 <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
   Graphical Analysis
</h2>

<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">

  {/* Parameter */}

  <div className="flex flex-col">

    <label className="text-sm font-medium text-gray-600 mb-2">
      Parameter
    </label>

    <select
      value={selectedParameter}
      onChange={(e) => setSelectedParameter(e.target.value)}
      className="w-full sm:w-64 bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#183B2D]"
    >
      {parameters.map((parameter) => (
        <option key={parameter} value={parameter}>
          {parameter}
        </option>
      ))}
    </select>

  </div>

  {/* Period */}

  <div className="flex flex-col">

    <label className="text-sm font-medium text-gray-600 mb-2">
      Period
    </label>

   <select
  value={selectedDuration}
  onChange={(e) => setSelectedDuration(e.target.value)}
  className="w-full sm:w-56 bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#183B2D]"
>
  <option>All Time</option>
  <option>Last 6 Months</option>
  <option>Last 3 Months</option>
  <option>Last 30 Days</option>
</select>

  </div>

</div>

<div className="bg-[#F8F6EE] rounded-xl p-4 sm:p-8 shadow-sm">

  <div className="h-[280px] sm:h-[350px] lg:h-[420px]">

    {graphData.length <= 1 ? (

      <div className="h-full flex items-center justify-center text-gray-500 text-base sm:text-lg text-center px-4">
        Upload more reports to view health trends over time.
      </div>

    ) : (

      <ResponsiveContainer width="100%" height="100%">

        <LineChart data={graphData}>

          <CartesianGrid stroke="#ECECEC" />

          <XAxis dataKey="label" />

          <YAxis
            label={{
              value: selectedTest?.unit || "",
              angle: -90,
              position: "insideLeft",
            }}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#42C33C"
            strokeWidth={4}
          />

        </LineChart>

      </ResponsiveContainer>

    )}

  </div>

</div>

</div>

{/* Divider */}
<div className="border-t border-gray-300 mt-10 sm:mt-14 mb-8 sm:mb-10"></div>

{/* Upload Another Report */}

<div className="mb-10 sm:mb-12">

  <button
    onClick={() => navigate("/upload-reports")}
    className="w-full sm:w-auto bg-[#17392D] hover:bg-[#21483A] text-white px-4 py-2 rounded-sm shadow-md transition"
  >
    Upload another report
  </button>

</div>

{/* Previously Uploaded */}

<div className="mb-12 sm:mb-16">

  <h2 className="text-xl sm:text-2xl font-bold text-[#1C1C1C] mb-6 sm:mb-8">
    Previously Uploaded
  </h2>

  <div className="rounded-xl overflow-x-auto">



   

   {/* Rows */}

<div className="rounded-xl min-w-[500px]">

  {previousReports.length > 0 ? (
    previousReports.map((report) => (
      <div
        key={report.id}
        className="grid grid-cols-12 py-5 border-b border-gray-200 items-start"
      >

        {/* Report Name */}
        <div className="col-span-4 pr-4">
          <p className="font-medium text-[#183B2D] truncate">
            {report.filename}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {new Date(report.upload_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Summary */}
        <div className="col-span-6 pr-6">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Summary
          </p>

          {Array.isArray(report.summary) ? (
            <ul className="text-sm text-gray-600 space-y-1">
              {report.summary.map((item, index) => (
                <li key={index}>
                  • {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">
              {report.summary || "No summary available."}
            </p>
          )}
        </div>

        {/* Action */}
        <div className="col-span-2 text-right">
          <button
  onClick={() => {
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
    });
  }}
  className="text-[#5E72FF] hover:underline font-medium"
>
  View Analysis
</button>
        </div>

      </div>
    ))
  ) : (
    <div className="py-10 text-center text-gray-500">
      No previously uploaded reports.
    </div>
  )}

</div>

  </div>

</div>


  {/* Temporary JSON */}
  <div>


    <h2 className="text-2xl sm:text-3xl font-bold mb-6">
      Report Summary
    </h2>

    <pre className="bg-gray-50 border rounded-xl p-4 sm:p-6 overflow-x-auto text-xs sm:text-sm">
      {JSON.stringify(result, null, 2)}
    </pre>

  </div>

</div>
</div>

{/* Footer */}

<Footer />
        </div>
        
      );
    }