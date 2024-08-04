exports.localStrategy = (password, done) => {
    const ADMIN_PASSWORDS = [
        process.env.PASSWORD1,
        process.env.PASSWORD2,
        process.env.PASSWORD3,
        process.env.PASSWORD4,
        process.env.PASSWORD5,
    ];

    if (ADMIN_PASSWORDS.includes(password)){
        return done(null, {username: 'admin'});
    } else {
        return done(null, false, {message: 'Incorrect password'});
    }
};