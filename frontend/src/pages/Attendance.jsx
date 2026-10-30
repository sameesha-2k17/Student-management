import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';
import { Search, Save, Check, X, ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import './Attendance.css';

const Attendance = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBatch = searchParams.get('batch');
  
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(initialBatch || '');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({}); // { student_id: 'PRESENT' | 'ABSENT' }
  const [isMarked, setIsMarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  // Toasts
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      loadAttendanceData();
    }
  }, [selectedBatch, date]);

  const fetchBatches = async () => {
    try {
      const res = await api.get('batches/');
      setBatches(res.data);
      if (!selectedBatch && res.data.length > 0) {
        setSelectedBatch(res.data[0].id.toString());
      }
    } catch (err) {
      showToast('Failed to load batches', 'error');
    }
  };

  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      // Fetch students for batch
      const stdRes = await api.get('students/');
      const batchStudents = stdRes.data.filter(s => s.batch.toString() === selectedBatch.toString());
      setStudents(batchStudents);

      // Fetch existing attendance
      const attRes = await api.get(`attendance/?batch=${selectedBatch}&date=${date}`);
      const existing = attRes.data;
      
      const newAttendanceData = {};
      
      if (existing.length > 0) {
        setIsMarked(true);
        existing.forEach(record => {
          newAttendanceData[record.student] = record.status;
        });
        
        // If there are new students without record, default them to PRESENT
        batchStudents.forEach(s => {
          if (!newAttendanceData[s.id]) {
            newAttendanceData[s.id] = 'PRESENT';
          }
        });
      } else {
        setIsMarked(false);
        // Default everyone to PRESENT
        batchStudents.forEach(s => {
          newAttendanceData[s.id] = 'PRESENT';
        });
      }
      
      setAttendanceData(newAttendanceData);
      setUnsavedChanges(false);
    } catch (err) {
      showToast('Failed to load data', 'error');
    }
    setLoading(false);
  };

  const handleToggle = (studentId) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'PRESENT' ? 'ABSENT' : 'PRESENT'
    }));
    setUnsavedChanges(true);
  };

  const handleMarkAll = (status) => {
    const newData = {};
    students.forEach(s => {
      newData[s.id] = status;
    });
    setAttendanceData(newData);
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = Object.entries(attendanceData).map(([studentId, status]) => ({
        student: parseInt(studentId),
        status
      }));
      
      await api.post('attendance/bulk/', {
        batch: parseInt(selectedBatch),
        date: date,
        records: records
      });
      
      setUnsavedChanges(false);
      setIsMarked(true);
      showToast('✓ Attendance saved successfully', 'success');
    } catch (err) {
      showToast('Failed to save attendance', 'error');
    }
    setSaving(false);
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Prevent leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [unsavedChanges]);

  // Derived stats
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.student_id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const presentCount = Object.values(attendanceData).filter(s => s === 'PRESENT').length;
  const absentCount = Object.values(attendanceData).filter(s => s === 'ABSENT').length;

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <h1 className="text-h1">MARK ATTENDANCE</h1>
      </div>

      <div className="filters-card card">
        <div className="grid grid-cols-2 gap-lg" style={{alignItems: 'end'}}>
          <div>
            <label className="form-label">Date</label>
            <input 
              type="date" 
              className="form-control text-h4" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              style={{padding: '1rem', fontWeight: 'bold'}}
            />
          </div>
          <div>
             <label className="form-label">Batch</label>
             <select 
               className="form-control text-h4" 
               value={selectedBatch} 
               onChange={e => setSelectedBatch(e.target.value)}
               style={{padding: '1rem', fontWeight: 'bold'}}
             >
               {batches.map(b => (
                 <option key={b.id} value={b.id}>{b.name}</option>
               ))}
             </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="skeleton" style={{width: '100%', height: '80px', marginBottom: '10px'}}></div>
          <div className="skeleton" style={{width: '100%', height: '80px', marginBottom: '10px'}}></div>
          <div className="skeleton" style={{width: '100%', height: '80px'}}></div>
        </div>
      ) : students.length === 0 ? (
        <div className="card text-center py-xl">
          <p className="text-h3 text-muted">No students in this batch.</p>
        </div>
      ) : (
        <>
          {isMarked && (
            <div className="mb-md" style={{backgroundColor: 'var(--color-success-light)', color: 'var(--color-success-hover)', padding: '1rem', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600'}}>
              <CheckCircle2 /> Attendance already marked for this date. You can edit and save again.
            </div>
          )}
          
          <div className="controls-bar mb-md flex justify-between items-center" style={{flexWrap: 'wrap', gap: '1rem'}}>
            <div className="flex gap-md items-center">
              <span className="badge" style={{fontSize: '1rem'}}>{students.length} Students</span>
              <button className="btn btn-outline" onClick={() => handleMarkAll('PRESENT')}>
                 <Check size={18} /> MARK ALL PRESENT
              </button>
            </div>
            
            <div className="search-box relative" style={{width: '300px', maxWidth: '100%'}}>
              <Search className="absolute left-3 top-3 text-muted" size={20} style={{position: 'absolute', left: '10px', top: '12px'}}/>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search student..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{paddingLeft: '40px'}}
              />
            </div>
          </div>

          <div className="student-list mb-xl">
            {filteredStudents.map(student => {
              const status = attendanceData[student.id] || 'PRESENT';
              const isPresent = status === 'PRESENT';
              
              return (
                <div key={student.id} className={`student-row card ${isPresent ? 'present-row' : 'absent-row'}`} onClick={() => handleToggle(student.id)}>
                  <div className="student-info">
                    <h3 className="text-h3">{student.name}</h3>
                    <p className="text-muted text-h4">{student.student_id}</p>
                  </div>
                  <div className="student-action">
                    <button className={`toggle-btn ${isPresent ? 'btn-present' : 'btn-absent'}`} onClick={(e) => { e.stopPropagation(); handleToggle(student.id); }}>
                      {isPresent ? <><CheckCircle2 size={28}/> PRESENT</> : <><Circle size={28}/> ABSENT</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Bottom Bar */}
          <div className="sticky-bottom-bar">
            <div className="stats flex gap-lg text-h3">
              <span style={{color: 'var(--color-success)'}}>Present: {presentCount}</span>
              <span style={{color: 'var(--color-danger)'}}>Absent: {absentCount}</span>
            </div>
            <button 
              className="btn btn-primary btn-large save-btn flex items-center gap-sm"
              onClick={handleSave}
              disabled={saving}
              style={{fontSize: '1.25rem'}}
            >
              <Save size={24} /> {saving ? 'SAVING...' : 'SAVE ATTENDANCE'}
            </button>
          </div>
        </>
      )}
      
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
