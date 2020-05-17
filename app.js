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

// VARIABLES
const express = require('express')

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

var testVar = 'ding'

// const app = express();
express()
  .use('/static', express.static('static')) //Here you link to the folder static. So when /static is called in html, express will use the folder static. You can name the folder whatever you want as long as you change the express.static(foldername).
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', home)
  .get('/register', register)
  .get('/about', about)
  .get('/mp3', mp3)
  .get('/profile', profile )
  .get('/profile/:id', profileID)
  .listen(3000)

// Make homepage
function home(req, res){
  res.render('test', {profiles: profiles})
  // res.sendfile(__dirname + '/index.html')
}

// Make registerpage
function register(req, res){
  res.send('Dit is de registreerpagina');
}

// Make an aboutpage
function about(req, res){
  if (req.url === '/about'){
    res.status(200).send('<h1>hi</h1>')
    res.end('this is my website\n')
  }
  else{
    res.end('Hello World!\n')
  }
}

// Play sound when accessing /mp3
function mp3(req, res){
  res.sendfile(__dirname + '/static/audio/waaah.mp3')
  console.log('Why no Wah in smash bros?')
}

function profile(req, res){
  res.render('profile')
}

// id Can be generated from everything. For instance, it can be an unique idcode from a database
function profileID(req, res){
  res.send('Dit profiel heeft het id ' + req.params.id)
}

// app.use(function(req, res){
//   res.status(404).send('<h1>ERRRRROR</h1>')
// })

console.log('localhost:3000');
