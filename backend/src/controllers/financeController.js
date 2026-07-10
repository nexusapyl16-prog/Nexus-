import db from '../database/connection.js';

export const getTransactions = async (req, res) => {
  try {
    const { category, month } = req.query;

    let query = 'SELECT * FROM transactions WHERE user_id = $1';
    const params = [req.userId];

    if (category) {
      query += ' AND category = $2';
      params.push(category);
    }

    if (month) {
      query += ` AND DATE_TRUNC('month', transaction_date) = $${params.length + 1}::date`;
      params.push(month);
    }

    query += ' ORDER BY transaction_date DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const addTransaction = async (req, res) => {
  try {
    const { category, amount, type, description, transaction_date } = req.body;

    if (!category || !amount || !type) {
      return res.status(400).json({ error: 'Category, amount, and type required' });
    }

    const result = await db.query(
      'INSERT INTO transactions (user_id, category, amount, type, description, transaction_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.userId, category, amount, type, description, transaction_date || new Date()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
};

export const getStats = async (req, res) => {
  try {
    const { month } = req.query;

    let dateFilter = 'DATE_TRUNC(\'month\', transaction_date) = DATE_TRUNC(\'month\', NOW())';
    if (month) {
      dateFilter = `DATE_TRUNC('month', transaction_date) = '${month}'::date`;
    }

    const result = await db.query(`
      SELECT
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
        COUNT(*) as transaction_count
      FROM transactions
      WHERE user_id = $1 AND ${dateFilter}
    `, [req.userId]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};
