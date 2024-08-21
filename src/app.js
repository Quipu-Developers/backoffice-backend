const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");
const PORT = process.env.PORT || 3002;
dotenv.config({path: '../.env'});
//dotenv.config({path: '../.env'}); //process.env
const passportConfig = require("../src/passport");
passportConfig();
const cors = require("cors");
const loginRouter = require('../src/routes/login');
const dataRouter = require("../src/routes/data");
const app = express();
const { sequelize } = require('../src/models');

//cors
app.use(cors({
    origin: 'http://localhost:3000', // 클라이언트의 Origin
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true, // 쿠키를 포함한 요청을 허용}));
}));
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


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
        // 주기적으로 DB 연결 상태 유지
        setInterval(() => {
            sequelize.query('SELECT 1')
                .then(() => {
                    console.log('SELECT 1 query executed successfully');
                })
                .catch(err => {
                    console.error('Error executing SELECT 1 query:', err);
                });
        }, 3600000); // 1시간(밀리초 단위)
        app.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('DB 연결 실패:', err);
    });

app.use('/bo/auth', loginRouter);
app.use('/bo/data', dataRouter);

app.use((err, req, res, next) => {
    console.error(err.stack || err);
    res.status(500).json({
        error: {
            message: 'Internet Server Error'
        }
    })
});
