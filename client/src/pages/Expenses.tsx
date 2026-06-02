import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Plus, Trash2, Filter } from 'lucide-react';
import ExpenseForm from '../components/ExpenseForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, [categoryFilter]);

  const fetchExpenses = async () => {
    try {
      const url = categoryFilter 
        ? `${API_URL}/expenses?category=${categoryFilter}` 
        : `${API_URL}/expenses`;
      const response = await axios.get(url);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await axios.delete(`${API_URL}/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    fetchExpenses();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Expenses</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Filter size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <select 
              className="input-control" 
              style={{ paddingLeft: '32px', appearance: 'none', minWidth: '150px' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Transportation">Transportation</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Bills & Utilities">Bills & Utilities</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Add Expense
          </button>
        </div>
      </div>

      <div className="glass-panel">
        {expenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses found.</p>
            <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => setShowForm(true)}>
              Add your first expense
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense: any) => (
                  <tr key={expense.id}>
                    <td>{format(new Date(expense.date), 'MMM dd, yyyy')}</td>
                    <td>{expense.description || '-'}</td>
                    <td><span className="badge">{expense.category}</span></td>
                    <td style={{ fontWeight: 500 }}>${expense.amount.toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-danger" style={{ padding: '6px 10px' }} onClick={() => handleDelete(expense.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <ExpenseForm 
          onClose={() => setShowForm(false)} 
          onSuccess={handleSuccess} 
        />
      )}
    </div>
  );
}
