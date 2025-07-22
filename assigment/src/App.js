import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './Login.css';
import './Dashboard.css';

import LoginPage from './components/Login';
import ProblemsPage from './ProblemsPage';
import SubmissionsPage from './SubmissionsPage';
import SolveProblemPage from './SolveProblemPage';
import FacultyDashboard from './faculty/FacultyDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [showProfileDetails, setShowProfileDetails] = useState(false);

  const [problems, setProblems] = useState([
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
      example: { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      testCases: [ {}, {}, {}, {}, {} ]
    },
    {
      id: 2,
      title: 'Merge Sorted Lists',
      difficulty: 'Medium',
      description: 'Merge two sorted linked lists and return it as a new list.',
      example: { input: 'l1 = [1,2,4], l2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
      testCases: [ {}, {}, {}, {}, {} ]
    }
  ]);

  const leaderboard = [
    { id: 2, name: 'Alice', marks: 93, avatar: '', },
    { id: 1, name: 'Bob', marks: 79, avatar: '', },
    { id: 3, name: 'Charlie', marks: 66, avatar: '', }
  ];

  const submissions = [
    { userId: 1, problemTitle: 'Two Sum', status: 'Accepted', language: 'Python', time: '2024-07-20T10:00:00Z', code: 'print("dummy")' },
    { userId: 1, problemTitle: 'Merge Sorted Lists', status: 'Wrong Answer', language: 'C++', time: '2024-07-19T18:12:00Z', code: '// C++ solution' }
  ];

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUserInfo(user);
    setActiveSection('home');
    setShowProfileDetails(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    localStorage.removeItem('token');
    setActiveSection('home');
    setShowProfileDetails(false);
  };

  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="welcome-section">
            <div>
              <h1>Welcome, {userInfo?.name || 'Student'}!</h1>
              <p>Dive into coding challenges and enhance your skills.</p>
            </div>
            <img src="https://placehold.co/100x100/ffffff/000000?text=User" alt="User Avatar"/>
          </div>
        );
      case 'problems':
        return <ProblemsPage problems={problems} setProblems={setProblems} />;
      case 'submissions':
        return <SubmissionsPage userInfo={userInfo} leaderboard={leaderboard} submissions={submissions} />;
      case 'profile':
        return (
          <div className="dashboard-card">
            <h3>Your Profile</h3>
            <div className="profile-info">
              <img src="https://placehold.co/60x60/e0e0e0/333333?text=U" alt="Profile" />
              <div>
                <p className="name">{userInfo?.name || 'N/A'}</p>
                <p className="details">{userInfo?.major || 'N/A'}, {userInfo?.year || 'N/A'}</p>
              </div>
            </div>
            {!showProfileDetails ? (
              <button
                onClick={() => setShowProfileDetails(true)}
                className="profile-toggle-button"
              >
                View Full Profile
              </button>
            ) : (
              <>
                <div className="profile-details-expanded">
                  <p>
                    <strong>Email:</strong>{" "}
                    <span className="email-value">{userInfo?.email || 'N/A'}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowProfileDetails(false)}
                  className="profile-hide-button"
                >
                  Hide Profile Details
                </button>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLogin} />;
  }

  // ✅ Updated condition to check for "teacher" only
  if (userInfo?.role === 'teacher') {
    return <FacultyDashboard userInfo={userInfo} />;
  }

  return (
    <BrowserRouter>
      <div className="dashboard-container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <nav className="navbar">
                  <div className="navbar-brand">PROJECT-IARE</div>
                  <div className="navbar-links">
                    <button onClick={() => setActiveSection('home')} className={`navbar-link${activeSection === 'home' ? ' active' : ''}`}>Home</button>
                    <button onClick={() => setActiveSection('problems')} className={`navbar-link${activeSection === 'problems' ? ' active' : ''}`}>Problems</button>
                    <button onClick={() => setActiveSection('submissions')} className={`navbar-link${activeSection === 'submissions' ? ' active' : ''}`}>Submissions</button>
                    <button onClick={() => setActiveSection('profile')} className={`navbar-link${activeSection === 'profile' ? ' active' : ''}`}>Profile</button>
                    <button onClick={handleLogout} className="navbar-logout-btn">Logout</button>
                  </div>
                </nav>
                <div className="dashboard-content-area">
                  {renderDashboardContent()}
                </div>
              </>
            }
          />
          <Route path="/solve/:problemId" element={<SolveProblemPage problems={problems} userInfo={userInfo} />} />
          <Route path="*" element={<div style={{ padding: 40 }}><h2>404 — Page Not Found</h2></div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
