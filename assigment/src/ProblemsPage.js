import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./api/axios";
import "./ProblemsPage.css";

function ProblemsPage() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [studentBatch, setStudentBatch] = useState("Batch 1"); // Simulated; fetch from API or localStorage
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState(null);

  // Sample deadlines for 15 weeks (adjust to your needs; ideally fetch from API)
  const weekDeadlines = {
    1: new Date("2025-08-07T23:59:59"), // Week 1 ends Aug 7, 2025
    2: new Date("2025-08-14T23:59:59"),
    3: new Date("2025-08-21T23:59:59"),
    4: new Date("2025-08-28T23:59:59"),
    5: new Date("2025-09-04T23:59:59"),
    6: new Date("2025-09-11T23:59:59"),
    7: new Date("2025-09-18T23:59:59"),
    8: new Date("2025-09-25T23:59:59"),
    9: new Date("2025-10-02T23:59:59"),
    10: new Date("2025-10-09T23:59:59"),
    11: new Date("2025-10-16T23:59:59"),
    12: new Date("2025-10-23T23:59:59"),
    13: new Date("2025-10-30T23:59:59"),
    14: new Date("2025-11-06T23:59:59"),
    15: new Date("2025-11-13T23:59:59"),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch assignments (assume they include 'week' and 'batch' fields)
        const [assignmentsRes, submissionsRes] = await Promise.all([
          axios.get("/assignments/all", { headers }),
          axios.get("/submissions/my", { headers }),
        ]);

        setProblems(assignmentsRes.data);
        setSubmissions(submissionsRes.data);

        // Fetch student batch (simulated; replace with real API call)
        // const userRes = await axios.get("/user/profile", { headers });
        // setStudentBatch(userRes.data.batch);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Group problems by week and filter by student's batch
  const getProblemsByWeek = (week) => {
    return problems.filter(
      (p) => p.week === week && p.batch === studentBatch
    );
  };

  const isBeforeDeadline = (week) => {
    const deadline = weekDeadlines[week];
    return deadline && new Date() < deadline;
  };

  const toggleWeek = (week) => {
    setExpandedWeek(expandedWeek === week ? null : week);
  };

  const handleSolveClick = (problemId) => {
    navigate(`/solve/${problemId}`, { state: { examMode: true } });
  };

  const isSolved = (problemTitle) =>
    submissions.some((sub) => sub.assignmentTitle === problemTitle);

  if (loading) return <div>Loading labs...</div>;

  return (
    <div className="problems-container-background">
      <div className="problems-card-wrapper">
        
        {Array.from({ length: 15 }, (_, i) => {
          const week = i + 1;
          const weekProblems = getProblemsByWeek(week);
          const beforeDeadline = isBeforeDeadline(week);
          const deadlineDate = weekDeadlines[week]?.toLocaleDateString();

          return (
            <div
              key={week}
              className={`week-accordion ${!beforeDeadline ? "week-disabled" : ""}`}
            >
              <div className="week-header" onClick={() => beforeDeadline && toggleWeek(week)}>
                <span className="week-title">Week {week}</span>
                <span className="week-deadline">
                  {beforeDeadline
                    ? `Deadline: ${deadlineDate}`
                    : `Past Deadline: ${deadlineDate}`}
                </span>
              </div>
              {expandedWeek === week && beforeDeadline && (
                <div className="week-content">
                  {weekProblems.length === 0 ? (
                    <p className="no-problems-text">No exercises available for this week in your batch.</p>
                  ) : (
                    <div className="problems-grid">
                      {weekProblems.map((problem) => (
                        <div key={problem.id} className="problem-item-card">
                          <div className="problem-details">
                            <h3 className="problem-title">
                              {problem.title}
                              {isSolved(problem.title) && <span className="solved-tag">Solved</span>}
                            </h3>
                            <p>{problem.description}</p>
                            {problem.difficulty && (
                              <span className={`difficulty-tag ${problem.difficulty.toLowerCase()}`}>
                                {problem.difficulty}
                              </span>
                            )}
                          </div>
                          <button
                            className="solve-action-button"
                            onClick={() => handleSolveClick(problem.id)}
                          >
                            Solve
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProblemsPage;
