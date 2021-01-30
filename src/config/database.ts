if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

export default {
  url: process.env.DATABASE_URL,
};
