/* Importing the mongoose module. */
const mongoose = require("mongoose");
/* Importing the express module. */
const express = require("express");
/* A middleware that parses the body of the request. */
const bodyParser = require("body-parser");
/* Importing the ejs module. */
const ejs = require("ejs");

/* Creating an instance of the express module. */
const app = express();

/* Setting the view engine to ejs. */
app.set("view engine", "ejs");

/* A middleware that parses the body of the request. */
app.use(bodyParser.urlencoded({ extended: true }));
/* Telling the server to use the public folder as a static folder. */
app.use(express.static("public"));

/* Connecting to the database. */
mongoose.connect("mongodb://localhost:27017/wikiDB");

/* Creating a new schema for the articles collection. */
const articleShema = new mongoose.Schema({
  title: String,
  content: String,
});

/* Creating a new model for the articles collection. */
const Article = mongoose.model("Article", articleShema);

//////////////////////////////REQUESTS TARGETING ARTICLES//////////////////
app
  .route("/articles")

  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      // console.log(foundArticles);
      if (!err) {
        res.send(foundArticles);
      } else {
        console.log(err);
      }
    });
  })

  /* This is a post request that is used to add a new article to the database. */

  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send(err);
      }
    });
  })

  /* Deleting all the articles in the database. */
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("All articles have been deleted successfully!!");
      } else res.send(err);
    });
  });

//////////////////////////////REQUESTS TARGETING ARTICLES//////////////////
//////////////////////////////REQUESTS TARGETING SPECIFIC ARTICLES//////////////////
/* A chainable route handler that is used to chain multiple route handlers for a route path. */

app
  .route("/articles/:articleTitle")

  /* A get request that is used to get a specific article from the database. */
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          console.log("No article found matching the title");
        }
      }
    );
  })
  /* Updating the article with the title that is passed in the url. */
  .put(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Successfuly updated the document");
        } else {
          res.send(err);
        }
      }
    );
  })
  /* Updating the article with the title that is passed in the url. */
  .patch(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfuly updated the document");
        } else {
          res.send(err);
        }
      }
    );
  })

  /* Deleting the article with the title that is passed in the url. */
  .delete(function (req, res) {
    Article.findOneAndDelete(
      { title: req.params.articleTitle },
      function (err) {
        if (!err) {
          res.send("Successfuly deleted the article");
        } else {
          res.send(err);
        }
      }
    );
  });

/* Telling the server to listen on port 3000. */
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
