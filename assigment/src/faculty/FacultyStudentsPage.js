import React from "react";
import "./FacultyDashboard.css";

function FacultyStudentsPage({ batches, studentScores }) {
  return (
    <div className="faculty-section-card">
      <h2>Student Scores</h2>
      {batches.map(batch => (
        <div key={batch.id} className="batch-board">
          <h4>{batch.name}</h4>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Total Score</th>
                <th>Breakdown</th>
              </tr>
            </thead>
            <tbody>
              {batch.students.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{studentScores[s.id]?.total ?? 0}</td>
                  <td style={{ fontSize: "0.98em", fontWeight: 500 }}>
                    {Object.entries(studentScores[s.id]?.breakdown ?? {}).map(
                      ([qn, score], idx) => (
                        <span key={qn}>
                          {qn}: <span style={{ color: "#38a169" }}>{score}</span>
                          {idx < Object.keys(studentScores[s.id]?.breakdown ?? {}).length - 1 && ", "}
                        </span>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default FacultyStudentsPage;
