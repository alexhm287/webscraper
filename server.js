var express = require('express')
var bodyParser = require('body-parser')
var exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const cheerio = require('cheerio')
var request = require('request');
var db = require("./models");

var app = express()
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = "mongodb://heroku_s70s84l6:ddflin5t58joatogtk8s7drndh@ds123171.mlab.com:23171/heroku_s70s84l6";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//require("./app/routing/apiRoutes")(app);
//require("./app/routing/htmlRoutes")(app); 

const path = require('path');

var databaseUrl = "scraper";
var collections = ["scrapedData"];


// ===============================================================================
// ROUTING
// ===============================================================================
app.get("/", function(req, res) {
	res.render("../index", {results: [],
	                        articleCount: 0});
});

app.get("/remove", function(req, res) {
	var results = [];
	db.Article.remove({}, function(err){			
	});
	res.send("remove complete");
});

app.get("/scrape", function(req, res) {
	var results = [];
	request("http://ronaldo.com/", function(error, response, html) {
	  var $ = cheerio.load(html);
	  $(".entry-title").each(function(i, element) {
		    var linkNode = $("a", element);
		    var link = linkNode.attr("href");
		    var title = linkNode.text(); 

		    var result = {link: link, title: title, index: i};
		    if (link && title) {
		    	results.push(result);
		    	/*
		    	 db.Article.create(result)
			        .then(function(dbArticle) {
			          // View the added result in the console
			          console.log(dbArticle);
			        })
			        .catch(function(err) {
			          // If an error occurred, send it to the client
			          return res.json(err);
			        });
			     */
      		}
		});  
	  	var hbsObject = {
	  		results: results, 
	    	articleCount: results.length
	    };
	  	res.render("../index", hbsObject);
	  });	   	

});

app.post("/savenote", function(req, res) {
	console.log(req.body);
	var articleId = req.body.articleId;
	var body = req.body.body;
	var title = req.body.title;
	var result = {
		body: body,
		title: title,
		article: articleId
	}

	 db.Note.create(result)
    .then(function(dbNote) {
      // View the added result in the console
      console.log(dbNote);
      res.send("save note complete");
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      return res.json(err);
    });
});

app.post("/deletenote", function(req, res) {
	console.log(req.body);
	var noteId = req.body.noteId;
	var result = {
		_id: noteId
	}

	 db.Note.remove(result)
    .then(function() {
      res.send("delete note complete");
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      return res.json(err);
    });
});

app.post("/save", function(req, res) {
	console.log(req.body);
	var link = req.body.link;
	var title = req.body.title;
	var result = {
		title: title,
		link: link
	}

	 db.Article.create(result)
    .then(function(dbArticle) {
      // View the added result in the console
      console.log(dbArticle);
      res.send("save article complete");
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      return res.json(err);
    });
});

app.post("/delete", function(req, res) {
	console.log(req.body);
	var link = req.body.link;
	var title = req.body.title;
	var result = {
		title: title,
		link: link
	}

	 db.Article.remove(result)
    .then(function(dbArticle) {
      // View the added result in the console
      console.log(dbArticle);
      res.send("delete article complete");
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      return res.json(err);
    });
});

app.get("/notes/:id", function(req, res) {
	console.log("Article id: " + req.params.id);
	
	db.Note.find({article: req.params.id})
    .then(function(dbNotes) {
      console.log("Found number of notes: " + dbNotes.length);
      var hbsObject = {
      	article_id: req.params.id,
	    notes: dbNotes
	  };
	  res.render("../articleNotes", hbsObject);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      console.log("Found number of articles: " + dbArticle.length);
      var hbsObject = {
	    	results: dbArticle, 
	    	articleCount: dbArticle.length
	    };
	  	res.render("../savedArticles", hbsObject);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

 
app.listen(3000)


