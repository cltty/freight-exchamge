const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors')
const morgan = require('morgan');
const config = require('./config/config.js');

const signupRouter = require('./routes/signup');
const userRouter = require('./routes/user');
const carrierRouter = require('./routes/carrier');
const shipperRouter = require('./routes/shipper');


const app = express();
const PORT = config.PORT || 3000;

dotenv.config({ path: './config/config.env' });

app.use(cors());
app.use(morgan('tiny'));
app.use(userRouter);
app.use(carrierRouter);
app.use(shipperRouter);
app.use(signupRouter);

app.listen(
    PORT,
    console.log(`Server is running on ${config.NODE_ENV} MODE on port ${PORT}`.yellow.bold)
);


