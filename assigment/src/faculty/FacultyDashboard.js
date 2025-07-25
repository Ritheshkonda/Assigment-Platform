import React, { useState } from 'react';
import { TopNavBar } from './shared';
import { ManageProblems } from './ManageProblems';
import { ManageContests } from './ManageContests';
import { StudentAnalytics } from './StudentAnalytics';
import FacultySubmissions from './FacultySubmissions';
import './FacultyDashboard.css';


// This is now the main and only export. No more internal/wrapped components.
function FacultyDashboard({ onLogout, currentUser }) {
  const [activeTab, setActiveTab] = useState('manageProblems');

  const navLinks = [
    { name: 'manageProblems', label: 'Manage Problems' },
    { name: 'manageContests', label: 'Manage Contests' },
    { name: 'studentAnalytics', label: 'Student Analytics' },
    { name: 'submissions', label: 'Submissions' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'manageProblems':
        return <ManageProblems />;
      case 'manageContests':
        return <ManageContests />;
      case 'studentAnalytics':
        return <StudentAnalytics />;
      case 'submissions':
        return <FacultySubmissions />;
      default:
        return null;
    }
  };

  return (
    <div className="faculty-dashboard-root">
      <TopNavBar
        onLogout={onLogout}
        user={currentUser}
        heading="Faculty Panel"
      />
      <div className="faculty-tabs-bar">
        {navLinks.map(link => (
          <button
            className={`faculty-tab-btn${activeTab === link.name ? ' active' : ''}`}
            onClick={() => setActiveTab(link.name)}
            key={link.name}
          >
            {link.label}
          </button>
        ))}
      </div>
      <div className="faculty-content-container">
        {renderContent()}
      </div>
    </div>
  );
}

export default FacultyDashboard;
