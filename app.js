const http = require("http");
const url = require("url");
const queryString = require("querystring");
const express = require("express");
const app = express();
const swig = require("swig");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");

app
.use(express.static(__dirname + "/public"))
.use(favicon(__dirname + '/public/images/favicon.ico')) // use the favicon
.use(bodyParser.json()) // accept JSON dataset
.use(bodyParser.urlencoded({ // accept url params
	extended: true
}));


app.engine("html", swig.renderFile); // set swig to render html files

app.set("view engine", "html");
app.set("views", __dirname + "/views");

var todo = [];

// disable express cache, will use swig cache instead
app.set("view cache", false);


app.get("/", function(req, res) {
	var todo = [{name:"menage", id:1}, {name:"repassage", id: 2}, {name: "sleep", id: 3}];
	res.render("index", {
		title: "SWIG !",
		todo: todo
	});
})

.get("/todo", function(req, res) {
	res.render("index", {
		title: "SWIG !",
		todo: todo
	});
})

.get("/todo/delete/:name", function(req, res) {

	var name = req.params.name;
	var index = todo.indexOf(name);

	console.log("un utilisateur supprime la tâche :", name);

	todo.splice(index, 1);
	
	res.redirect("/todo");
})

.post("/todo/add/", function(req, res) {
	var taskName = req.body.taskName;
	console.log("un utilisateur ajoute la tâche :", taskName);
	todo.push(taskName);
	res.redirect("/todo");
})

// test page with Swig template
.get("/test/:testnum", function(req, res) {
	res.setHeader("Content-Type", "text/plain");
	if (! isNaN(req.params.testnum)) {
    	res.end("Il s'agit du test numero " + req.params.testnum);	
    } else {
    	res.status(400).send("Vous devez indiquer un numéro de test.");
    }
})

// deal with the 404 errors
.use(function(req, res, next) {
	res.setHeader("Content-Type", "text/plain");
	res.status(400).send("Cette page est introuvable.");
});


app.listen(1984);