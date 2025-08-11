// shared.js
import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from '../api/axios';

const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  const [adminQuestions, setAdminQuestions] = useState([]);
  const [batches, setBatches] = useState(['Batch 1', 'Batch 2', 'Batch 3']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminQuestions = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get('/admin/questions/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAdminQuestions(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch admin questions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminQuestions();
  }, []);

  return (
    <AppDataContext.Provider value={{ problems: adminQuestions, batches, isLoading }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}

export function TopNavBar({ heading, user, onLogout }) {
  return (
    <div style={{
      background: '#1F2854', color: 'white', padding: '12px 24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{heading}</span>
      <div>
        <span>Welcome, {user?.name || 'Faculty'}</span>
        <button
          onClick={onLogout}
          style={{
            marginLeft: '16px', background: '#725cad',
            color: 'white', border: 'none', padding: '8px 16px',
            borderRadius: '12px', cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
