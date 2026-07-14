const jwt = require('jsonwebtoken');

const createJWT = ({ payload, expiresIn }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user }, expiresIn: '15m' });
  const refreshTokenJWT = createJWT({
    payload: { user, refreshToken },
    expiresIn: '30d',
  });

  const thirtyDays = 1000 * 60 * 60 * 24 * 30;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + thirtyDays),
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
