const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const colors = require('colors');
const cors = require('cors')
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.AUTH_PORT || 4000;
const cookieParser = require('cookie-parser');
const User = require('./models/user');

app.use(cors({ origin:true,credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

//is it needed ?
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    } else {
        next();
    }
});

mongoose.connect(
    process.env.dbURI,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
);

//  db connection
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('>> Authentification Server Connected to Database'.magenta.bold));

app.listen(
    PORT,
    console.log(`Auth Server is running on ${process.env.NODE_ENV} MODE on port ${PORT}`.red.bold)
);

// used for refreshing auth token
app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    
    if (refreshToken === null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.send(403);
        const accessToken = generateAccessToken({ emailAddress: user.emailAddress  });
        res.json({ accessToken:  accessToken});
    });
});

app.delete('/logout', (req, res) => {
    res.clearCookie("accessToken");
    res.sendStatus(204); 
});

app.post('/login', async(req, res) => {
    try {
        user = await User.findOne({ emailAddress: req.body.emailAddress })
        if (user === null) {
            return res.status(404).json({ message: 'User does not exist!' });
        } else {
            if (isEqual(user, req.body)) {
                const userObjToBePassed = {
                    userId: user._id,
                    companyType: user.companyType,
                    companyProfileCreated: user.companyProfileCreated
                }
    
                const accessToken = generateAccessToken(userObjToBePassed);
       
                res.cookie("accessToken", accessToken, { httpOnly: true, secure: false });
                res.json(userObjToBePassed);
            } else {
                res.status(401).send("Bad email address or password");
            }
        }

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
}

function isEqual(user, userToVerify) {
    return user.password === userToVerify.password;
}