function rejectIfNotAuthorized(req, res, next) {
  if (res.locals.user) {
    next();
  } else {
    res.status(403).json({ message: 'У вас нет доступа' });
  }
}

module.exports = rejectIfNotAuthorized;
