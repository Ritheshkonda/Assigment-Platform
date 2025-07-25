import React, { useState } from 'react';
import axios from '../api/axios'; // Axios instance
import { Plus, X } from 'lucide-react';

export function ProblemModal({ problem, onClose, refetchAssignments }) {
  const [title, setTitle] = useState(problem?.title || '');
  const [description, setDescription] = useState(problem?.description || '');
  const [difficulty, setDifficulty] = useState(problem?.difficulty || 'Easy');
  const [testCases, setTestCases] = useState(
    problem?.testCases?.length > 0 ? problem.testCases : [{ input: '', output: '' }]
  );

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const handleAddTestCase = () => {
    if (testCases.length < 5) {
      setTestCases([...testCases, { input: '', output: '' }]);
    }
  };

  const handleRemoveTestCase = (index) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const payload = { title, description, difficulty, testCases };

    try {
      if (problem?._id) {
        await axios.put(`/assignments/update/${problem._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('✅ Assignment updated!');
      } else {
        await axios.post('/assignments/create', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('✅ Assignment created!');
      }

      refetchAssignments?.(); // Refresh list
      onClose();              // Close modal
    } catch (err) {
      console.error('❌ Error saving assignment:', err);
      alert('Failed to save assignment. Check console.');
    }
  };

  const handleContentClick = (e) => e.stopPropagation();

  return (
    <div className="faculty-modal-backdrop" onClick={onClose}>
      <div className="problem-modal-content" onClick={handleContentClick}>
        <h3 className="modal-header-title">{problem ? 'Edit Problem' : 'Add New Problem'}</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-form-content">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </div>
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty</label>
              <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label>Test Cases</label>
              <div className="test-case-list">
                {testCases.map((tc, index) => (
                  <div key={index} className="test-case-item">
                    <div className="test-case-header">
                      <span>Test Case {index + 1}</span>
                      {testCases.length > 1 && (
                        <button type="button" className="remove-testcase-btn" onClick={() => handleRemoveTestCase(index)}>
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <div className="test-case-fields">
                      <textarea
                        placeholder="Input"
                        value={tc.input}
                        onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                        rows={3}
                        required
                      />
                      <textarea
                        placeholder="Expected Output"
                        value={tc.output}
                        onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
              {testCases.length < 5 && (
                <button type="button" className="add-testcase-btn" onClick={handleAddTestCase}>
                  <Plus size={16} /> Add Another Test Case
                </button>
              )}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="modal-secondary-btn">Cancel</button>
            <button type="submit" className="modal-primary-btn">Save Problem</button>
          </div>
        </form>
      </div>
    </div>
  );
}
