"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [contentTofind, setcontentTofind] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: contentTofind,
          status: status,
          start_date: startDate,
          end_date: endDate,
        }),
      });

      const data = await response.json();
      setResults(data); // keep your original logic
    } catch (err: any) {
      console.error(
        "something is wrong done by user while searching",
        err.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
        
        <input
          type="text"
          placeholder="Search content..."
          value={contentTofind}
          onChange={(e) => setcontentTofind(e.target.value)}
          className="w-full border border-gray-300 text-black placeholder-gray-400 rounded-md px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-black focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Select Status</option>
          <option value="todo">Todo</option>
          <option value="completed">Completed</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-black focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-black focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* RESULTS */}
      <div className="max-w-xl mx-auto mt-6 space-y-3">
        <h2 className="text-xl font-semibold text-gray-800">Results:</h2>

        {results.length === 0 ? (
          <p className="text-gray-600 text-sm">No tasks found.</p>
        ) : (
          results.map((task: any) => (
            <div
              key={task.id}
              className="p-4 bg-white rounded-lg shadow flex justify-between"
            >
              <div>
                <p className="font-medium text-black">{task.content}</p>
                <p className="text-sm text-gray-500">
                  Status: {task.status}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
