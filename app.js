const express = require("express");

const bodyParser = require("body-parser");

const _ = require("lodash");

const ejs = require("ejs");

const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true })); app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

///////////////////// Requests Targeting all Articles /////////////////

app.route('/articles')

.get(function (req,res) {
  Article.find({},function (err, foundArticles) {
    if(!err){
      res.send(foundArticles);
    }
    else{
      res.send(err);
    }
  });
})

.post(function (req, res) {
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title: req.body.title,
    content:req.body.content
  });
})
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if(!err){
        res.send('Successfully deleted all articles.');
      }
      else {
        res.send(err);
      }
    });
  })

  ///////////////////// Requests Targeting all Specific Articles /////////////////

app.route('/articles/:articleTitle')


.get(function (req, res) {

  Article.findOne({title: req.params.articleTitle},function (err, foundArticle) {
    if(foundArticle){
      res.send(foundArticle);
    }
    else {
      res.send('No Article of name ' + req.params.articleTitle + ' found.')
    }
  })
});


app.put( '/articles/:articleTitle',function(req, res){ //cuz .put alone not working
 Article.findOneAndUpdate(
  {title: req.params.articleTitle},
  {$set:{title: req.body.title, content: req.body.content}},
  {new: true},
  function(err, article){
   if(err){
    res.send(err);
   } else {
    res.send(article);
   }
  }
 );
});
app.patch('/articles/:articleTitle', function (req, res) {
  Article.findOneAndUpdate(
    {title: req.params.articleTitle},
    {$set:req.body},
    function (err) {
      if(!err){
        res.send('Successfully updated article.')
      }
      else {
        res.send(err);
      }
    }
  )
});

app.delete( '/articles/:articleTitle' ,function (req, res) {
Article.deleteOne(
  {title: req.params.articleTitle},
  function (err) {
    if(!err){
      res.send('Successfully Deleted '+ req.params.articleTitle + ' .')
    }
  }
)
});


app.listen(3000, function() { console.log("Server started on port 3000"); });
