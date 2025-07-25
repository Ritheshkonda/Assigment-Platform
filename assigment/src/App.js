import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './Login.css';
import './Dashboard.css';
import axios from "./api/axios";

import LoginPage from './components/Login';
import ProblemsPage from './ProblemsPage';
import SubmissionsPage from './SubmissionsPage';
import SolveProblemPage from './SolveProblemPage';
import FacultyDashboard from './faculty/FacultyDashboard';
import { AppDataProvider } from './faculty/shared';
// NEW: Import the contest page


function Announcements({ announcements }) {
  if (!announcements || announcements.length === 0) return null;
  return (
    <div className="announcements-card">
      <h4>📢 Latest Announcements</h4>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {announcements.map(a => (
          <li key={a.id} className="announce-item">
            <div className="announce-title">{a.title}</div>
            <div className="announce-msg">{a.message}</div>
            <div className="announce-date">{a.date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [announcements] = useState([
    { id: 1, title: "Platform Maintenance", message: "The site will be under maintenance this Sunday, 1–3am.", date: "2024-07-21" },
    { id: 2, title: "New Problem Added", message: "Try the newly added 'Binary Tree Paths' challenge!", date: "2024-07-20" }
  ]);
  const leaderboard = [
    { id: 2, name: 'Alice', marks: 93 },
    { id: 1, name: 'Bob', marks: 79 },
  ];
  const submissions = [
    { userId: 1, problemTitle: 'Two Sum', status: 'Accepted', language: 'Python', time: '2024-07-20T10:00:00Z' },
  ];

  // ✅ Fetch assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await axios.get("/assignments/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAssignments(response.data);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      }
    };
    fetchAssignments();
  }, []);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUserInfo(user);
    setActiveSection('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    localStorage.removeItem('token');
  };

  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <>
            <div className="welcome-section">
              <div>
                <h1>Welcome, {userInfo?.name || 'Student'}!</h1>
                <p>Dive into coding challenges and enhance your skills.</p>
              </div>
              <img src="https://iare-data.s3.ap-south-1.amazonaws.com/uploads/STUDENTS/23951A66F7/23951A66F7.jpg" alt="User Avatar" />
            </div>
            <Announcements announcements={announcements} />
          </>
        );
      case 'problems':
        return <ProblemsPage problems={assignments} />;
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
              <button onClick={() => setShowProfileDetails(true)} className="profile-toggle-button">View Full Profile</button>
            ) : (
              <>
                <div className="profile-details-expanded">
                  <p><strong>Email:</strong> <span className="email-value">{userInfo?.email || 'N/A'}</span></p>
                </div>
                <button onClick={() => setShowProfileDetails(false)} className="profile-hide-button">Hide Profile Details</button>
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

  if (userInfo?.role === 'faculty' || userInfo?.role === 'teacher') {
    return (
      <AppDataProvider>
        <FacultyDashboard currentUser={userInfo} onLogout={handleLogout} />
      </AppDataProvider>
    );
  }

  return (
    <BrowserRouter>
      <div className="dashboard-container">
        <Routes>
          <Route path="/" element={
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
          } />
          <Route path="/solve/:problemId" element={<SolveProblemPage problems={assignments} userInfo={userInfo} />} />
          <Route path="*" element={
            <div style={{ padding: 40, textAlign: 'center' }}>
              <h2>404 — Page Not Found</h2>
              <a href="/" style={{ color: '#725cad', textDecoration: 'none', fontWeight: 'bold' }}>Go Home</a>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
