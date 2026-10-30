import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';
import { CheckCircle, AlertCircle, Edit, Plus } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('dashboard/');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard stats", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  const today = data ? new Date(data.date) : new Date();
  const formattedDate = format(today, 'EEEE, d MMMM yyyy');

  return (
    <div>
      <div className="mb-xl">
        <h1 className="text-h1 mb-xs">GOOD MORNING 👋</h1>
        <p className="text-h4 text-muted">{formattedDate}</p>
      </div>

      <div className="mb-lg flex justify-between items-center">
        <h2 className="text-h2">Today's Attendance</h2>
        
        <div className="flex gap-sm">
           <button onClick={() => navigate('/students')} className="btn btn-outline">
              STUDENTS
           </button>
           <button onClick={() => navigate('/history')} className="btn btn-outline">
              HISTORY
           </button>
           <button onClick={() => navigate('/reports')} className="btn btn-outline">
              REPORTS
           </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-lg">
        {data && data.stats.map(batch => (
          <div key={batch.batch_id} className="card card-hover">
            <h3 className="text-h3 mb-xs">{batch.batch_name}</h3>
            <p className="text-muted mb-md">{batch.total_students} Students</p>
            
            {batch.is_marked ? (
              <>
                <div className="flex gap-md mb-md text-h4">
                  <div className="flex items-center gap-sm" style={{color: 'var(--color-success)'}}>
                    <CheckCircle size={24} /> Present: {batch.present}
                  </div>
                  <div className="flex items-center gap-sm" style={{color: 'var(--color-danger)'}}>
                    <AlertCircle size={24} /> Absent: {batch.absent}
                  </div>
                </div>
                
                <hr style={{borderColor: 'var(--color-border)', margin: 'var(--space-md) 0'}} />
                
                <button 
                  className="btn btn-outline btn-block"
                  onClick={() => navigate(`/attendance?batch=${batch.batch_id}`)}
                >
                  <Edit size={18} /> VIEW / EDIT
                </button>
              </>
            ) : (
              <>
                <div className="mb-md" style={{padding: 'var(--space-md)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--border-radius-md)'}}>
                  <p className="text-muted text-center">Attendance not marked yet</p>
                </div>
                
                <button 
                  className="btn btn-primary btn-block btn-large"
                  onClick={() => navigate(`/attendance?batch=${batch.batch_id}`)}
                >
                  <Plus size={20} /> MARK ATTENDANCE
                </button>
              </>
            )}
          </div>
        ))}
        
        {data && data.stats.length === 0 && (
          <div className="card" style={{gridColumn: '1 / -1'}}>
            <div className="text-center py-xl">
              <p className="text-muted mb-md">No batches found.</p>
              <button className="btn btn-primary" onClick={() => navigate('/batches')}>
                <Plus size={18} /> ADD BATCH
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
