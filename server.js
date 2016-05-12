const http = require("http");
const express = require("express");
const swig = require("swig");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const app = module.exports.app = express();
const server = http.createServer(app);
const io = require("socket.io").listen(server);

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

var todo = []; // global array

// disable express cache, we'll use swig cache instead
app.set("view cache", false);


app.get("/", function(req, res) {
	res.render("index", {
		title: "SWIG !"
	});
})

.get("/chat", function(req, res) {
	res.render("chat", {
		title: "SWIG !"
	});
})

.get("/todo", function(req, res) {
	res.render("todo", {
		title: "SWIG !",
		todo: todo
	});
})

.get("/todo/delete/:name", function(req, res) {
	var name = req.params.name;
	var index = todo.indexOf(name);
	
	todo.splice(index, 1);
	console.log("un utilisateur supprime la tâche :", name);
	res.redirect("/todo");
})

.post("/todo/add/", function(req, res) {
	var taskName = req.body.taskName.trim(); // trim to avoid white spaces
	if (taskName !== "") {
		console.log("un utilisateur ajoute la tâche :", taskName);
		todo.push(taskName);
	} else {
		console.log("Un utilisateur a tenté d'ajouter une tâche vide.");
	}
	res.redirect("/todo");
})

// deal with the 404 errors
.use(function(req, res, next) {
	res.setHeader("Content-Type", "text/plain");
	res.status(400).send("Cette page est introuvable.");
});

// // Chargement de socket.io
// var io = require('socket.io').listen(app);

// Quand un client se connecte, on le note dans la console
io.on('connection', function (socket) {
    console.log('Un client est connecté !');
});

app.listen(1984); // go to http://localhost:1984/