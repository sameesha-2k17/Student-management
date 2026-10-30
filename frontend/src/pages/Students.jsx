import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, Search } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    batch: '',
    course: '',
    phone: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stdRes, bRes] = await Promise.all([
        api.get('students/'),
        api.get('batches/')
      ]);
      setStudents(stdRes.data);
      setBatches(bRes.data);
      if (bRes.data.length > 0) {
        setFormData(prev => ({...prev, batch: bRes.data[0].id}));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('students/', formData);
      setFormData({
        ...formData,
        student_id: '',
        name: '',
        phone: ''
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      try {
        await api.delete(`students/${id}/`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.student_id.toLowerCase().includes(search.toLowerCase()) ||
    (s.batch_name && s.batch_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-xl">
        <h1 className="text-h1">Students</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} /> ADD STUDENT
        </button>
      </div>

      {showForm && (
        <div className="card mb-lg">
          <h3 className="text-h3 mb-md">New Student</h3>
          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-2 gap-md mb-md">
              <div>
                <label className="form-label">Student ID</label>
                <input required type="text" className="form-control" value={formData.student_id} onChange={e => setFormData({...formData, student_id: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Name</label>
                <input required type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Batch</label>
                <select required className="form-control" value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})}>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Phone (Optional)</label>
                <input type="text" className="form-control" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-sm">
              <button type="submit" className="btn btn-primary" disabled={loading}>SAVE STUDENT</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>CANCEL</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="mb-md relative">
          <Search className="absolute left-3 top-3 text-muted" size={20} style={{position: 'absolute', left: '10px', top: '12px'}}/>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search students..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{paddingLeft: '40px'}}
          />
        </div>

        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '2px solid var(--color-border)'}}>
                <th style={{padding: '1rem'}}>ID</th>
                <th style={{padding: '1rem'}}>Name</th>
                <th style={{padding: '1rem'}}>Batch</th>
                <th style={{padding: '1rem'}}>Phone</th>
                <th style={{padding: '1rem'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id} style={{borderBottom: '1px solid var(--color-border)'}}>
                  <td style={{padding: '1rem', fontWeight: '500'}}>{student.student_id}</td>
                  <td style={{padding: '1rem'}}>{student.name}</td>
                  <td style={{padding: '1rem'}}><span className="badge badge-primary">{student.batch_name}</span></td>
                  <td style={{padding: '1rem', color: 'var(--color-text-muted)'}}>{student.phone || '-'}</td>
                  <td style={{padding: '1rem'}}>
                    <button className="btn-icon" onClick={() => handleDelete(student.id, student.name)} style={{color: 'var(--color-danger)'}}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-lg text-muted">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;
