exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()){ //passport를 통해 로그인 했는지
      next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){ //passport를 통해 로그인 안했는지
        next();
    } else {
        const message = encodeURI('로그인한 상태');
        res.redirect(`/?error=${message}`); //localhost:3001?error=메시지
        //res.status(403).send('이미 로그인 했음');
    }
};