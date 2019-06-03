const postQueries = require("../db/queries.posts.js");
const Authorizer = require("../policies/post");

module.exports = {
  new(req, res, next) {
    const authorized = new Authorizer(req.user).new();
    if (authorized) {
      res.render("posts/new");
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/posts");
    }
  },
  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();
    if (authorized) {
      let newPost = {
        title: req.body.title,
        body: req.body.body,
        topicId: req.params.topicId,
        userId: req.user.id
      };
      postQueries.addPost(newPost)
      .then(post =>  res.redirect(303, `/topics/${newPost.topicId}/posts/${post.id}` ))
      .catch(err => res.redirect(500, "posts/new"));
      //, (err, post) => {
        // if (err) {
        //   res.redirect(500, "posts/new");
        // } else {
        //   res.redirect(303, `/topics/${newPost.topicId}/posts/${post.id}`);
        // }
      // });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/posts");
    }
  },
  show(req, res, next) {
    postQueries.getPost(req.params.id, (err, post) => {
      if (err || post == null) {
        res.redirect(404, "/");
      } else {
        res.render("posts/show", {
          post
        });
      }
    });
  },
  destroy(req, res, next) {
    postQueries.deletePost(req, (err, post) => {
      if (err) {
        console.log(err);
        res.redirect(err, `/posts/${req.params.id}`)
      } else {
        res.redirect(303, "/posts")
      }
    });
  },
  edit(req, res, next) {
    postQueries.getPost(req.params.id, (err, post) => {
      if (err || post == null) {
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, post).edit();
        if (authorized) {
          res.render("posts/edit", {
            post
          });
        } else {
          req.flash("You are not authorized to do that.")
          res.redirect(`/posts/${req.params.id}`)
        }
      }
    });
  },
  update(req, res, next) {
    postQueries.updatePost(req, req.body, (err, post) => {
      if (err || post == null) {
        res.redirect(401, `/posts/${req.params.id}/edit`);
      } else {
        res.redirect(`/posts/${req.params.id}`);
      }
    });
  }
}