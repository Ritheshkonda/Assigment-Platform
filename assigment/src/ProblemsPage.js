import React from "react";
import { useNavigate } from "react-router-dom";

function ProblemsPage({ problems }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-card">
      <h2 style={{ marginBottom: 18 }}>Problems List</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
        <thead>
          <tr style={{ background: "#efeaea", textAlign: "left" }}>
            <th style={{ padding: 10 }}>Title</th>
            <th style={{ padding: 10 }}>Difficulty</th>
            <th style={{ padding: 10 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem.id} style={{ borderBottom: "1px solid #f4f4f4" }}>
              <td style={{ padding: 10 }}>{problem.title}</td>
              <td style={{ padding: 10 }}>
                <span
                  style={{
                    padding: "6px 18px",
                    borderRadius: 20,
                    background:
                      problem.difficulty === "Easy"
                        ? "#6ee7b7"
                        : problem.difficulty === "Medium"
                        ? "#fde68a"
                        : "#fca5a5",
                    color:
                      problem.difficulty === "Easy"
                        ? "#065f46"
                        : problem.difficulty === "Medium"
                        ? "#92400e"
                        : "#b91c1c",
                    fontWeight: 600
                  }}
                >
                  {problem.difficulty}
                </span>
              </td>
              <td style={{ padding: 10 }}>
                <button
                  style={{
                    background: "#725cad",
                    color: "#fff",
                    border: "none",
                    borderRadius: 16,
                    fontWeight: 600,
                    padding: "8px 26px",
                    cursor: "pointer",
                    fontSize: 15
                  }}
                  onClick={() => navigate(`/solve/${problem.id}`)}
                >
                  Solve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {problems.length === 0 && (
        <div style={{ marginTop: 22 }}>No problems available.</div>
      )}
    </div>
  );
}

export default ProblemsPage;
