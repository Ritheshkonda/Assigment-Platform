import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProblemsPage.css"; // Assuming you have this file for styling the card list

function ProblemsPage({ problems }) {
  const navigate = useNavigate();

  // A message to show if there are no problems
  if (!problems || problems.length === 0) {
    return (
      <div className="problems-container-background">
        <div className="problems-card-wrapper">
          <h2 className="problems-list-header">Problems List</h2>
          <p className="no-problems-text">No problems are available at the moment.</p>
        </div>
      </div>
    );
  }

  const handleSolveClick = (problemId) => {
    // Navigate with a state to trigger exam mode
    navigate(`/solve/${problemId}`, { state: { examMode: true } });
  };

  return (
    <div className="problems-container-background">
      <div className="problems-card-wrapper">
        <h2 className="problems-list-header">Problems List</h2>
        <div className="problems-grid">
          {problems.map((problem) => (
            <div className="problem-item-card" key={problem.id}>
              <div className="problem-details">
                <h3 className="problem-title">{problem.title}</h3>
                <span
                  className={`difficulty-tag ${
                    problem.difficulty?.toLowerCase()
                  }`}
                >
                  {problem.difficulty}
                </span>
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
      </div>
    </div>
  );
}

export default ProblemsPage;
