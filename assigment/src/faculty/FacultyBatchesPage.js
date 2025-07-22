import React, { useState } from "react";
import "./FacultyDashboard.css";

function FacultyBatchesPage({ batches, setBatches }) {
  const [newBatch, setNewBatch] = useState("");

  const handleAddBatch = () => {
    if (newBatch.trim()) {
      setBatches([...batches, { id: Date.now(), name: newBatch, students: [] }]);
      setNewBatch("");
    }
  };

  return (
    <div className="faculty-section-card">
      <h2>Student Batches</h2>
      <ul className="batch-list">
        {batches.map(batch => (
          <li key={batch.id}>
            <b>{batch.name}</b> — <small>{batch.students.length} students</small>
          </li>
        ))}
      </ul>
      <div className="batch-add">
        <input
          value={newBatch}
          onChange={e => setNewBatch(e.target.value)}
          placeholder="New batch name"
        />
        <button onClick={handleAddBatch}>Add Batch</button>
      </div>
    </div>
  );
}

export default FacultyBatchesPage;
