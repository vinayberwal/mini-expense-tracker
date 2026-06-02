import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses/summary`);
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="empty-state">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>

      <div className="stats-grid">
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '16px', borderRadius: '12px', color: '#3b82f6' }}>
            <DollarSign size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Spent</p>
            <h2 style={{ fontSize: '1.75rem', marginTop: '4px' }}>${summary?.total?.toFixed(2) || '0.00'}</h2>
          </div>
        </div>
        
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '12px', color: '#10b981' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Monthly Average</p>
            <h2 style={{ fontSize: '1.75rem', marginTop: '4px' }}>
              ${summary?.byMonth?.length ? (summary.total / summary.byMonth.length).toFixed(2) : '0.00'}
            </h2>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '16px', borderRadius: '12px', color: '#f59e0b' }}>
            <CreditCard size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Transactions</p>
            <h2 style={{ fontSize: '1.75rem', marginTop: '4px' }}>{summary?.recent?.length > 0 ? 'Active' : 'None'}</h2>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="glass-panel">
          <h3 style={{ marginBottom: '24px', fontWeight: 500 }}>Spending Over Time</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary?.byMonth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(30,41,59,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel">
          <h3 style={{ marginBottom: '24px', fontWeight: 500 }}>Expenses by Category</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary?.byCategory || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="total"
                  nameKey="category"
                  stroke="none"
                >
                  {summary?.byCategory?.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(30,41,59,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
            {summary?.byCategory?.slice(0, 4).map((cat: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span style={{ color: 'var(--text-secondary)' }}>{cat.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
