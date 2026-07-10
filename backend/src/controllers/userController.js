import db from '../database/connection.js';

export const getProfile = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT u.id, u.email, u.first_name, u.last_name, u.avatar_url, up.bio, up.phone FROM users u LEFT JOIN user_profiles up ON u.id = up.user_id WHERE u.id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, phone, avatar_url } = req.body;

    const result = await db.query(
      'UPDATE users SET first_name = $1, last_name = $2, avatar_url = $3 WHERE id = $4 RETURNING id, email, first_name, last_name, avatar_url',
      [firstName, lastName, avatar_url, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (bio || phone) {
      await db.query(
        'UPDATE user_profiles SET bio = $1, phone = $2 WHERE user_id = $3',
        [bio, phone, req.userId]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
