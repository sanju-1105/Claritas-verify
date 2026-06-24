import { useState } from "react";

export default function TrackVerification() {
  const [requestId, setRequestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTrack = async () => {
    if (!requestId) {
      alert("Please enter Request ID");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `YOUR_APPS_SCRIPT_URL?requestId=${requestId}`
      );

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Unable to fetch status");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy-900 py-20 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold mb-2">
          Track Verification
        </h1>

        <p className="text-gray-500 mb-8">
          Enter your Request ID to check verification status.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="CV-2026-0001"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <button
            onClick={handleTrack}
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700"
          >
            {loading ? "Checking..." : "Track Status"}
          </button>
        </div>

        {result && (
          <div className="mt-8 border rounded-xl p-5 bg-gray-50">
            <h3 className="font-bold text-lg mb-4">
              Verification Status
            </h3>

            <div className="space-y-2">
              <p>
                <strong>Request ID:</strong> {result.requestId}
              </p>

              <p>
                <strong>Candidate Name:</strong> {result.fullName}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="font-semibold text-teal-600">
                  {result.status}
                </span>
              </p>

              <p>
                <strong>Verification Type:</strong>{" "}
                {result.verificationType}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}