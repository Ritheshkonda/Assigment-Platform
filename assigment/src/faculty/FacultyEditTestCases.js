import React, { useState } from "react";
import "./FacultyDashboard.css";

function FacultyEditTestCases({ problem, setProblem, onClose }) {
  const [testCases, setTestCases] = useState([...problem.testCases]);

  // Add
  const addTC = () => setTestCases([...testCases, { input: "", output: "", marks: 20 }]);
  // Save
  const saveAll = () => setProblem({ ...problem, testCases });
  // Delete
  const delTC = idx => setTestCases(testCases.filter((_, i) => i !== idx));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <h3>Edit Test Cases for <b>{problem.title}</b></h3>
        {testCases.map((tc, idx) => (
          <div key={idx} className="tc-edit-row">
            <div>
              <label>Input:
                <textarea value={tc.input} onChange={e => {
                  const x = [...testCases];
                  x[idx].input = e.target.value;
                  setTestCases(x);
                }} />
              </label>
            </div>
            <div>
              <label>Output:
                <textarea value={tc.output} onChange={e => {
                  const x = [...testCases];
                  x[idx].output = e.target.value;
                  setTestCases(x);
                }} />
              </label>
            </div>
            <div>
              <label>Marks:
                <input type="number" value={tc.marks} min="0" max="20"
                  onChange={e => {
                    const x = [...testCases];
                    x[idx].marks = Number(e.target.value);
                    setTestCases(x);
                  }} />
              </label>
            </div>
            <button onClick={() => delTC(idx)} style={{color:"#d00", marginLeft:4}}>Delete</button>
          </div>
        ))}
        <button onClick={addTC} style={{ marginRight: 8 }}>Add Test Case</button>
        <button onClick={saveAll} style={{ background: "#38a169", color: "#fff" }}>Save</button>
        <button onClick={onClose} style={{ marginLeft: 8 }}>Close</button>
      </div>
    </div>
  );
}

export default FacultyEditTestCases;
