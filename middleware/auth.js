module.exports = (req, res, next) => {
  if (req.session.isAuth) {
    return next();
  }
  req.session.error = "Bạn chưa đăng nhập!";
  res.redirect("/login");
};
