import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "./SubmissionsPage.css";

dayjs.extend(relativeTime);

function initials(name = "") {
  return name
    .split(" ")
    .map(s => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StatusBadge({ status }) {
  let color, text;
  if (status === "Accepted") {
    color = "#34d399";
    text = "Accepted";
  } else if (status === "Wrong Answer") {
    color = "#f87171";
    text = "Wrong Answer";
  } else {
    color = "#fde68a";
    text = status;
  }
  return (
    <span
      className="status-badge"
      style={{
        backgroundColor: color,
        color: "#232", // dark text for readability
      }}
    >
      {text}
    </span>
  );
}

function SubmissionRow({ submission, onView }) {
  return (
    <tr>
      <td>{submission.problemTitle}</td>
      <td>
        <StatusBadge status={submission.status} />
      </td>
      <td style={{ fontWeight: 600 }}>{submission.language}</td>
      <td>{dayjs(submission.time).fromNow()}</td>
      <td>
        <button className="view-btn" onClick={() => onView(submission)}>
          View
        </button>
      </td>
    </tr>
  );
}

function SubmissionsPage({ userInfo, leaderboard, submissions }) {
  // Sort leaderboard by marks
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.marks - a.marks);
  // Find index of the current user (for highlight)
  const myRank = sortedLeaderboard.findIndex(l => l.id === userInfo?.id);

  // Modal for a single submission details
  const [modalSubmission, setModalSubmission] = useState(null);

  // Filter submissions for this user
  const userSubmissions = submissions.filter(
    (sub) => sub.userId === userInfo?.id
  );

  return (
    <div className="submissions-layout">
      {/* LEFT: Leaderboard */}
      <div className="leaderboard-card">
        <h3>Leaderboard</h3>
        <ol className="leaderboard-list">
          {sortedLeaderboard.map((person, idx) => {
            // Medals for top 3
            let medal = "";
            if (idx === 0) medal = "🥇";
            else if (idx === 1) medal = "🥈";
            else if (idx === 2) medal = "🥉";

            const isMe = person.id === userInfo?.id;
            return (
              <li
                key={person.id}
                className={`leaderboard-entry${isMe ? " me" : ""}`}
              >
                <span className="rank">
                  {medal || idx + 1}
                </span>
                <span className="avatar-circle">
                  {person.avatar ? (
                    <img src={person.avatar} alt={person.name} />
                  ) : (
                    initials(person.name)
                  )}
                </span>
                <span className="name">{person.name}</span>
                <span className="marks">{person.marks} pts</span>
                {isMe && <span className="you-badge">You</span>}
              </li>
            );
          })}
        </ol>
      </div>
      {/* RIGHT: My Submissions */}
      <div className="mysubmissions-card">
        <div className="mysubmissions-header">
          <h3>My Submissions</h3>
        </div>
        <div className="sub-table-wrapper">
          <table className="sub-table">
            <thead>
              <tr>
                <th>Problem</th>
                <th>Status</th>
                <th>Language</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {userSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#888" }}>
                    No submissions yet.
                  </td>
                </tr>
              ) : (
                userSubmissions.map((submission, idx) => (
                  <SubmissionRow
                    key={idx}
                    submission={submission}
                    onView={setModalSubmission}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Optional: Submission Details Modal */}
      {modalSubmission && (
        <div className="modal-backdrop" onClick={() => setModalSubmission(null)}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <h4>
              {modalSubmission.problemTitle} — {modalSubmission.language}
            </h4>
            <StatusBadge status={modalSubmission.status} />
            <hr />
            <pre className="modal-code">
              {modalSubmission.code || "// (No code available in this mockup)"}
            </pre>
            <button onClick={() => setModalSubmission(null)} className="close-modal-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubmissionsPage;
