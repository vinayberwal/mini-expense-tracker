import { Router } from 'express';
import { getDb } from './db';
import { z } from 'zod';

const router = Router();

const expenseSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
});

// Get all expenses with optional filtering
router.get('/expenses', async (req, res) => {
  try {
    const db = await getDb();
    const { category, startDate, endDate, sort = 'date', order = 'desc' } = req.query;
    
    let query = 'SELECT * FROM expenses WHERE 1=1';
    const params: any[] = [];
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }
    
    const validSortFields = ['date', 'amount', 'category', 'createdAt'];
    const sortField = validSortFields.includes(sort as string) ? sort : 'date';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY ${sortField} ${sortOrder}`;
    
    const expenses = await db.all(query, params);
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Get summary for dashboard
router.get('/expenses/summary', async (req, res) => {
  try {
    const db = await getDb();
    
    // Total expenses
    const totalResult = await db.get('SELECT SUM(amount) as total FROM expenses');
    const total = totalResult?.total || 0;
    
    // Expenses by category
    const byCategory = await db.all('SELECT category, SUM(amount) as total FROM expenses GROUP BY category ORDER BY total DESC');
    
    // Expenses by month (last 6 months)
    const byMonth = await db.all(`
      SELECT strftime('%Y-%m', date) as month, SUM(amount) as total 
      FROM expenses 
      GROUP BY month 
      ORDER BY month DESC 
      LIMIT 6
    `);
    
    // Recent expenses
    const recent = await db.all('SELECT * FROM expenses ORDER BY date DESC, id DESC LIMIT 5');
    
    res.json({ total, byCategory, byMonth: byMonth.reverse(), recent });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Add a new expense
router.post('/expenses', async (req, res) => {
  try {
    const validatedData = expenseSchema.parse(req.body);
    const db = await getDb();
    
    const now = new Date().toISOString();
    
    const result = await db.run(
      'INSERT INTO expenses (amount, category, description, date, createdAt) VALUES (?, ?, ?, ?, ?)',
      [validatedData.amount, validatedData.category, validatedData.description || '', validatedData.date, now]
    );
    
    const newExpense = await db.get('SELECT * FROM expenses WHERE id = ?', result.lastID);
    res.status(201).json(newExpense);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: (error as any).errors });
    }
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Delete an expense
router.delete('/expenses/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    
    const result = await db.run('DELETE FROM expenses WHERE id = ?', id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

export default router;
