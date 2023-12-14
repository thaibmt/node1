module.exports = (req, res, next) => {
  if (req.session.role === 'admin') {
    return next();
  }
  req.session.error = "Bạn không có quyền admin!";
  res.redirect("back");
};
