import { useState } from "react";
import { Link } from "@inertiajs/react";

export default function Welcome() {
  const [output, setOutput] = useState({
    title: "No API Selected",
    data: [],
  });

  const [showApiInfo, setShowApiInfo] = useState(false);
  const [apiUrl, setApiUrl] = useState("");

  // Placeholder fetch logic (replace with DB fetch later)
  const handleFetch = (type) => {
    setShowApiInfo(false);
    setApiUrl("");

    let title = "";
    let fakeData = [];

    if (type === "pure") {
      title = "Pure Filipino Bad Words";
      fakeData = []; // Replace with DB fetch result later
    } else if (type === "regional") {
      title = "Regional Profanity Words";
      fakeData = [];
    } else if (type === "both") {
      title = "Pure Filipino + Regional Bad Words";
      fakeData = [];
    }

    setOutput({ title, data: fakeData });
  };

  const copyToClipboard = () => {
    if (!apiUrl) return;
    navigator.clipboard.writeText(apiUrl).then(() => {
      alert("Copied!");
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="w-full bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Free API</h1>
          <div className="space-x-6">
            <a href="#" className="font-semibold text-gray-700">
              Home
            </a>
            <a href="#" className="text-gray-600">
              About
            </a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold">
          <span className="text-green-600">Free</span> Filipino Profanity API
        </h1>
        <p className="text-gray-500">
          Click any option below to fetch JSON data:
        </p>
      </div>

      {/* Buttons Section */}
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-4">
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => handleFetch("pure")}
              className="w-full text-left p-3 border-l-4 border-blue-500 rounded hover:bg-gray-100 font-semibold"
            >
              /pure Filipino profanity{" "}
              <span className="text-gray-500">(Pota, Buwisit)</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleFetch("regional")}
              className="w-full text-left p-3 border-l-4 border-green-500 rounded hover:bg-gray-100 font-semibold"
            >
              /regional profanity{" "}
              <span className="text-gray-500">(Ukinnam, Yawa)</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleFetch("both")}
              className="w-full text-left p-3 border-l-4 border-yellow-500 rounded hover:bg-gray-100 font-semibold"
            >
              /pure Filipino and regional{" "}
              <span className="text-gray-500">(Both)</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Full Fetch Buttons (Inertia Links) */}
      <div className="max-w-6xl mx-auto mt-6 flex justify-end space-x-2 px-4">
        <Link
          href="/pages/code"
          className="bg-gray-900 text-white px-4 py-2 rounded"
        >
          Full Fetch Code
        </Link>
        <Link
          href="/pages/code"
          className="bg-gray-900 text-white px-4 py-2 rounded"
        >
          Full Fetch Code
        </Link>
        <Link
          href="/pages/code"
          className="bg-gray-900 text-white px-4 py-2 rounded"
        >
          Full Fetch Code
        </Link>
      </div>

      {/* API Info Placeholder */}
      {showApiInfo && (
        <div className="max-w-4xl mx-auto mt-4 px-4 py-3 bg-white border rounded flex justify-between items-center shadow">
          <span className="truncate">{apiUrl}</span>
          <button
            onClick={copyToClipboard}
            className="border px-3 py-1 rounded text-sm"
          >
            Copy
          </button>
        </div>
      )}

      {/* Output */}
      <div className="max-w-4xl mx-auto mt-4 px-4">
        <div className="bg-gray-900 text-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">{output.title}</h3>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(output.data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
