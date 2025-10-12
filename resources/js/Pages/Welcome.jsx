import { useState, useEffect } from "react";
import { Link, Head, usePage, router } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import {route} from "ziggy-js";

export default function Welcome() {
  const { api } = usePage().props;

  const [output, setOutput] = useState({
    title: "No API Selected",
    data: [],
  });

  const [showApiInfo, setShowApiInfo] = useState(false);
  const [apiUrl, setApiUrl] = useState("");
  const [highlightedJson, setHighlightedJson] = useState("");
  const [status, setStatus] = useState(0);

  //  JSON highlighter
  function highlightJSON(jsonString) {
    let data;
    try {
      data = JSON.parse(jsonString);
    } catch {
      return escapeHtml(jsonString);
    }

    const INDENT = "  ";

    function escapeHtml(s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    const span = (color, text, bold = false) =>
      `<span style="color:${color};${bold ? "font-weight:bold;" : ""}">${text}</span>`;

    const P = {
      lbrace: span("blue", "{", true),
      rbrace: span("blue", "}", true),
      lbracket: span("darkgreen", "[", true),
      rbracket: span("darkgreen", "]", true),
      colon: span("brown", ":", true),
      comma: span("white", ","),
    };

    function render(val, level) {
      if (val === null) return span("gray", "null");

      if (Array.isArray(val)) {
        if (val.length === 0) return P.lbracket + P.rbracket;
        let out = P.lbracket + "\n";
        for (let i = 0; i < val.length; i++) {
          out += INDENT.repeat(level + 1) + render(val[i], level + 1);
          if (i < val.length - 1) out += P.comma;
          out += "\n";
        }
        out += INDENT.repeat(level) + P.rbracket;
        return out;
      }

      switch (typeof val) {
        case "object": {
          const keys = Object.keys(val);
          if (keys.length === 0) return P.lbrace + P.rbrace;
          let out = P.lbrace + "\n";
          keys.forEach((k, idx) => {
            const keyStr = span("brown", `"${escapeHtml(k)}"`);
            out +=
              INDENT.repeat(level + 1) +
              keyStr +
              " " +
              P.colon +
              " " +
              render(val[k], level + 1);
            if (idx < keys.length - 1) out += P.comma;
            out += "\n";
          });
          out += INDENT.repeat(level) + P.rbrace;
          return out;
        }
        case "string":
          return span("darkorange", `"${escapeHtml(val)}"`);
        case "number":
          return span("darkorange", String(val));
        case "boolean":
          return span("blueviolet", String(val));
        default:
          return escapeHtml(String(val));
      }
    }

    return render(data, 0);
  }

  const handleFetch = async (type) => {
  setShowApiInfo(false);
  setApiUrl("");

  if (type === "pure") {
    const title = "Pure Filipino Bad Words";
    const url = '/api/profanity/filipino'; 

    try {
      console.log("Fetching:", url);
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");

      const newApi = await response.json();
      setStatus(response.status);
      setOutput({ title, data: newApi });
      setApiUrl(url);
      setShowApiInfo(true);

    } catch (error) {
      console.error(" Fetch failed:", error);
    }
  } else if (type === "regional") {
    const title = 'Regional Profanity Words';
    try {
       const url = '/api/profanity/regional'; 
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");

      const newApi = await response.json();

      setOutput({ title, data: newApi });
      setApiUrl(url);
      setShowApiInfo(true);

    } catch (error) {
      console.error(" Fetch failed:", error);
    }
  } else if (type === "both") {
    const title = 'Pure Filipino + Regional Bad Words';
    try {
       const url = '/api/profanity/combined'; 
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");

      const newApi = await response.json();

      setOutput({ title, data: newApi });
      setApiUrl(url);
      setShowApiInfo(true);

    } catch (error) {
      console.error(" Fetch failed:", error);
    }
  }
};

  const copyToClipboard = () => {
    if (!apiUrl) return;
    navigator.clipboard.writeText(apiUrl).then(() => alert("Copied!"));
  };

  useEffect(() => {
    const jsonStr = JSON.stringify(output.data || [], null, 2);
    setHighlightedJson(highlightJSON(jsonStr));
  }, [output]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Head title="Profanity API" />
      <GuestLayout>
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

        {/* API Info */}
        {showApiInfo && (
          <div className="max-w-4xl mx-auto mt-4 px-4 py-3 bg-white border rounded flex justify-between items-center shadow">
            <span className="text-back font-bold border-r border-gray-700 pe-2">GET</span>
            <span className="truncate">{`http://${window.location.hostname}${apiUrl}`}</span>
            <button
              onClick={copyToClipboard}
              className="border px-3 py-1 rounded text-sm"
            >
              Copy
            </button>
          </div>
        )}

        
        {/* Output */}
        <div className="mx-auto mt-4 px-4 w-[85%] overflow-scroll"
        style={{ maxHeight: "70vh" }}
        >
          <div className="bg-gray-900 text-gray-100 p-4 rounded shadow">
           <div className="flex justify-between">
             <h3 className="text-lg font-bold mb-2">{output.title}</h3>
             {status ? 
              <div>
                  <h5>Status: <span>{ status || 'N/A'}</span></h5>
              </div>
              :
              <></>
              }
           </div>
            <pre
              className="whitespace-pre-wrap"
              style={{
                background: "#1e1e1e",
                color: "#d4d4d4",
                padding: "10px",
                borderRadius: "6px",
                overflowX: "auto",
              }}
              dangerouslySetInnerHTML={{ __html: highlightedJson }}
            ></pre>
          </div>
        </div>
      </GuestLayout>
    </div>
  );
}
