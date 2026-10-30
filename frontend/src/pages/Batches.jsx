import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, Edit } from 'lucide-react';

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await api.get('batches/');
      setBatches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    try {
      await api.post('batches/', { name });
      setName('');
      fetchBatches();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this batch?")) {
      try {
        await api.delete(`batches/${id}/`);
        fetchBatches();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-xl">
        <h1 className="text-h1">Batches</h1>
      </div>

      <div className="card mb-lg">
        <form onSubmit={handleAdd} className="flex gap-md items-end">
          <div className="flex-1">
            <label className="form-label">Batch Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Python Morning"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading || !name}>
            <Plus size={18} /> ADD BATCH
          </button>
        </form>
      </div>

      <div className="grid grid-cols-3 gap-md">
        {batches.map(batch => (
          <div key={batch.id} className="card flex justify-between items-center card-hover">
            <h3 className="text-h3">{batch.name}</h3>
            <button className="btn-icon" onClick={() => handleDelete(batch.id)} style={{color: 'var(--color-danger)'}}>
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Batches;
