const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

module.exports = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV,
    dbURI: process.env.dbURI
};