import React, { useState } from "react";
import FacultyEditTestCases from "./FacultyEditTestCases";
import "./FacultyDashboard.css";

function FacultyQuestionsPage({
  problems,
  setProblems,
  editingProblem,
  setEditingProblem,
  editingTCProblem,
  setEditingTCProblem
}) {
  const [newQn, setNewQn] = useState({ title: "", description: "", difficulty: "Easy" });

  // Add
  const handleAdd = () => {
    if (!newQn.title.trim()) return;
    setProblems([
      ...problems,
      {
        ...newQn,
        id: Date.now(),
        testCases: []
      }
    ]);
    setNewQn({ title: "", description: "", difficulty: "Easy" });
  };

  // Delete
  const handleDelete = id => {
    if (window.confirm("Delete this question?")) {
      setProblems(problems.filter(p => p.id !== id));
    }
  };

  // Edit
  const handleStartEdit = prob => setEditingProblem(prob);

  // Save Edits
  const handleSaveEdit = () => {
    setProblems(problems.map(p =>
      p.id === editingProblem.id ? editingProblem : p
    ));
    setEditingProblem(null);
  };

  return (
    <div className="faculty-section-card">
      <h2>Questions</h2>
      <table className="q-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Difficulty</th>
            <th>Test Cases</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {problems.map(p => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>
                <span className={`q-diff-badge ${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
              </td>
              <td>
                <button onClick={() => setEditingTCProblem(p)}>
                  Edit ({p.testCases.length})
                </button>
              </td>
              <td>
                <button onClick={() => handleStartEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)} style={{ color: "#d00" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <div style={{ marginTop: 20 }}>
        <h3>Add New Question</h3>
        <input
          value={newQn.title}
          onChange={e => setNewQn({ ...newQn, title: e.target.value })}
          placeholder="Title"
        />
        <input
          value={newQn.description}
          onChange={e => setNewQn({ ...newQn, description: e.target.value })}
          placeholder="Description"
        />
        <select
          value={newQn.difficulty}
          onChange={e => setNewQn({ ...newQn, difficulty: e.target.value })}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <button onClick={handleAdd}>Add Question</button>
      </div>

      {/* Inline editor modal */}
      {editingProblem && (
        <div className="modal-backdrop" onClick={() => setEditingProblem(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3>Edit Question</h3>
            <label>
              Title: <input value={editingProblem.title} onChange={e => setEditingProblem({ ...editingProblem, title: e.target.value })} />
            </label>
            <label>
              Description: <input value={editingProblem.description} onChange={e => setEditingProblem({ ...editingProblem, description: e.target.value })} />
            </label>
            <label>
              Difficulty:
              <select
                value={editingProblem.difficulty}
                onChange={e => setEditingProblem({ ...editingProblem, difficulty: e.target.value })}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </label>
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={() => setEditingProblem(null)} style={{ marginLeft: 8, color: "#d00" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit test cases modal */}
      {editingTCProblem && (
        <FacultyEditTestCases
          problem={editingTCProblem}
          setProblem={prob => {
            setProblems(problems.map(p => p.id === prob.id ? prob : p));
            setEditingTCProblem(null);
          }}
          onClose={() => setEditingTCProblem(null)}
        />
      )}
    </div>
  );
}

export default FacultyQuestionsPage;
