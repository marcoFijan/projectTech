// REQUIRE VARIABLES
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

// MAKE THE CONNECTION WITH DATABASE
mongoClient.connect(uri, { useUnifiedTopology: true }, function(err, clientDB) {
	if (err) {
		console.log('I AM ERROR: ' + err)
	} else {
		localDB = clientDB.db(process.env.DB_NAME)
		console.log('Connection with database succesfull')
	}
})

// LOCAL VARIABLES
let allProfiles //LIST OF ALL PROFILES FROM THE DATABASE
let currentUser //OBJECT OF CURRENT USER / SESSION
let profiles //LIST OF PROFILES EXCLUDING THE CURRENT USER
let sameInterestProfilesUnsorted = [] //LIST OF PROFILES WITH THE SAME INTERESTS WITH DOUBLE PROFILES
let sameInterestProfiles //LIST OF PROFILES WITH THE SAME INTERESTS

express()
	.use(bodyParser.urlencoded({ extended: true }))
	.use(
		session({
			secret: 'secret-key',
			resave: false,
			saveUninitialized: false,
			name: null
		})
	)
	.use('/static', express.static('static')) //Here you link to the folder static. So when /static is called in html, express will use the folder static. You can name the folder whatever you want as long as you change the express.static(foldername).
	.set('view engine', 'ejs')
	.set('views', 'view')
	.post('/edit', edit2)
	.post('/', sessionProfile)
	.get('/', home)
	.get('/register', register)
	.get('/about', about)
	.get('/mp3', mp3)
	.get('/profile/:id', profileID)
	.get('/edit', form)
	.get('/list', list)
	.get('/find', find)
	.use(notFound)
	.listen(3000)

// CATCH SESSIONSTATE AT HOMEPAGE
function home(req, res) {
	// GO TO HOMEPAGE WHEN SESSION FOUND
	if (req.session.username) {
		console.log(profiles)
		res.render('index', { profiles: profiles, currentUser: req.session })
	} // GO TO SIGN-IN PAGE WHEN NO USER/SESSION FOUND
	else {
		res.render('sign-in')
	}
}

function sessionProfile(req, res) {
	// SAVE ALL PROFILES FROM DATABASE IN AN ARRAY
	profilesToArray().then(profilesArray => {
		allProfiles = profilesArray
		console.log(allProfiles)
		let sessionUser = req.body.sessionProfiles
		allProfiles.forEach((profile, i) => {
			if (profile.name === sessionUser) {
				console.log(sessionUser + ': im in!')
				req.session.username = profile.name
				req.session.age = profile.age
				req.session.gender = profile.gender
				req.session.interests = profile.interests
				req.session.location = profile.location
				req.session.about = profile.about
				currentUser = req.session
				profiles = allProfiles
				profiles.splice(i, 1)
				// console.log('currentUser ' + currentUser.name)
			}
			// else{
			//   console.log('Profile not found. Redirecting.....')
			//   res.redirect('/')
			// }
		})
		console.log(currentUser.interests)
		currentUser.interests.forEach((interestCurUser, i) => {
			profiles.forEach((profile, j) => {
				profile.interests.forEach((interestProfile, k) => {
					if (interestCurUser === interestProfile) {
						console.log(
							'found common interest: ' +
								interestCurUser +
								'from profile ' +
								profile.name
						)
						sameInterestProfilesUnsorted.push(profile)
					}
				})
			})
		})
		// SOURCE: https://stackoverflow.com/questions/38206915/filter-out-array-to-have-only-unique-values
		sameInterestProfiles = sameInterestProfilesUnsorted.filter(function(
			profile,
			l
		) {
			return sameInterestProfilesUnsorted.indexOf(profile) == l
		})
		console.log(sameInterestProfiles)
		res.render('index', {
			profiles: sameInterestProfiles,
			currentUser: currentUser
		})
	})
}

function profilesToArray() {
	return new Promise(resolve => {
		resolve(
			localDB
				.collection('profiles')
				.find()
				.toArray()
		)
	})
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

function signIn(req, res) {
	res.render('sign-in')
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
	console.log(req.body.name)
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
			res.redirect('/profile/' + foundData.insertedId)
		}
	}
}

function form(req, res) {
	res.render('edit.ejs', { profiles: profiles })
}

// id Can be generated from everything. For instance, it can be an unique idcode from a database
function profileID(req, res) {
	let profileID = req.params.id
	// let profileID = req.query

	localDB.collection('profiles').findOne(
		{
			_id: mongo.ObjectID(profileID)
		},
		profileIDFound
	)

	function profileIDFound(err, foundProfileID) {
		console.log(foundProfileID)
		if (err) {
			res.redirect('/')
		} else {
			try {
				res.render('profile.ejs', {
					profiles: profiles,
					currentUser: req.session
				})
			} catch (error) {
				res.redirect('/')
			}
		}
	}
}

function notFound(req, res) {
	res.status(404).render('notFound.ejs', {
		profiles: sameInterestProfiles,
		currentUser: currentUser
	})
}

function list(req, res) {
	res.render('listOfProfiles.ejs', { profiles: profiles })
}

// app.use(function(req, res){
//   res.status(404).send('<h1>ERRRRROR</h1>')
// })

console.log('localhost:3000')
