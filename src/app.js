const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");
const PORT = process.env.PORT || 3001;
dotenv.config({path: '../.env'});
//dotenv.config({path: '../.env'}); //process.env
const passportConfig = require("../src/passport");
passportConfig();
const loginRouter = require('../src/routes/login');
const app = express();
const { sequelize } = require('../src/models');
const dataRouter = require("../src/routes/data");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cors
app.options((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://quipu.uos.ac.kr');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // preflight 요청에 대한 응답
    }
    next();
});

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false, //개발 시에만 false로(http, https 모두 가능)
    }
}));
app.use(passport.initialize()); // req.user, req.login, req.isAuthenticate, req.logout
app.use(passport.session()); //connect.id라는 이름으로 세션 쿠키가 브라우져로 전송


sequelize.authenticate()
    .then(() => {
        console.log('DB 연결');
        return sequelize.sync({});
    })
    .then(() => {
        console.log('DB 동기화');
        app.listen(PORT, () => {
            console.log(process.env.COOKIE_SECRET);
            console.log(`http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('DB 연결 실패:', err);
    });

app.use('/auth', loginRouter);
app.use('/data', dataRouter);

app.use((err, req, res, next) => {
    console.error(err.stack || err);
    res.status(500).json({
        error: {
            message: 'Internet Server Error'
        }
    })
});
