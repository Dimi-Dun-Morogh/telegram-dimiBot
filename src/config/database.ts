if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}
console.log(process.env.DATABASE_URL);
export default {
  url: process.env.DATABASE_URL,
};
