const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ status: 'error', message: 'Server configuration error' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Authentication required' });
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
};

exports.requireAdmin = (req, res, next) => {
  exports.requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Admin access required' });
    }
    next();
  });
};
