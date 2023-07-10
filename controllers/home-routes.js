const router = require('express').Router();
const { Blog, Comment, User } = require('../models');
// TODO: Import the custom middleware
const withAuth = require('../utils/auth');

// GET all galleries for homepage
router.get('/', async (req, res) => {
  try {
    const dbBlogData = await Blog.findAll({
      include: [
        {
          model: Comment,
          //attributes: ['filename', 'description'],
        },
        {
          model: User,
        }
      ],
      order: [['createdAt', 'DESC']],      
    });

    const blogs = dbBlogData.map((blog) =>
      blog.get({ plain: true })
    );
    // console.log(blogs);
    res.render('homepage', {
      blogs,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one blog
// TODO: Replace the logic below with the custom middleware
router.get('/blog/:id', withAuth, async (req, res) => {
  // If the user is not logged in, redirect the user to the login page
  /*if (!req.session.loggedIn) {
    res.redirect('/login');
  } else {*/
    // If the user is logged in, allow them to view the gallery
  try {
    const dbBlogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
        },
      ],
    });
    //await console.log(dbBlogData);
    const blog = dbBlogData.get({ plain: true });
    //await console.log("blog");
    await console.log(blog);
    
    // Iterate over each comment and retrieve the username
    //const usernames = blog.comments.map((comment) => comment.user.username);
    //console.log(usernames);


    await console.log(req.session);
    res.render('blog', { blog, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
    //}
  }
});

// Post Blog
router.post('/api/blog/:id', withAuth, async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        username: req.session.username,
      },
    });
    //await console.log(dbUserData);
    //await console.log("id");
    await console.log(dbUserData.id);
    //await console.log(req.params.id);
    //await console.log(req.body.description);
    //await console.log(req.body);

    if (dbUserData.id) {
      try {
        await console.log("here");       
        await console.log(req.body);       
        const dbCommentData = await Comment.create({
          blog_id: req.params.id,
          description: req.body.comment,
          user_id: dbUserData.id
        });
        await console.log("comment");
        await console.log(dbCommentData);
        req.session.save(() => {
          req.session.loggedIn = true;
          req.session.username = req.session.username;
    
          res.status(200).json(dbCommentData);
        });
        //res.redirect('/blog');
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Dashboard
// TODO: Replace the logic below with the custom middleware
router.get('/dashboard', withAuth, async (req, res) => {
  // If the user is not logged in, redirect the user to the login page
  /*if (!req.session.loggedIn) {
    res.redirect('/login');
  } else {*/
  try {
    const dbUserData = await User.findOne({
      where: {
        username: req.session.username,
      },
    });
    //await console.log(dbUserData);
    //await console.log("id");
    await console.log(dbUserData.id);
    //await console.log(req.params.id);
    //await console.log(req.body.description);
    //await console.log(req.body);

    if (dbUserData.id) {
      try {
        const dbBlogData = await Blog.findAll({
          where: {
            user_id: dbUserData.id,
          },
        });
        let blogs ={};
        if (dbBlogData){
          blogs = dbBlogData.map((blog) =>
            blog.get({ plain: true })
          );
          //await console.log("blog");
          await console.log(blogs);
          await console.log(req.session);

        }
        res.render('dashboard', { blogs, loggedIn: req.session.loggedIn });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
        //}
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/dashboard', withAuth, async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        username: req.session.username,
      },
    });
    //await console.log(dbUserData);
    //await console.log("id");
    await console.log(dbUserData.id);
    //await console.log(req.params.id);
    //await console.log(req.body.description);
    //await console.log(req.body);

    if (dbUserData.id) {
      try {
        await console.log("here");       
        await console.log(req.body);       
        const dbBlogData = await Blog.create({
          title: req.body.title,
          description: req.body.description,
          user_id: dbUserData.id
        });
        await console.log("blog");
        await console.log(dbBlogData);
        req.session.save(() => {
          req.session.loggedIn = true;
          req.session.username = req.session.username;
    
          res.status(200).json(dbBlogData);
        });
        //res.redirect('/blog');
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


// GET one gallery
// TODO: Replace the logic below with the custom middleware
router.get('/myblog/:id', withAuth, async (req, res) => {
  // If the user is not logged in, redirect the user to the login page
  /*if (!req.session.loggedIn) {
    res.redirect('/login');
  } else {*/
    // If the user is logged in, allow them to view the gallery
  try {
    const dbBlogData = await Blog.findByPk(req.params.id);
    //await console.log(dbBlogData);
    const blog = dbBlogData.get({ plain: true });
    //await console.log("blog");
    await console.log(blog);
    await console.log(req.session);
    res.render('myblog', { blog, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
    //}
  }
});


// DELETE a reader
router.delete('/myblog/:id', withAuth, async (req, res) => {
  try {
    const dbBlogData = await Blog.destroy({
      where: {
        id: req.params.id,
      },
    });
    //await console.log("delete blog");
    //await console.log(dbBlogData);
    if (!dbBlogData) {
      res.status(404).json({ message: 'No Blog found with that id!' });
      return;
    }
    res.status(200).json(dbBlogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT update a user
router.put('/myblog/:id', withAuth, async (req, res) => {
  try {
    const dbBlogData = await Blog.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!dbBlogData[0]) {
      res.status(404).json({ message: 'No Blog with this id!' });
      return;
    }
    res.status(200).json(dbBlogData);
  } catch (err) {
    res.status(500).json(err);
  }
});






router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

router.get('/signup', (req, res) => {

  res.render('signup');
});

module.exports = router;
