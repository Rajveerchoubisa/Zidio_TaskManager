import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ msg: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};