import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Plus, Trash2, Edit } from 'lucide-react';
import { ProblemModal } from './ProblemModal';

export function ManageProblems() {
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);

  const fetchAssignments = async () => {
    const token = localStorage.getItem('token');
    const decoded = JSON.parse(atob(token.split('.')[1]));

    try {
      const res = await axios.get('/assignments/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data.filter((a) => a.createdBy?._id === decoded.id));
    } catch (err) {
      console.error('Error fetching assignments:', err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;

    try {
      await axios.delete(`/assignments/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAssignments(); // Refresh list after delete
      alert('✅ Assignment deleted!');
    } catch (err) {
      console.error('❌ Delete failed:', err);
      alert('Failed to delete assignment.');
    }
  };

  const openModal = (problem) => {
    setEditingProblem(problem || null);
    setShowModal(true);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="faculty-card">
      <div className="faculty-card-header">
        <span className="faculty-card-title">Manage Problems</span>
        <button className="faculty-action-btn" onClick={() => openModal(null)}>
          <Plus size={18} />
          Add Problem
        </button>
      </div>

      <div className="problems-table-container">
        <div className="problems-table-head">
          <span>Title</span>
          <span>Difficulty</span>
          <span>Test Cases</span>
          <span style={{ textAlign: 'center' }}>Actions</span>
        </div>
        <div className="problems-table-list">
          {assignments.map((problem) => (
            <div className="problems-table-row" key={problem._id}>
              <span className="problem-title-main">{problem.title}</span>
              <span className="difficulty-cell">
                <span className={`diff-pill ${problem.difficulty?.toLowerCase()}`}>{problem.difficulty}</span>
              </span>
              <span className="test-cases-cell">{problem.testCases?.length || 0}</span>
              <span className="actions-cell">
                <button className="faculty-row-btn" onClick={() => openModal(problem)}>
                  <Edit size={16} /> Edit
                </button>
                <button className="faculty-row-btn danger" onClick={() => handleDelete(problem._id)}>
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
          refetchAssignments={fetchAssignments}
        />
      )}
    </div>
  );
}
