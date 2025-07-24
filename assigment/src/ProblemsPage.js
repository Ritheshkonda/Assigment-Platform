import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./api/axios"; // Ensure axios instance is configured
import "./ProblemsPage.css";

function ProblemsPage() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/assignments/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProblems(res.data); // assuming backend returns array
      } catch (err) {
        console.error("❌ Failed to load assignments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleSolveClick = (problemId) => {
    navigate(`/solve/${problemId}`, { state: { examMode: true } });
  };

  if (loading) return <p>Loading problems...</p>;

  return (
    <div className="problems-container-background">
      <div className="problems-card-wrapper">
        <h2 className="problems-list-header">Problems List</h2>
        {problems.length === 0 ? (
          <p className="no-problems-text">No problems available at the moment.</p>
        ) : (
          <div className="problems-grid">
            {problems.map((problem) => (
              <div className="problem-item-card" key={problem._id}>
                <div className="problem-details">
                  <h3 className="problem-title">{problem.title}</h3>
                  <p className="problem-desc">{problem.description}</p>
                  {problem.difficulty && (
                    <span className={`difficulty-tag ${problem.difficulty.toLowerCase()}`}>
                      {problem.difficulty}
                    </span>
                  )}
                </div>
                <button
                  className="solve-action-button"
                  onClick={() => handleSolveClick(problem._id)}
                >
                  Solve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemsPage;
