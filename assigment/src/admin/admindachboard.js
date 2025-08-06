import React, { useState } from 'react';
import './admindashboard.css'; // Import the updated CSS

export default function AdminPage() {
  // State for batches and questions (simulated; replace with API data)
  const [batches, setBatches] = useState(['Batch 1', 'Batch 2']); // List of batches
  const [selectedBatch, setSelectedBatch] = useState(batches[0] || '');
  const [newBatchName, setNewBatchName] = useState('');
  const [questionsByBatch, setQuestionsByBatch] = useState({
    'Batch 1': [
      { title: 'Sample Problem 1', difficulty: 'easy' },
      { title: 'Sample Problem 2', difficulty: 'medium' },
    ],
    'Batch 2': [
      { title: 'Sample Problem A', difficulty: 'hard' },
    ],
  });

  // State for add form
  const [showForm, setShowForm] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [testCases, setTestCases] = useState([{ input: '', output: '' }]);
  const [examples, setExamples] = useState([{ input: '', output: '', explanation: '' }]);

  // Handlers for batches
  const handleAddBatch = () => {
    if (newBatchName && !batches.includes(newBatchName)) {
      setBatches([...batches, newBatchName]);
      setQuestionsByBatch({ ...questionsByBatch, [newBatchName]: [] });
      setSelectedBatch(newBatchName);
      setNewBatchName('');
    }
  };

  // Handlers for add form (same as before, but associates with batch)
  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', output: '' }]);
  };

  const handleRemoveTestCase = (index) => {
    setTestCases(testCases.filter((_, idx) => idx !== index));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const handleAddExample = () => {
    setExamples([...examples, { input: '', output: '', explanation: '' }]);
  };

  const handleRemoveExample = (index) => {
    setExamples(examples.filter((_, idx) => idx !== index));
  };

  const handleExampleChange = (index, field, value) => {
    const updated = [...examples];
    updated[index][field] = value;
    setExamples(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuestion = { title, description, difficulty, testCases, examples };
    const updatedQuestions = {
      ...questionsByBatch,
      [selectedBatch]: [...(questionsByBatch[selectedBatch] || []), newQuestion],
    };
    setQuestionsByBatch(updatedQuestions);
    console.log(`Added to ${selectedBatch}:`, newQuestion); // Replace with API call

    // Reset form
    setTitle('');
    setDescription('');
    setDifficulty('medium');
    setTestCases([{ input: '', output: '' }]);
    setExamples([{ input: '', output: '', explanation: '' }]);
    setShowForm(false);
    setShowQuestions(true); // Show updated list after adding
  };

  // Toggle views
  const handleShowQuestions = () => {
    setShowForm(false);
    setShowQuestions(true);
  };

  const handleAddQuestion = () => {
    setShowQuestions(false);
    setShowForm(true);
  };

  return (
    <div className="admin-page-root">
      <div className="admin-content-container">
        <div className="admin-card">
          <div className="admin-card-title">Admin Page: Manage Questions by Batch</div>

          {/* Batch Selector */}
          <div className="batch-selector">
            <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
              {batches.map((batch) => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="New Batch Name"
              value={newBatchName}
              onChange={(e) => setNewBatchName(e.target.value)}
            />
            <button onClick={handleAddBatch}>Add Batch</button>
          </div>

          {/* Action Buttons */}
          <div className="admin-action-buttons">
            <button
              className={`admin-action-btn ${showQuestions ? 'active' : ''}`}
              onClick={handleShowQuestions}
            >
              Show Questions
            </button>
            <button
              className={`admin-action-btn ${showForm ? 'active' : ''}`}
              onClick={handleAddQuestion}
            >
              Add Question
            </button>
          </div>

          {showQuestions && (
  <div className="questions-list-container">
    <div className="questions-list-head">
      <div>Title</div>
      <div>Difficulty</div>
      <div>Actions</div>
    </div>
    {(questionsByBatch[selectedBatch] || []).map((q, idx) => (
      <div className="questions-list-row" key={idx}>
        <div className="question-title">{q.title}</div>
        <div className="difficulty-tag">{q.difficulty}</div>
        <div>
          <button className="edit-btn">Edit</button>
          <button className="delete-btn">Delete</button>
        </div>
      </div>
    ))}
    {(!questionsByBatch[selectedBatch] || questionsByBatch[selectedBatch].length === 0) && (
      <p className="no-questions-text">No questions in this batch yet.</p>
    )}
  </div>
)}


          {/* Add Question Form View */}
          {showForm && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="difficulty">Difficulty</label>
                <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Test Cases Section */}
              <div className="form-group">
                <label>Test Cases (Hidden)</label>
                <div className="test-case-list">
                  {testCases.map((tc, idx) => (
                    <div className="test-case-item" key={idx}>
                      <div className="test-case-header">
                        Test Case #{idx + 1}
                        {testCases.length > 1 && (
                          <button type="button" className="remove-btn" onClick={() => handleRemoveTestCase(idx)}>✖</button>
                        )}
                      </div>
                      <div className="test-case-fields">
                        <textarea placeholder="Input" value={tc.input} onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)} rows={3} required />
                        <textarea placeholder="Expected Output" value={tc.output} onChange={(e) => handleTestCaseChange(idx, 'output', e.target.value)} rows={3} required />
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" className="add-testcase-btn" onClick={handleAddTestCase}>＋ Add Test Case</button>
              </div>

              {/* Example Test Cases Section */}
              <div className="form-group">
                <label>Example Test Cases (Visible to Users)</label>
                <div className="example-list">
                  {examples.map((ex, idx) => (
                    <div className="example-item" key={idx}>
                      <div className="example-header">
                        Example #{idx + 1}
                        {examples.length > 1 && (
                          <button type="button" className="remove-btn" onClick={() => handleRemoveExample(idx)}>✖</button>
                        )}
                      </div>
                      <div className="example-fields">
                        <textarea placeholder="Input" value={ex.input} onChange={(e) => handleExampleChange(idx, 'input', e.target.value)} rows={3} required />
                        <textarea placeholder="Expected Output" value={ex.output} onChange={(e) => handleExampleChange(idx, 'output', e.target.value)} rows={3} required />
                      </div>
                      <div className="form-group">
                        <label>Explanation (Optional)</label>
                        <textarea placeholder="Explanation" value={ex.explanation} onChange={(e) => handleExampleChange(idx, 'explanation', e.target.value)} rows={3} />
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" className="add-example-btn" onClick={handleAddExample}>＋ Add Example</button>
              </div>

              <div className="admin-actions">
                <button type="button" className="admin-secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="admin-primary-btn">Save Question to {selectedBatch}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
