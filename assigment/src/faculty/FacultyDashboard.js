import React, { useState } from "react";
import FacultySidebar from "./FacultySidebar";
import FacultyStudentsPage from "./FacultyStudentsPage";
import FacultyBatchesPage from "./FacultyBatchesPage";
import FacultyQuestionsPage from "./FacultyQuestionsPage";
import "./FacultyDashboard.css";

// Dummy/global state for demonstration; in real use, provide via Context/API
const defaultProblems = [
  {
    id: 1,
    title: "Two Sum",
    description: "Find two numbers that add up to given target.",
    difficulty: "Easy",
    testCases: [
      {input: "2 7 11 15\n9", output: "0 1", marks: 20},
      {input: "3 2 4\n6", output: "1 2", marks: 20},
    ]
  },
  {
    id: 2,
    title: "Merge Sorted Lists",
    description: "Merge two sorted linked lists.",
    difficulty: "Medium",
    testCases: [
      {input: "1 2 4\n1 3 4", output: "1 1 2 3 4 4", marks: 20}
    ]
  }
];

const studentBatches = [
  { id: 1, name: "Batch A", students: [ {id: 1, name: "Alice"}, {id: 2, name: "Bob"} ] },
  { id: 2, name: "Batch B", students: [ {id: 3, name: "Charlie"}, {id: 4, name: "David"} ] },
];

const studentScores = {
  1: { total: 80, breakdown: { "Two Sum": 20, "Merge Sorted Lists": 20, "Subarray": 40 } },
  2: { total: 70, breakdown: { "Two Sum": 20, "Merge Sorted Lists": 10, "Subarray": 40 } },
  3: { total: 65, breakdown: { "Two Sum": 15, "Merge Sorted Lists": 15, "Subarray": 35 } },
  4: { total: 58, breakdown: { "Two Sum": 18, "Merge Sorted Lists": 20, "Subarray": 20 } }
};

function FacultyDashboard() {
  const [activeTab, setActiveTab] = useState("students");
  const [problems, setProblems] = useState(defaultProblems);
  const [batches, setBatches] = useState(studentBatches);

  // Shared editing state for global modal
  const [editingProblem, setEditingProblem] = useState(null);
  const [editingTCProblem, setEditingTCProblem] = useState(null);

  return (
    <div className="faculty-dashboard-root">
      <FacultySidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="faculty-main">
        {activeTab === "students" && (
          <FacultyStudentsPage batches={batches} studentScores={studentScores} />
        )}
        {activeTab === "batches" && (
          <FacultyBatchesPage batches={batches} setBatches={setBatches} />
        )}
        {activeTab === "questions" && (
          <FacultyQuestionsPage
            problems={problems}
            setProblems={setProblems}
            editingProblem={editingProblem}
            setEditingProblem={setEditingProblem}
            editingTCProblem={editingTCProblem}
            setEditingTCProblem={setEditingTCProblem}
          />
        )}
      </main>
    </div>
  );
}

export default FacultyDashboard;
