import React, { useState, createContext, useContext } from 'react';

// Mock Data with the correct test case structure
const initialData = {
  problems: [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
      testCases: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      ]
    },
    {
      id: 2,
      title: 'Reverse a String',
      difficulty: 'Easy',
      description: 'Reverse a given string without using built-in reverse functions.',
      testCases: [
        { input: '"hello"', output: '"olleh"' },
        { input: '"Hannah"', output: '"hannaH"' },
      ]
    },
    {
      id: 3,
      title: 'Merge Sorted Arrays',
      difficulty: 'Medium',
      description: 'Merge two sorted integer arrays into a single sorted array.',
      testCases: [
        { input: 'nums1 = [1,3,5], nums2 = [2,4,6]', output: '[1,2,3,4,5,6]' },
        { input: 'nums1 = [0], nums2 = [1]', output: '[0,1]' },
      ]
    },
  ],
  contests: [
    { id: 1, name: 'Midterm Exam 1', problemIds: [1, 2], startTime: new Date(), endTime: new Date() },
    { id: 2, name: 'Final Coding Challenge', problemIds: [1, 2, 3], startTime: new Date(), endTime: new Date() },
  ],
  users: [ { id: 1, name: 'Alice'}, { id: 2, name: 'Bob'}, { id: 3, name: 'Charlie'} ],
};

// Create a Context for app data
const AppDataContext = createContext();

// Provider Component to wrap your app
export function AppDataProvider({ children }) {
  const [data, setData] = useState(initialData);

  const addProblem = (problem) => setData(prev => ({ ...prev, problems: [...prev.problems, { ...problem, id: Date.now() }] }));
  const updateProblem = (updatedProblem) => setData(prev => ({ ...prev, problems: prev.problems.map(p => p.id === updatedProblem.id ? updatedProblem : p) }));
  const deleteProblem = (id) => setData(prev => ({ ...prev, problems: prev.problems.filter(p => p.id !== id) }));
  const createContest = (contest) => setData(prev => ({ ...prev, contests: [...prev.contests, { ...contest, id: Date.now() }] }));
  const updateContest = (updatedContest) => setData(prev => ({...prev, contests: prev.contests.map(c => c.id === updatedContest.id ? updatedContest : c)}));

  const value = { ...data, addProblem, updateProblem, deleteProblem, createContest, updateContest };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

// Custom Hook to easily access data
export function useAppData() {
  return useContext(AppDataContext);
}

// Shared TopNavBar component
export function TopNavBar({ heading, user, onLogout }) {
  return (
    <div style={{ background: '#1F2854', color: 'white', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{heading}</span>
      <div>
        <span>Welcome, {user?.name || 'Faculty'}</span>
        <button onClick={onLogout} style={{ marginLeft: '16px', background: '#725cad', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </div>
  );
}
