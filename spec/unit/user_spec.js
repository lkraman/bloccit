const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("User", () => {

  beforeEach((done) => {
      this.topic;
      this.post;
      this.user;

      sequelize.sync({force: true}).then((res) => {

 // #2
        User.create({
          email: "starman@tesla.com",
          password: "Trekkie4lyfe"
        })
        .then((user) => {
          this.user = user; //store the user

 // #3
          Topic.create({
            title: "Expeditions to Alpha Centauri",
            description: "A compilation of reports from recent visits to the star system.",

 // #4
            posts: [{
              title: "My first visit to Proxima Centauri b",
              body: "I saw some rocks.",
              userId: this.user.id
            }]
          }, {

 // #5
            include: {
              model: Post,
              as: "posts"
            }
          })
          .then((topic) => {
            this.topic = topic; //store the topic
            this.post = topic.posts[0]; //store the post
            done();
          })
        })
      });
    });

    it("should not create a user with invalid email or password", (done) => {
      User.create({
        email: "It's-a me, Mario!",
        password: "1234567890"
      })
      .then((user) => {
        // The code in this block will not be evaluated since the validation error
        // will skip it. Instead, we'll catch the error in the catch block below
        // and set the expectations there.
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Validation error: must be a valid email");
        done();
      });
    });

    it("should not create a user with an email already taken", (done) => {
      User.create({
        email: "user@example.com",
        password: "1234567890"
      })
      .then((user) => {
        User.create({
          email: "user@example.com",
          password: "nananananananananananananananana BATMAN!"
        })
        .then((user) => {
          // the code in this block will not be evaluated since the validation error
          // will skip it. Instead, we'll catch the error in the catch block below
          // and set the expectations there
          done();
        })
        .catch((err) => {
          expect(err.message).toContain("Validation error: A user with this e-mail address already exists");
          done();
        });
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
