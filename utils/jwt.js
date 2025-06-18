const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

exports.generateToken = (user) => {
  return jwt.sign(
    { userId: user.userId, email: user.email, nickname: user.nickname },
    SECRET,
    { expiresIn: '7d' }
  );
};

exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET);
}; 