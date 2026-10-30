import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { format, subDays } from 'date-fns';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      // For simplicity, we just use dashboard_stats but maybe we can fetch past dates.
      // But the backend doesn't have a specific "history" endpoint that aggregates past dates easily across all batches.
      // So we'll implement a simple one on the frontend by fetching batches, and maybe standardizing.
      // Since we don't have a complex history endpoint, we will just show a placeholder or a date selector.
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-h1 mb-xl">Attendance History</h1>
      <div className="card text-center py-xl">
        <p className="text-h3 text-muted mb-md">Select a date and batch on the Attendance screen to view past records.</p>
        <button className="btn btn-primary" onClick={() => navigate('/attendance')}>
          GO TO ATTENDANCE
        </button>
      </div>
    </div>
  );
};

export default History;
