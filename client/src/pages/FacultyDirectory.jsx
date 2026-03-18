// =============================================
// FacultyDirectory.jsx — Updated with skeletons
// =============================================

import { useState, useEffect } from "react";
import { getAllFaculty } from "../utils/api";
import FacultyCard from "../components/FacultyCard";
import { DirectorySkeleton } from "../components/LoadingSkeleton";
import { useToast } from "../components/Toast";

const FacultyDirectory = () => {
  const [faculty, setFaculty]       = useState([]);
  const [search, setSearch]         = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterAvail, setFilterAvail] = useState("All");
  const [loading, setLoading]       = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await getAllFaculty();
        setFaculty(res.data);
      } catch (err) {
        toast.error("Failed to load", "Could not fetch faculty list.");
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  // Filter faculty
  const filtered = faculty.filter((f) => {
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.expertise?.some((e) => e.toLowerCase().includes(search.toLowerCase())) ||
      f.designation?.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === "All" || f.department === filterDept;
    const matchAvail =
      filterAvail === "All" ||
      (filterAvail === "Available" && f.isAvailable) ||
      (filterAvail === "Unavailable" && !f.isAvailable);
    return matchSearch && matchDept && matchAvail;
  });

  if (loading) return <DirectorySkeleton />;

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Faculty Directory</h1>
        <p className="text-gray-500 text-sm mt-1">
          {faculty.length} faculty members · Find the right professor for your needs
        </p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search bar */}
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by name, expertise or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition"
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              ✕
            </button>
          )}
        </div>

        {/* Department filter */}
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}
          className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm outline-none transition"
        >
          {["All","CSE","ECE","ME","CE","IT","MBA"].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        {/* Availability filter */}
        <select value={filterAvail} onChange={(e) => setFilterAvail(e.target.value)}
          className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm outline-none transition"
        >
          {["All","Available","Unavailable"].map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Active filters display */}
      {(search || filterDept !== "All" || filterAvail !== "All") && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm text-gray-500">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => { setSearch(""); setFilterDept("All"); setFilterAvail("All"); }}
            className="text-xs text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded-lg"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Faculty grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((f) => (
            <FacultyCard key={f._id} faculty={f} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-600 font-semibold text-lg">No faculty found</p>
          <p className="text-gray-400 text-sm mt-1">Try different search terms or filters</p>
          <button
            onClick={() => { setSearch(""); setFilterDept("All"); setFilterAvail("All"); }}
            className="mt-4 text-blue-600 hover:underline text-sm"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FacultyDirectory;
