import db from '../database/connection.js';

export const getGoals = async (req, res) => {
  try {
    const { status } = req.query;

    let query = 'SELECT * FROM goals WHERE user_id = $1';
    const params = [req.userId];

    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
};

export const createGoal = async (req, res) => {
  try {
    const { title, description, category, targetValue, unit, targetDate, priority } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category required' });
    }

    const result = await db.query(
      'INSERT INTO goals (user_id, title, description, category, target_value, unit, target_date, priority) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [req.userId, title, description, category, targetValue, unit, targetDate, priority || 'medium']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, targetValue, currentValue, status, priority } = req.body;

    const result = await db.query(
      'UPDATE goals SET title = $1, description = $2, target_value = $3, current_value = $4, status = $5, priority = $6 WHERE id = $7 AND user_id = $8 RETURNING *',
      [title, description, targetValue, currentValue, status, priority, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
};
