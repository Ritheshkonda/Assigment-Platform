import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Split from "react-split";
import MonacoEditor from "@monaco-editor/react";
import axios from "./api/axios";
import "./SolveProblemPage.css";

function SolveProblemPage({ problems, userInfo }) {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const problem = problems.find((p) => String(p._id) === String(problemId)) || {};

  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("python");
  const [tab, setTab] = useState("description");
  const [runMessage, setRunMessage] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const [testCaseResults, setTestCaseResults] = useState([null, null, null, null, null]);

  const example = problem.example || { input: "1 2", output: "3" };

  // Fetch previous submission if exists
  useEffect(() => {
    const fetchPreviousSubmission = async () => {
      const token = localStorage.getItem("token");
      if (!token || !problem.title) return;

      try {
        const res = await axios.get("/submissions/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const matchingSubmission = res.data.find(
          (s) => s.assignmentTitle === problem.title
        );

        if (matchingSubmission) {
          setCode(matchingSubmission.fileUrl);
        }
      } catch (err) {
        console.error("❌ Error fetching previous submission:", err);
      }
    };

    fetchPreviousSubmission();
  }, [problem.title]);

  // Simulate test case run
  const handleRun = () => {
    const simulated = Array(5).fill(0).map(() => Math.random() > 0.5);
    setTestCaseResults(simulated);
    setRunMessage("✅ Code evaluated. Green = pass, Red = fail.");
    setTab("testcases");
  };

  const handleRunCustom = () => {
    if (customInput.trim().length > 0) {
      setCustomOutput("(Simulated Output): " + customInput.split("").reverse().join(""));
    } else {
      setCustomOutput("");
    }
  };

  // Submit code (will overwrite previous submission)
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setRunMessage("❌ No token found. Please login again.");
      return;
    }

    if (!problem || !problem.title) {
      setRunMessage("❌ Problem not found or title missing.");
      return;
    }

    try {
      const payload = {
        assignmentTitle: problem.title,
        fileUrl: code,
        contestId: problem.contestId || "",
        language, // ✅ ensure this is included
      };
    
      console.log("Submitting payload:", payload);
    
      await axios.post("/submissions/submit", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    
      setRunMessage("✅ Submission sent successfully!");
      setTab("testcases");
    } catch (err) {
      console.error("❌ Submission failed:", err.response?.data || err.message);
      setRunMessage("❌ Error submitting your solution.");
    }
  };

  return (
    <div className="solve-problem-page-root">
      <Split className="split-panel" sizes={[46, 54]} minSize={320} gutterSize={6} cursor="col-resize">
        {/* LEFT PANEL */}
        <div className="left-question-panel">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="arrow">←</span> Back
          </button>
          <h2>{problem.title}</h2>
          <div className={`difficulty-badge ${problem.difficulty?.toLowerCase()}`}>
            {problem.difficulty}
          </div>
          <div className="panel-tabs">
            {["description", "examples", "testcases", "custom"].map((tabName) => (
              <button
                key={tabName}
                className={tab === tabName ? "active" : ""}
                onClick={() => setTab(tabName)}
              >
                {tabName[0].toUpperCase() + tabName.slice(1)}
              </button>
            ))}
          </div>

          <div className="panel-tabpane">
            {tab === "description" && (
              <div className="question-description">
                {problem.description || "No description available."}
              </div>
            )}
            {tab === "examples" && (
              <div>
                <strong>Example Input:</strong>
                <pre>{example.input}</pre>
                <strong>Example Output:</strong>
                <pre>{example.output}</pre>
              </div>
            )}
            {tab === "testcases" && (
              <div>
                <div className="testcase-boxes">
                  {testCaseResults.map((res, i) => (
                    <div
                      key={i}
                      className={`testcase-box ${res === null ? "idle" : res ? "pass" : "fail"}`}
                      title={res === null ? "Not evaluated" : res ? "Passed" : "Failed"}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="testcase-note">
                  Test cases will be evaluated automatically on submission.
                </div>
              </div>
            )}
            {tab === "custom" && (
              <div>
                <label htmlFor="custom-input"><strong>Custom Input:</strong></label>
                <textarea
                  id="custom-input"
                  className="custom-input-area"
                  rows="6"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter your own test input here"
                />
                <button
                  className="run-btn"
                  style={{ marginTop: 12, minWidth: 120 }}
                  onClick={handleRunCustom}
                >
                  Run Custom Input
                </button>
                {customOutput && (
                  <div className="custom-output-box">
                    <b>Custom Output:</b>
                    <pre>{customOutput}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-editor-panel">
          <div className="editor-toolbar">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
            <button className="run-btn" onClick={handleRun}>Run</button>
            <button className="submit-btn" style={{ marginLeft: 8 }} onClick={handleSubmit}>
              Submit
            </button>
          </div>
          <MonacoEditor
            height="410px"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(val) => setCode(val)}
            options={{ fontSize: 15, minimap: { enabled: false } }}
          />
          {runMessage && <div className="output-panel">{runMessage}</div>}
        </div>
      </Split>
    </div>
  );
}

export default SolveProblemPage;
