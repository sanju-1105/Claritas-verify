

import { useState } from "react";

export default function VerificationRequest() {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    aliasName: "",
    verificationType: "",
    institutionName: "",
    degreeName: "",
    finalExamDate: "",
    graduationDate: "",
    degreeDate: "",
    documentLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
  "https://script.google.com/macros/s/AKfycbw2QeF4BUmMIhTf9o1AgM1CEN7PESu01GeNqz4yzTHpcViPiZsXZq69_LvSA4kqpHH2mA/exec",
  {
    method: "POST",
    body: JSON.stringify(formData),
  }
);

const result = await response.json();

      if (result.success) {
        setRequestId(result.requestId);

        setFormData({
          fullName: "",
          dob: "",
          aliasName: "",
          verificationType: "",
          institutionName: "",
          degreeName: "",
          finalExamDate: "",
          graduationDate: "",
          degreeDate: "",
          documentLink: "",
        });
      } else {
        alert("Submission failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy-900 py-20 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-2">
          Verification Request
        </h1>

        <p className="text-gray-500 mb-8">
          Submit a new background verification request.
        </p>

        {requestId && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
            <p className="font-semibold text-green-800">
              Request Submitted Successfully
            </p>
            <p className="text-green-700">
              Request ID: {requestId}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="aliasName"
            placeholder="Alias Name"
            value={formData.aliasName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <select
            name="verificationType"
            value={formData.verificationType}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          >
            <option value="">Select Verification Type</option>
            <option>Education Verification</option>
            <option>Employment Verification</option>
            <option>Address Verification</option>
            <option>Reference Check</option>
          </select>

          <input
            type="text"
            name="institutionName"
            placeholder="University / Company Name"
            value={formData.institutionName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            name="degreeName"
            placeholder="Degree Name"
            value={formData.degreeName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="date"
            name="finalExamDate"
            value={formData.finalExamDate}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="date"
            name="graduationDate"
            value={formData.graduationDate}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="date"
            name="degreeDate"
            value={formData.degreeDate}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="url"
            name="documentLink"
            placeholder="Google Drive Document Link"
            value={formData.documentLink}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700"
          >
            {loading ? "Submitting..." : "Submit Verification Request"}
          </button>
        </form>
      </div>
    </div>
  );
}