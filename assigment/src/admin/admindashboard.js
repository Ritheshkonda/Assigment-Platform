import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import './admindashboard.css';

export default function AdminPage() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [questionsByBatch, setQuestionsByBatch] = useState({});
  const [loading, setLoading] = useState(true);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [testCases, setTestCases] = useState([{ input: '', output: '' }]);
  const [examples, setExamples] = useState([{ input: '', output: '', explanation: '' }]);
  const [newBatchName, setNewBatchName] = useState('');

  const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

  // ✅ Fetch questions from backend
  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/admin/questions", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const grouped = {};
      const batchSet = new Set();

      res.data.forEach(q => {
        const batchName = `Batch ${q.weekNumber || 1}`;
        batchSet.add(batchName);
        if (!grouped[batchName]) grouped[batchName] = [];
        grouped[batchName].push(q);
      });

      const batchesArray = Array.from(batchSet);
      setBatches(batchesArray);
      setSelectedBatch(prev => prev || batchesArray[0]);
      setQuestionsByBatch(grouped);
    } catch (err) {
      console.error("❌ Error fetching admin questions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // ✅ Add Batch
  const handleAddBatch = () => {
    if (newBatchName && !batches.includes(newBatchName)) {
      setBatches([...batches, newBatchName]);
      setQuestionsByBatch({ ...questionsByBatch, [newBatchName]: [] });
      setSelectedBatch(newBatchName);
      setNewBatchName('');
    }
  };

  // ✅ Test Case Logic
  const handleAddTestCase = () => setTestCases([...testCases, { input: '', output: '' }]);
  const handleRemoveTestCase = (i) => setTestCases(testCases.filter((_, idx) => idx !== i));
  const handleTestCaseChange = (i, field, value) => {
    const updated = [...testCases];
    updated[i][field] = value;
    setTestCases(updated);
  };

  const handleAddExample = () => setExamples([...examples, { input: '', output: '', explanation: '' }]);
  const handleRemoveExample = (i) => setExamples(examples.filter((_, idx) => idx !== i));
  const handleExampleChange = (i, field, value) => {
    const updated = [...examples];
    updated[i][field] = value;
    setExamples(updated);
  };

  // ✅ Submit new question
  const handleSubmit = async (e) => {
    e.preventDefault();
    const weekNumber = parseInt(selectedBatch.replace("Batch ", "")) || 1;

    const newQuestion = {
      title,
      description,
      difficulty,
      inputFormat: "Standard input format",
      outputFormat: "Standard output format",
      sampleTestCases: testCases.map(tc => `Input: ${tc.input} → Output: ${tc.output}`),
      weekNumber
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("/admin/questions/add", newQuestion, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Question posted to backend successfully!");
      setTitle('');
      setDescription('');
      setDifficulty('medium');
      setTestCases([{ input: '', output: '' }]);
      setExamples([{ input: '', output: '', explanation: '' }]);
      setShowForm(false);
      setShowQuestions(true);
      fetchQuestions(); // ✅ Reload questions from DB
    } catch (err) {
      console.error("❌ Error posting question:", err);
      alert("❌ Failed to post question.");
    }
  };

  return (
    <div className="admin-page-root">
      <button 
  onClick={handleLogout} 
  className="logout-btn"
>
  Logout
</button>
      <div className="admin-content-container">
        <div className="admin-card">
          <div className="admin-card-title">Admin Page: Manage Questions by Batch</div>

          <div className="batch-selector">
            <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
              {batches.map((b) => (
                <option key={b} value={b}>{b}</option>
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

          <div className="admin-action-buttons">
            <button
              className={`admin-action-btn ${showQuestions ? 'active' : ''}`}
              onClick={() => { setShowQuestions(true); setShowForm(false); }}
            >
              Show Questions
            </button>
            <button
              className={`admin-action-btn ${showForm ? 'active' : ''}`}
              onClick={() => { setShowForm(true); setShowQuestions(false); }}
            >
              Add Question
            </button>
          </div>
          


          {/* Questions List */}
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
                  <div>{q.difficulty}</div>
                  <div><button className="faculty-row-btn">Edit</button></div>
                </div>
              ))}
              {(!questionsByBatch[selectedBatch] || questionsByBatch[selectedBatch].length === 0) && (
                <p>No questions in this batch yet.</p>
              )}
            </div>
          )}

          {/* Add Question Form */}
          {showForm && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option>easy</option>
                  <option>medium</option>
                  <option>hard</option>
                </select>
              </div>

              <div className="form-group">
                <label>Test Cases</label>
                {testCases.map((tc, idx) => (
                  <div key={idx} className="test-case-fields">
                    <textarea placeholder="Input" value={tc.input} onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)} required />
                    <textarea placeholder="Output" value={tc.output} onChange={(e) => handleTestCaseChange(idx, 'output', e.target.value)} required />
                    {testCases.length > 1 && (
                      <button type="button" onClick={() => handleRemoveTestCase(idx)}>✖</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={handleAddTestCase}>＋ Add Test Case</button>
              </div>

              <div className="admin-actions">
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit">Save Question to {selectedBatch}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
