// =============================================
// FacultyDirectory.jsx — Browse all faculty
// =============================================

import { useState, useEffect } from "react";
import { getAllFaculty } from "../utils/api";
import FacultyCard from "../components/FacultyCard";

const FacultyDirectory = () => {
  const [faculty, setFaculty]       = useState([]);
  const [search, setSearch]         = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  // Fetch all faculty when page loads
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await getAllFaculty();
        setFaculty(res.data);
      } catch (err) {
        setError("Could not load faculty. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  // Filter faculty based on search input and department dropdown
  const filtered = faculty.filter((f) => {
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.expertise?.some((e) => e.toLowerCase().includes(search.toLowerCase())) ||
      f.designation?.toLowerCase().includes(search.toLowerCase());

    const matchDept = filterDept === "All" || f.department === filterDept;

    return matchSearch && matchDept;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">👨‍🏫</div>
          <p className="text-gray-500">Loading faculty...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-blue-600 hover:underline text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Faculty Directory</h1>
        <p className="text-gray-500 text-sm mt-1">
          {faculty.length} faculty members · Find the right professor for your needs
        </p>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by name, expertise or designation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        />
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        >
          {["All", "CSE", "ECE", "ME", "CE", "IT", "MBA"].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      {search || filterDept !== "All" ? (
        <p className="text-sm text-gray-500 mb-4">
          Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </p>
      ) : null}

      {/* Faculty cards grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((f) => (
            <FacultyCard key={f._id} faculty={f} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-gray-500 font-medium">No faculty found</p>
          <p className="text-gray-400 text-sm mt-1">
            Try a different name or department
          </p>
          <button
            onClick={() => { setSearch(""); setFilterDept("All"); }}
            className="mt-3 text-blue-600 hover:underline text-sm"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FacultyDirectory;