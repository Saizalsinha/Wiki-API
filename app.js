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

app.get("/", function(req, res) {
  res.send("Hello");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
