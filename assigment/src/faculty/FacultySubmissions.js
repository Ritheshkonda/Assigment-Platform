import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "./FacultySubmissions.css";

function FacultySubmissions() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("/submissions/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(res.data);
    };
    fetchAll();
  }, []);

  const handleEvaluate = async (id) => {
    const token = localStorage.getItem("token");
    await axios.put(`/submissions/evaluate/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("✅ Evaluated!");
    window.location.reload();
  };

  return (
    <div className="faculty-submissions-wrapper">
      <h2>📄 Student Submissions</h2>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <table className="submissions-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Assignment</th>
              <th>Status</th>
              <th>Marks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s._id}>
                <td>{s.student?.name || "Unknown"}</td>
                <td>{s.assignmentTitle}</td>
                <td>{s.status}</td>
                <td>{s.marks || "-"}</td>
                <td>
                  {s.status === "pending" ? (
                    <button onClick={() => handleEvaluate(s._id)}>Evaluate</button>
                  ) : (
                    <span>✅ Reviewed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FacultySubmissions;
