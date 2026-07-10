import db from '../database/connection.js';

export const getHealthData = async (req, res) => {
  try {
    const { metricType, days = 30 } = req.query;

    let query = 'SELECT * FROM health_data WHERE user_id = $1 AND recorded_at > NOW() - INTERVAL \'$2 days\'';
    const params = [req.userId, days];

    if (metricType) {
      query += ' AND metric_type = $3';
      params.push(metricType);
    }

    query += ' ORDER BY recorded_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get health data error:', error);
    res.status(500).json({ error: 'Failed to fetch health data' });
  }
};

export const recordHealth = async (req, res) => {
  try {
    const { metricType, value, unit, notes } = req.body;

    if (!metricType || value === undefined) {
      return res.status(400).json({ error: 'Metric type and value required' });
    }

    const result = await db.query(
      'INSERT INTO health_data (user_id, metric_type, value, unit, recorded_at, notes) VALUES ($1, $2, $3, $4, NOW(), $5) RETURNING *',
      [req.userId, metricType, value, unit, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Record health error:', error);
    res.status(500).json({ error: 'Failed to record health data' });
  }
};
