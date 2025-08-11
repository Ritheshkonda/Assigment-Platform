import React, { useState } from 'react';
import axios from '../api/axios';
import { Plus, X } from 'lucide-react';
import { useAppData } from './shared';

export function ProblemModal({ problem, onClose, refetchAssignments }) {
  const { problems: adminQuestions, batches = [], isLoading } = useAppData();

  const [title, setTitle] = useState(problem?.title || '');
  const [description, setDescription] = useState(problem?.description || '');
  const [difficulty, setDifficulty] = useState(problem?.difficulty || 'Easy');
  const [selectedBatch, setSelectedBatch] = useState(problem?.batch || batches[0]);
  const [assignedWeek, setAssignedWeek] = useState(problem?.week || 1);
  const [dueDate, setDueDate] = useState(problem?.dueDate || new Date().toISOString().slice(0, 10));
  const [exampleInput, setExampleInput] = useState(problem?.exampleTestCase?.input || '');
  const [exampleOutput, setExampleOutput] = useState(problem?.exampleTestCase?.output || '');
  const [testCases, setTestCases] = useState(
    problem?.testCases?.length > 0
      ? problem.testCases.map((tc) => ({ ...tc, hidden: tc.hidden || false }))
      : [{ input: '', output: '', hidden: false }]
  );
  const [selectedAdminQuestion, setSelectedAdminQuestion] = useState(null);

  const handleSelectAdminQuestion = (id) => {
    const selected = adminQuestions.find((q) => q._id === id);
    if (selected) {
      setTitle(selected.title || '');
      setDescription(selected.description || '');
      setDifficulty(selected.difficulty || 'Medium');

      const formattedCases = (selected.sampleTestCases || []).map((line) => ({
        input: line.split('→')[0]?.replace('Input:', '').trim(),
        output: line.split('→')[1]?.replace('Output:', '').trim(),
        hidden: false,
      }));

      setTestCases(formattedCases.length ? formattedCases : [{ input: '', output: '', hidden: false }]);
      setSelectedAdminQuestion(id);
    }
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const handleAddTestCase = () => {
    if (testCases.length < 5) {
      setTestCases([...testCases, { input: '', output: '', hidden: false }]);
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
    
    const payload = {
      title,
      description,
      difficulty,
      batch: selectedBatch, // ✅ store selected batch in DB
      week: assignedWeek,
      weekNumber: assignedWeek,
      dueDate: new Date(dueDate),
      exampleTestCase: { input: exampleInput, output: exampleOutput },
      testCases: testCases.map((tc) => ({ ...tc }))
    };
  
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
      refetchAssignments?.();
      onClose();
    } catch (err) {
      console.error('❌ Error saving assignment:', err);
      alert('Failed to save assignment. Check console.');
    }
  };

  const handleContentClick = (e) => e.stopPropagation();

  return (
    <div className="faculty-modal-backdrop" onClick={onClose}>
      <div className="problem-modal-content" onClick={handleContentClick}>
        <h2 className="modal-header-title">{problem ? 'Edit Problem' : 'Add New Problem'}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-form-content">
            {/* Admin Question Dropdown */}
            <div className="form-group">
              <label>Select from Admin Question Bank</label>
              {isLoading ? (
                <p>Loading questions...</p>
              ) : (
                <select value={selectedAdminQuestion || ''} onChange={(e) => handleSelectAdminQuestion(e.target.value)}>
                  <option value="">-- Select --</option>
                  {adminQuestions.map((q) => (
                    <option key={q._id} value={q._id}>{q.title}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Inputs */}
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label>Assign to Batch</label>
              <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} required>
                {batches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Assign to Week</label>
              <input type="number" min="1" max="52" value={assignedWeek} onChange={(e) => setAssignedWeek(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Example Input</label>
              <textarea value={exampleInput} onChange={(e) => setExampleInput(e.target.value)} />
              <label>Example Output</label>
              <textarea value={exampleOutput} onChange={(e) => setExampleOutput(e.target.value)} />
            </div>

            {/* Test Cases */}
            <div className="test-case-list">
              {testCases.map((tc, index) => (
                <div key={index} className="test-case-item">
                  <div className="test-case-header">
                    Test Case {index + 1}
                    <button type="button" className="remove-testcase-btn" onClick={() => handleRemoveTestCase(index)}><X size={16} /></button>
                  </div>
                  <div className="test-case-fields">
                    <div>
                      <label>Input</label>
                      <textarea value={tc.input} onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)} required />
                    </div>
                    <div>
                      <label>Output</label>
                      <textarea value={tc.output} onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)} required />
                    </div>
                    <div>
                      <label>Hidden</label>
                      <input type="checkbox" checked={tc.hidden} onChange={(e) => handleTestCaseChange(index, 'hidden', e.target.checked)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="add-testcase-btn" onClick={handleAddTestCase}>
              <Plus size={16} /> Add Test Case
            </button>
          </div>
          <div className="modal-actions">
            <button type="button" className="modal-secondary-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-primary-btn">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
