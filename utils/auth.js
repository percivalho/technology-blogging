const withAuth = (req, res, next) => {
  // TODO: If the user is not logged in, redirect the user to the login page
  // TODO: If the user is logged in, allow them to view the paintings
  (!req.session.loggedIn) ? res.redirect('/login') : next();
};

module.exports = withAuth;
