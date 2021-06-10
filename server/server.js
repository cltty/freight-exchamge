const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors')
const morgan = require('morgan');
const config = require('./config/config.js'); // needed anymore?
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // needed anymore?

const vatCheck = require('./routes/vatCheck');
const insuranceDocs = require('./routes/insuranceDocs');
const operatingLicense = require('./routes/operatingLicense');

const authenticateToken = require('./utils/authMiddleware');

const app = express();
const PORT = config.PORT || 3000;

app.use(cors({ origin:true, credentials: true }));

app.use(cookieParser());
app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use(morgan('tiny'));
app.use(vatCheck);
app.use(insuranceDocs);
app.use(operatingLicense);

//handling users related requests
const usersRouter = require('./routes/users');

//handling company (shipper/carrier) related requests
const companiesRouter = require('./routes/companies');

// retrieving cities from IP Geo Location API
const citiesRouter = require('./routes/cities');

// handling loads related requests
const loadsRouter = require('./routes/loads');

// handling notifications related requests
const notificationsRouter = require('./routes/notifications');

// handling reports related requests
const reportsRouter = require('./routes/reports');

// handling sms notifications
const smsRouter = require('./routes/sms');

app.use('/users', usersRouter);
app.use('/companies', authenticateToken, companiesRouter);
app.use('/loads', loadsRouter);
app.use('/notifications',  notificationsRouter);
app.use('/reports', reportsRouter);
app.use('/sms', smsRouter);

// app.use('/cities', citiesRouter);

//  db connection
mongoose.connect(
    config.dbURI,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
);

//  db connection
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('>> Main Server Connected to Database'.magenta.bold));

app.listen(
    PORT,
    console.log(`Server is running on ${config.NODE_ENV} MODE on port ${PORT}`.yellow.bold)
);