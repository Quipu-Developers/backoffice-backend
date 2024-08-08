const passport = require('passport');
const bcrypt = require('bcrypt');

exports.login = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
         console.error(authError);
         return next(authError);
        }
        if (!user){
         return res.status(401).send(`${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.status(200).send('로그인 성공');
        })
    })(req, res, next);
}
