// VARIABLES
const express = require('express')
const slug = require('slug')
const bodyParser = require('body-parser')
const session = require('express-session')

// DATABASE VARIABLES
const mongo = require('mongodb')
const mongoClient = mongo.MongoClient
require('dotenv').config()

let localDB = null
const uri = process.env.DB_URI

mongoClient.connect(uri, { useUnifiedTopology: true }, function(err, clientDB) {
	if (err) {
		console.log('I AM ERROR: ' + err)
	} else {
		localDB = clientDB.db(process.env.DB_NAME)
		console.log(localDB)
		console.log('Connection with database succesfull')
	}
})

var profiles = [
	{
		name: 'Bas',
		age: 22,
		interests: ['nintendo', 'playstation', 'sword art online'],
		location: 'Bleiswijk',
		about: 'Hey, ik ben Bas, vraag maar raak wat je wilt weten over mij'
	},
	{
		name: 'Danie',
		age: 20,
		interests: ['nintendo', 'xbox', 'xenoblade'],
		location: 'Opmeer',
		about: 'Hey, ik ben Danie, vraag maar raak wat je wilt weten over mij'
	},
	{
		name: 'Dennis',
		age: 19,
		interests: ['nintendo', 'apple', 'Zelda', 'Metroid'],
		location: 'Berkel',
		about: 'Hey, ik ben Dennis, vraag maar raak wat je wilt weten over mij'
	},
	{
		name: 'Alex',
		age: 24,
		interests: [
			'nintendo',
			'playstation',
			'Zelda',
			'Metroid',
			'mario kart',
			'marvel',
			'batman'
		],
		location: 'Almere',
		about: 'Hey, ik ben Alex, vraag maar raak wat je wilt weten over mij'
	},
	{
		name: 'Henk',
		age: 22,
		interests: [
			'playstation',
			'cod mw',
			'game of thrones',
			'westworld',
			'black mirror',
			'star trek',
			'doctor who'
		],
		location: 'Almere',
		about: 'Hey, ik ben Henk, vraag maar raak wat je wilt weten over mij'
	},
	{
		name: 'Jan',
		age: 22,
		interests: ['sweetrolls', 'skyrim', 'elder scrolls', 'oblivion', 'witcher'],
		location: 'Almere',
		about:
			'Jan is een simpele man, hij is iemand die veel kan, en koken doet hij, ja ja, met een pan'
	}
]

// const app = express();
express()
	.use('/static', express.static('static')) //Here you link to the folder static. So when /static is called in html, express will use the folder static. You can name the folder whatever you want as long as you change the express.static(foldername).
	.use(bodyParser.urlencoded({ extended: true }))
	.set('view engine', 'ejs')
	.set('views', 'view')
	.post('/', edit2)
	.get('/', home)
	.get('/register', register)
	.get('/about', about)
	.get('/mp3', mp3)
	.get('/profile', profile)
	.get('/profile/:id', profileID)
	.get('/edit', form)
	.get('/list', list)
	.get('/find', find)
	// .get('/test', retrieveData)
	// .get('/test', test)
	.listen(3000)

// Make homepage
function home(req, res) {
	// if (req.session.user) {
	// 	res.render('index', { profiles: profiles })
	// } else {
	// 	res.render('sign-in')
	// }
	res.render('index', { profiles: profiles })
	// res.sendfile(__dirname + '/index.html')
}

// Make registerpage
function register(req, res) {
	res.send('Dit is de registreerpagina')
}

function find(req, res, next) {
	localDB
		.collection('profiles')
		.find()
		.toArray(profilesArray)

	function profilesArray(err, profilesArray) {
		if (err) {
			next(err)
		} else {
			res.render('listOfProfiles', { profiles: profilesArray })
		}
	}
}

// Make an aboutpage
function about(req, res) {
	if (req.url === '/about') {
		res.status(200).send('<h1>hi</h1>')
		res.end('this is my website\n')
	} else {
		res.end('Hello World!\n')
	}
}

// Play sound when accessing /mp3
function mp3(req, res) {
	res.sendfile(__dirname + '/static/audio/waaah.mp3')
	console.log('Why no Wah in smash bros?')
}

function profile(req, res) {
	res.render('profile')
}

function edit(req, res) {
	profiles.push({
		name: req.body.name,
		age: req.body.age,
		interests: req.body.interests,
		location: req.body.location
	})

	res.redirect('/')
}

function edit2(req, res, next) {
	localDB.collection('profiles').insertOne(
		{
			name: req.body.name,
			age: req.body.age,
			interests: req.body.interests,
			location: req.body.location
		},
		insertProfile
	)

	function insertProfile(err, foundData) {
		if (err) {
			next(err)
		} else {
			console.log('trying pushing data...')
			res.redirect('/' + foundData.insertedId)
		}
	}
}

function form(req, res) {
	res.render('edit.ejs', { profiles: profiles })
}

// id Can be generated from everything. For instance, it can be an unique idcode from a database
function profileID(req, res, next) {
	// res.send('Dit profiel heeft het id ' + req.params.id)
	let profileID = req.params.id

	localDB.collection('profiles').findOne(
		{
			_id: mongo.ObjectID(profileID)
		},
		profileIDFound
	)

	function profileIDFound(err, foundProfileID) {
		if (err) {
			next(err)
		} else {
			res.send('Account gevonden en heeft id ' + foundProfileID)
		}
	}
}

function list(req, res) {
	res.render('listOfProfiles.ejs', { profiles: profiles })
}

// app.use(function(req, res){
//   res.status(404).send('<h1>ERRRRROR</h1>')
// })

console.log('localhost:3000')
