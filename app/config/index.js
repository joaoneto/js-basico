const { MONGO_DB, NODE_ENV } = process.env;

const config = {
  development: {
    database: 'mongodb://localhost:27017/js-basico'
  },

  production: {
    database: MONGO_DB
  }
};

module.exports = config[NODE_ENV || 'development'];
