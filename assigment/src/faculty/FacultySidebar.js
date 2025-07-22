import React from "react";
import "./FacultyDashboard.css";

function FacultySidebar({ activeTab, setActiveTab }) {
  return (
    <nav className="faculty-sidebar">
      <h2>👩‍🏫 Faculty</h2>
      <button className={activeTab === "students" ? "active" : ""} onClick={() => setActiveTab("students")}>
        Student Scores
      </button>
      <button className={activeTab === "batches" ? "active" : ""} onClick={() => setActiveTab("batches")}>
        Student Batches
      </button>
      <button className={activeTab === "questions" ? "active" : ""} onClick={() => setActiveTab("questions")}>
        Questions
      </button>
    </nav>
  );
}

export default FacultySidebar;
