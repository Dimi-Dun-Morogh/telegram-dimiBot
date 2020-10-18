if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = {
  url: process.env.DATABASE_URL,
};
