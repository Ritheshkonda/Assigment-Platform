import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./api/axios";
import "./ProblemsPage.css";

function ProblemsPage() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignmentsAndSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [assignmentsRes, submissionsRes] = await Promise.all([
          axios.get("/assignments/all", { headers }),
          axios.get("/submissions/my", { headers }),
        ]);

        setProblems(assignmentsRes.data);
        setSubmissions(submissionsRes.data);
      } catch (err) {
        console.error("❌ Error fetching problems/submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentsAndSubmissions();
  }, []);

  const handleSolveClick = (problemId) => {
    navigate(`/solve/${problemId}`, { state: { examMode: true } });
  };

  const isSolved = (problemTitle) =>
    submissions.some((sub) => sub.assignmentTitle === problemTitle);

  if (loading) return <p>Loading problems...</p>;

  return (
    <div className="problems-container-background">
      <div className="problems-card-wrapper">
        <h2 className="problems-list-header">Problems List</h2>
        {problems.length === 0 ? (
          <p className="no-problems-text">No problems available at the moment.</p>
        ) : (
          <div className="problems-grid">
            {problems.map((problem) => {
              const solved = isSolved(problem.title);
              return (
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
                    className={`solve-action-button ${solved ? "solved" : ""}`}
                    onClick={() => handleSolveClick(problem._id)}
                    disabled={false}
                  >
                    {solved ? "Solved" : "Solve"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemsPage;
