import React, { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useAppData } from './shared';
import { ProblemModal } from './ProblemModal';

export function ManageProblems() {
  const { problems, deleteProblem } = useAppData();
  const [showModal, setShowModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);

  const openModal = (problem) => {
    setEditingProblem(problem || null);
    setShowModal(true);
  };

  return (
    <div className="faculty-card">
      <div className="faculty-card-header">
        <span className="faculty-card-title">Manage Problems</span>
        <button className="faculty-action-btn" onClick={() => openModal(null)}>
          <Plus size={18} />
          Add Problem
        </button>
      </div>

      {/* Problems Table */}
      <div className="problems-table-container">
        <div className="problems-table-head">
          <span>Title</span>
          <span>Difficulty</span>
          <span>Test Cases</span>
          <span style={{ textAlign: 'center' }}>Actions</span>
        </div>
        <div className="problems-table-list">
          {problems.map((problem) => (
            <div className="problems-table-row" key={problem.id}>
              <span className="problem-title-main">{problem.title}</span>
              <span className="difficulty-cell">
                <span className={`diff-pill ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
              </span>
              {/* THE FIX IS HERE: Displaying the length of the array, not the array itself. */}
              <span className="test-cases-cell">{problem.testCases?.length || 0}</span>
              <span className="actions-cell">
                <button className="faculty-row-btn" onClick={() => openModal(problem)}>
                  <Edit size={16} /> Edit
                </button>
                <button
                  className="faculty-row-btn danger"
                  onClick={() => deleteProblem(problem.id)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <ProblemModal
          problem={editingProblem}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
