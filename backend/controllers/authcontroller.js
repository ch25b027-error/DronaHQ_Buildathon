const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "I-Like-JS";

const ADMIN_USER = 'admin@gmail.com';
const ADMIN_PASS = 'admin123';

const login = (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};

module.exports = { login };