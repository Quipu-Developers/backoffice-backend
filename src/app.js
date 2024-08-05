const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");
const PORT = process.env.PORT || 3001;
dotenv.config(); //process.env
const passportConfig = require("./passport");
passportConfig();
const loginRouter = require('./routes/login');
const app = express();
const { sequelize } = require('./models');
app.use(morgan("dev"));
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
        //return sequelize.sync({ });
    })
    .then(() => {
        console.log('DB 동기화');
        app.listen(PORT, () => {
            console.log(`port:${PORT}`)
            //console.log(`swagger: http://localhost:${PORT}/api-docs`);
            console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);

        });
    })
    .catch(err => {
        console.error('DB 연결 실패:', err);
    });

app.use('/login', loginRouter);
app.use((err, req, res, next) => {
    console.error(err.stack || err);
    res.status(500).json({
        error: {
            message: 'Internet Server Error'
        }
    })
});
