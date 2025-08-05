import React, { useState } from 'react';
import { useAppData } from './shared';

export function ContestModal({ contest, onClose }) {
  const { problems, createContest, updateContest } = useAppData();
  
  // State for the form fields
  const [name, setName] = useState(contest?.name || '');
  const [startTime, setStartTime] = useState(contest ? new Date(contest.startTime).toISOString().slice(0, 16) : '');
  const [endTime, setEndTime] = useState(contest ? new Date(contest.endTime).toISOString().slice(0, 16) : '');
  
  const [selectionMode, setSelectionMode] = useState('manual');
  const [numRandomQuestions, setNumRandomQuestions] = useState(3);
  const [selectedProblems, setSelectedProblems] = useState(contest?.problemIds || []);

  // Event Handlers
  const handleProblemToggle = (id) => {
    setSelectedProblems(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleGenerateRandom = () => {
    if (numRandomQuestions > problems.length) {
      alert(`Cannot select ${numRandomQuestions} questions. Only ${problems.length} are available.`);
      return;
    }
    const shuffled = [...problems].sort(() => 0.5 - Math.random());
    const randomProblemIds = shuffled.slice(0, numRandomQuestions).map(p => p.id);
    setSelectedProblems(randomProblemIds);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedProblems.length === 0) {
      alert("Please select at least one problem for the contest.");
      return;
    }
    const data = { name, startTime: new Date(startTime), endTime: new Date(endTime), problemIds: selectedProblems };
    if (contest) {
      updateContest({ ...contest, ...data });
    } else {
      createContest(data);
    }
    onClose();
  };

  const handleContentClick = (e) => e.stopPropagation();

  return (
    <div className="faculty-modal-backdrop" onClick={onClose}>
      <div className="problem-modal-content" onClick={handleContentClick}>
        <h3 className="modal-header-title">{contest ? "Edit Contest" : "Create New Contest"}</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-form-content">
            {/* Contest Name, Start Time, End Time */}
            <div className="form-group">
              <label htmlFor="contestName">Contest Name</label>
              <input id="contestName" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input id="startTime" type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input id="endTime" type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
            </div>
            
            {/* Problem Selection Section */}
            <div className="form-group">
              <label>Problem Selection</label>
              <div className="selection-mode-toggle">
                <button type="button" className={`mode-btn ${selectionMode === 'manual' ? 'active' : ''}`} onClick={() => setSelectionMode('manual')}>Manual Selection</button>
                <button type="button" className={`mode-btn ${selectionMode === 'random' ? 'active' : ''}`} onClick={() => setSelectionMode('random')}>Random Selection</button>
              </div>

              {selectionMode === 'manual' ? (
                <div className="contest-problem-box">
                  {problems.map(p => (
                    <button
                      type="button"
                      key={p.id}
                      className={`contest-problem-label${selectedProblems.includes(p.id) ? " selected" : ""}`}
                      onClick={() => handleProblemToggle(p.id)}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="random-selection-controls">
                  <label htmlFor="numQuestions">Number of Questions:</label>
                  <input
                    id="numQuestions"
                    type="number"
                    className="number-input"
                    value={numRandomQuestions}
                    onChange={(e) => setNumRandomQuestions(parseInt(e.target.value, 10))}
                    min="1"
                    max={problems.length}
                  />
                  <button type="button" className="generate-btn" onClick={handleGenerateRandom}>Generate Set</button>
                </div>
              )}
            </div>

            {/* Selected Problems Display */}
            {selectedProblems.length > 0 && (
              <div className="form-group selected-problems-display">
                <label>Selected Problems ({selectedProblems.length})</label>
                <div className="selected-problems-list-container">
                  <ol className="selected-problems-list-vertical">
                    {selectedProblems.map(id => {
                      const problem = problems.find(p => p.id === id);
                      return problem ? (
                        <li key={id} className="selected-problem-item">
                          {problem.title}
                        </li>
                      ) : null;
                    })}
                  </ol>
                </div>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="modal-secondary-btn">Cancel</button>
            <button type="submit" className="modal-primary-btn">{contest ? "Save Changes" : "Create Contest"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
