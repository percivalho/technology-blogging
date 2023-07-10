const router = require('express').Router();
const { User } = require('../../models');
const withAuth = require('../../utils/auth');

// CREATE new user
router.post('/signup', async (req, res) => {
  try {

    await console.log(req.body);  
    const dbUserData = await User.create({
      username: req.body.username,
      //email: req.body.email,
      password: req.body.password,
    });
    console.log(dbUserData)
    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.username = req.body.username;

      //res.status(200).json(dbUserData);
      res.redirect('/');        

    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!dbUserData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.username = req.body.username;
      //withAuth();

      /*res
        .status(200)
        .json({ user: dbUserData, message: 'You are now logged in!' });*/
      res.redirect('/');        
      console.log({loggedIn:req.session.loggedIn })
      //res.render('/', { loggedIn: req.session.loggedIn });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Logout
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
