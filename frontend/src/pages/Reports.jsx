import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Download, RefreshCw, AlertCircle } from 'lucide-react';

const Reports = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      fetchReportData();
    }
  }, [selectedBatch]);

  const fetchBatches = async () => {
    try {
      const res = await api.get('batches/');
      setBatches(res.data);
      if (res.data.length > 0) {
        setSelectedBatch(res.data[0].id.toString());
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch batches');
    }
  };

  const fetchReportData = async () => {
    if (!selectedBatch) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`report/batch/?batch=${selectedBatch}`);
      setReportData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch report data');
    }
    setLoading(false);
  };

  const handleExport = async () => {
    if (!selectedBatch) return;
    setDownloading(true);
    try {
      const response = await api.get(`export/excel/?batch=${selectedBatch}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const batchName = batches.find(b => b.id.toString() === selectedBatch)?.name || 'Batch';
      link.setAttribute('download', `attendance_${batchName}.xlsx`);
      
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Failed to download excel", err);
      alert("Failed to download Excel file.");
    }
    setDownloading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-xl">
        <h1 className="text-h1">Attendance Report</h1>
        {reportData && reportData.students.length > 0 && (
          <button 
            className="btn btn-primary"
            onClick={handleExport}
            disabled={downloading}
          >
            <Download size={18} /> 
            {downloading ? 'GENERATING...' : 'DOWNLOAD EXCEL'}
          </button>
        )}
      </div>

      <div className="card mb-lg">
        <div className="form-group mb-0 max-w-lg">
          <label className="form-label">Select Batch</label>
          <select 
            className="form-control"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            {batches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="card text-center text-danger flex items-center justify-center gap-sm" style={{color: 'var(--color-danger)'}}>
          <AlertCircle size={24} />
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-xl">
          <RefreshCw className="spinner text-primary" size={40} />
        </div>
      )}

      {!loading && reportData && (
        <div className="card" style={{overflowX: 'auto', padding: 0}}>
          {reportData.students.length === 0 ? (
            <div className="text-center py-xl text-muted">
              No students or attendance records found for this batch.
            </div>
          ) : (
            <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '600px'}}>
              <thead>
                <tr style={{borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(0,0,0,0.2)'}}>
                  <th style={{padding: '1.25rem 1.5rem'}}>ID</th>
                  <th style={{padding: '1.25rem 1.5rem'}}>Name</th>
                  {reportData.dates.map(date => (
                    <th key={date} style={{padding: '1.25rem 0.5rem', textAlign: 'center', whiteSpace: 'nowrap'}}>{date}</th>
                  ))}
                  <th style={{padding: '1.25rem 1rem', textAlign: 'center', color: 'var(--color-success)'}}>P</th>
                  <th style={{padding: '1.25rem 1rem', textAlign: 'center', color: 'var(--color-danger)'}}>A</th>
                </tr>
              </thead>
              <tbody>
                {reportData.students.map((student, idx) => (
                  <tr key={student.student_id} style={{borderBottom: '1px solid var(--color-border)', backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'}}>
                    <td style={{padding: '1rem 1.5rem', fontWeight: '500'}}>{student.student_id}</td>
                    <td style={{padding: '1rem 1.5rem', fontWeight: '600'}}>{student.name}</td>
                    {reportData.dates.map(date => (
                      <td key={date} style={{
                        padding: '1rem 0.5rem', 
                        textAlign: 'center',
                        fontWeight: '700',
                        color: student.attendance[date] === 'P' ? 'var(--color-success)' : student.attendance[date] === 'A' ? 'var(--color-danger)' : 'var(--color-text-muted)'
                      }}>
                        {student.attendance[date]}
                      </td>
                    ))}
                    <td style={{padding: '1rem', textAlign: 'center', fontWeight: '600'}}>{student.present}</td>
                    <td style={{padding: '1rem', textAlign: 'center', fontWeight: '600'}}>{student.absent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
