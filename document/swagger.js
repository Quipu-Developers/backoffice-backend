const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");
const PORT = process.env.PORT || 3001;
dotenv.config({path: '../src/.env'}); //process.env
const passportConfig = require("../src/passport");
passportConfig();
const loginRouter = require('../src/routes/login');
const app = express();
const { sequelize } = require('../src/models');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const dataRouter = require("../src/routes/data");

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
            console.log(`swagger: http://localhost:${PORT}/api-docs`);
        });
    })
    .catch(err => {
        console.error('DB 연결 실패:', err);
    });

app.use('/auth', loginRouter);
app.use('/data', dataRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
    console.error(err.stack || err);
    res.status(500).json({
        error: {
            message: 'Internet Server Error'
        }
    })
});
