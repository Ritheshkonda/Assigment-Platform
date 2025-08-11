import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./api/axios";
import "./ProblemsPage.css";

function ProblemsPage() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentBatch, setStudentBatch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // ✅ Get logged-in student's batch
        const profileRes = await axios.get("/user/profile", { headers });
        setStudentBatch(profileRes.data.batch);

        // ✅ Fetch week-wise assigned questions
        const [assignedRes, submissionsRes] = await Promise.all([
          axios.get("/student/assigned-questions", { headers }),
          axios.get("/submissions/my", { headers }),
        ]);

        const groupedAssignments = assignedRes.data.data;
        const allProblems = [];

        for (const week in groupedAssignments) {
          groupedAssignments[week].forEach((entry) => {
            allProblems.push({
              ...entry.question,
              assignmentId: entry._id,
              weekNumber: entry.weekNumber, // ✅ use from assignment
              deadline: entry.deadline,
              batch: studentBatch,
            });
          });
        }

        setProblems(allProblems);
        setSubmissions(submissionsRes.data);
      } catch (err) {
        console.error("❌ Error fetching problems:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleWeek = (week) => {
    setExpandedWeek(expandedWeek === week ? null : week);
  };

  const handleSolveClick = (problemId) => {
    navigate(`/solve/${problemId}`, { state: { examMode: true } });
  };

  const isSolved = (problemTitle) =>
    submissions.some((sub) => sub.assignmentTitle === problemTitle);

  const getProblemsByWeek = (week) =>
    problems.filter((p) => p.weekNumber === parseInt(week));

  if (loading) return <div>Loading problems...</div>;

  return (
    <div className="problems-container-background">
      <div className="problems-card-wrapper">
        {Object.keys(
          problems.reduce((acc, curr) => {
            acc[curr.weekNumber] = true;
            return acc;
          }, {})
        )
          .sort((a, b) => a - b)
          .map((week) => {
            const weekProblems = getProblemsByWeek(week);
            const deadline = weekProblems[0]?.deadline
              ? new Date(weekProblems[0].deadline).toLocaleDateString()
              : null;
            const beforeDeadline =
              weekProblems[0]?.deadline &&
              new Date() < new Date(weekProblems[0].deadline);

            return (
              <div
                key={week}
                className={`week-accordion ${
                  !beforeDeadline ? "week-disabled" : ""
                }`}
              >
                <div
                  className="week-header"
                  onClick={() => beforeDeadline && toggleWeek(week)}
                >
                  <span className="week-title">Week {week}</span>
                  <span className="week-deadline">
                    {beforeDeadline
                      ? `Deadline: ${deadline}`
                      : `Past Deadline: ${deadline}`}
                  </span>
                </div>
                {expandedWeek === week && beforeDeadline && (
                  <div className="week-content">
                    {weekProblems.length === 0 ? (
                      <p className="no-problems-text">
                        No problems available for this week.
                      </p>
                    ) : (
                      <div className="problems-grid">
                        {weekProblems.map((problem) => (
                          <div
                            key={problem._id}
                            className="problem-item-card"
                          >
                            <div className="problem-details">
                              <h3 className="problem-title">
                                {problem.title}
                                {isSolved(problem.title) && (
                                  <span className="solved-tag">Solved</span>
                                )}
                              </h3>
                              <p>{problem.description}</p>
                              {problem.difficulty && (
                                <span
                                  className={`difficulty-tag ${problem.difficulty.toLowerCase()}`}
                                >
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
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default ProblemsPage;
