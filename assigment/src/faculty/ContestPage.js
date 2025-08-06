import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppDataContext } from './faculty/shared';

export default function StudentContestsPage() {
  const { contests } = useContext(AppDataContext) || { contests: [] };
  const navigate = useNavigate();
  const now = Date.now();

  if (!contests || contests.length === 0) {
    return <div style={{ padding: 40, textAlign: 'center' }}>No contests are available.</div>;
  }

  return (
    <main className="student-contests-page">
      <h1 style={{ textAlign: 'center', color: '#725cad' }}>Available Contests</h1>
      <div className="contest-list">
        {contests.map(contest => {
          const isActive = now >= new Date(contest.startTime).getTime() && now <= new Date(contest.endTime).getTime();
          return (
            <div key={contest.id} className="contest-card">
              <h2>{contest.title}</h2>
              <p>{contest.description}</p>
              <p>
                <b>Start:</b> {new Date(contest.startTime).toLocaleString()}<br/>
                <b>End:</b> {new Date(contest.endTime).toLocaleString()}
              </p>
              <button
                className="start-contest-btn"
                disabled={!isActive}
                onClick={() => navigate(`/contests/${contest.id}`)}
              >
                {isActive ? 'Enter Contest' : 'Not Available'}
              </button>
              {!isActive && (
                <p style={{ color: 'orangered', fontSize: '0.92rem' }}>
                  {now < new Date(contest.startTime).getTime()
                    ? "Contest hasn't started yet."
                    : "Contest has ended."}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
