import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CATEGORIES = [
  'Food & Dining', 'Transportation', 'Shopping', 
  'Entertainment', 'Bills & Utilities', 'Other'
];

interface ExpenseFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ExpenseForm({ onClose, onSuccess }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    category: CATEGORIES[0],
    description: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/expenses`, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Add New Expense</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        {error && <div style={{ color: 'var(--danger-color)', marginBottom: '16px', fontSize: '0.875rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="amount">Amount ($)</label>
            <input 
              type="number" 
              id="amount" 
              name="amount" 
              className="input-control" 
              placeholder="0.00" 
              step="0.01" 
              min="0.01"
              required
              value={formData.amount}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="category">Category</label>
            <select 
              id="category" 
              name="category" 
              className="input-control"
              value={formData.category}
              onChange={handleChange}
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="date">Date</label>
            <input 
              type="date" 
              id="date" 
              name="date" 
              className="input-control" 
              required
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="description">Description (Optional)</label>
            <input 
              type="text" 
              id="description" 
              name="description" 
              className="input-control" 
              placeholder="e.g. Lunch at Chipotle"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
            <button type="button" className="btn" onClick={onClose} style={{ color: 'var(--text-secondary)' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
