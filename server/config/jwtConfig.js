const jwtConfig = {
  access: {
    type: 'access',
    expiresIn: `${1000 * 60 * 20}`,
  },
  refresh: {
    type: 'refresh',
    expiresIn: `${1000 * 60 * 60 * 30}`,
  },
};

module.exports = jwtConfig;
