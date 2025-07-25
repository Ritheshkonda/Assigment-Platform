import React, { useState } from 'react';
import { Plus, Edit, FileDown } from 'lucide-react';
import { useAppData } from './shared';
import { ContestModal } from './ContestModal';

export function ManageContests() {
  const { contests } = useAppData();
  const [showModal, setShowModal] = useState(false);
  const [editingContest, setEditingContest] = useState(null);

  const openModal = (contest) => {
    setEditingContest(contest || null);
    setShowModal(true);
  };

  return (
    <div className="faculty-card">
      <div className="faculty-card-header">
        <span className="faculty-card-title">Manage Contests</span>
        <button className="faculty-action-btn" onClick={() => openModal(null)}>
          <Plus size={18} />
          Create Contest
        </button>
      </div>

      {/* Contests Table */}
      <div className="contests-table-container">
        <div className="contests-table-head">
          <span>Contest Name</span>
          <span style={{ textAlign: 'center' }}>Actions</span>
        </div>
        <div className="contests-table-list">
          {contests.map((contest) => (
            <div className="contests-table-row" key={contest.id}>
              <span className="contest-name-main">{contest.name}</span>
              <span className="actions-cell">
                <button className="faculty-row-btn" onClick={() => openModal(contest)}>
                  <Edit size={16} /> Edit
                </button>
                <button className="faculty-row-btn">
                  <FileDown size={16} /> Export Marks
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <ContestModal
          contest={editingContest}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
