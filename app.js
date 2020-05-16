// let eft = require('camelCase');
// let answer = eft("ik-mis-de-efteling")
// console.log(answer);

// code without express
// var http = require("http");
// http.createServer(onrequest).listen(8000);
// function onrequest(req, res){
//   res.statusCode=200
//   res.setHeader("Content-Type", "text/html")
//   res.end("Hello World!\n")
// }

const express = require("express");
const app = express();

var profiles = [
  {
    name: 'Bas',
    age: 22,
    interests: ['nintendo', 'playstation', 'sword art online'],
    location: 'Bleiswijk'
  },
  {
    name: 'Danie',
    age: 20,
    interests: ['nintendo', 'xbox', 'xenoblade'],
    location: 'Opmeer'
  }
]

// Link the static files
// app.use("/static", express.static("public"));
app.use("/static", express.static("static")); //Here you link to the folder static. So when /static is called in html, express will use the folder static. You can name the folder whatever you want as long as you change the express.static(foldername).

// Make homepage
app.get("/", function(req, res){
  // res.send("Dit is de hoofdpagina");
  res.sendfile(__dirname + "/index.html");
});

// Make registerpage
app.get("/register", function(req, res){
  res.send("Dit is de registreerpagina");
});

// do something at specific routes
app.get("/about", function(req, res){
  if (req.url === '/about'){
    res.status(200).send('<h1>hi</h1>')
    res.end("this is my website\n");
  }
  else{
    res.end('Hello World!\n')
  }
});

app.get("/mp3", function(req, res){
  res.sendfile(__dirname + "/static/audio/waaah.mp3");
  console.log("Why no Wah in smash bros?");
});

// id Can be generated from everything. For instance, it can be an unique idcode from a database
app.get("/profile/:id", function(req, res){
  res.send("Dit profiel heeft het id " + req.params.id);
});

app.use(function(req, res){
  res.status(404).send('<h1>ERRRRROR</h1>')
})

app.listen(3000);

console.log("localhost:3000");
