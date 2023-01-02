const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1/wikiDB', {
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to mongo!");
  })
  .catch((err) => {
    console.log("Oh no! mongo connection error");
    console.log(err);
  })

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Article = mongoose.model("Article", articleSchema);

//////////////     Request targetting all articles     ///////////////////

app.route('/articles')
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (!err) res.send("Successfully added new Article");
      else res.send(err);
    })
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) res.send("Successfully deleted all articles");
      else res.send(err);
    });
  });

//////////////     Request targetting specific articles     ///////////////////

app.route("/articles/:articleName")

  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleName
    }, function(err, foundArticle) {
      if (foundArticle) res.send(foundArticle);
      else res.send("No article found with the input title!")
    });
  })

  .put(function(req, res) {
    Article.findOneAndUpdate({
        title: req.params.articleName
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function(err) {
        if (!err) res.send("Successfully updated the article!");
      }
    );
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
