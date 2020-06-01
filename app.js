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
let onlineProfiles = [] //LIST OF PROFILES WHO ARE ONLINE

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
	.post('/edit', edit)
	.post('/', sessionProfile)
	.get('/', home)
	// .get('/register', register)
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
	if (isSignedIn(req)) {
		console.log(profiles)
		res.render('index', {
			profiles: profiles,
			currentUser: req.session,
			allProfiles: allProfiles,
			onlineProfiles: onlineProfiles
		})
	} // GO TO SIGN-IN PAGE WHEN NO USER/SESSION FOUND
	else {
		res.render('sign-in')
	}
}

function sessionProfile(req, res) {
	// SAVE ALL PROFILES FROM DATABASE IN AN ARRAY
	profilesToArray().then(profilesArray => {
		allProfiles = profilesArray
		let sessionUser = req.body.sessionProfiles
		allProfiles.forEach((profile, i) => {
			if (profile.name === sessionUser) {
				console.log(sessionUser + ': im in!')
				req.session._id = profile._id
				console.log(profile._id)
				req.session.username = profile.name
				req.session.age = profile.age
				req.session.gender = profile.gender
				req.session.interests = profile.interests
				req.session.location = profile.location
				req.session.about = profile.about
				currentUser = req.session
				profiles = allProfiles
				profiles.splice(i, 1)
			}
		})
		checkInterests() //CALL FUNCTION TO CHECK COMMON INTERESTS
		checkOnlineStatus() //CALL FUNCTION TO CHECK WHICH PROFILES ARE ONLINE
		// SOURCE: https://stackoverflow.com/questions/38206915/filter-out-array-to-have-only-unique-values
		sameInterestProfiles = sameInterestProfilesUnsorted.filter(function(
			profile,
			l
		) {
			return sameInterestProfilesUnsorted.indexOf(profile) == l
		})
		res.render('index', {
			profiles: sameInterestProfiles,
			currentUser: currentUser,
			allProfiles: allProfiles,
			onlineProfiles: onlineProfiles
		})
	})
}

function checkInterests() {
	currentUser.interests.forEach(interestCurUser => {
		profiles.forEach(profile => {
			profile.interests.forEach(interestProfile => {
				if (interestCurUser === interestProfile) {
					sameInterestProfilesUnsorted.push(profile)
				}
			})
		})
	})
}

function checkOnlineStatus() {
	profiles.forEach(profile => {
		if (profile.onlineStatus === 'online') {
			onlineProfiles.push(profile)
		}
	})
}

function isSignedIn(req) {
	// CHECK IF A SESSIONUSER HAS BEEN SELECTED
	if (req.session.username) {
		return true
	} else {
		return false
	}
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
	localDB.collection('profiles').updateOne(
		{
			_id: mongo.ObjectID(currentUser._id)
		},
		{
			$set: {
				name: req.body.name,
				age: parseInt(req.body.age), //CONVERT TO INTEGER
				gender: req.body.gender,
				location: req.body.location,
				about: req.body.about
			}
		}
	)
	sessionProfile(req, res)
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
			res.redirect('/profile/' + foundData.insertedId)
		}
	}
}

function form(req, res) {
	res.render('edit.ejs', { currentUser: currentUser })
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

	function profileIDFound(err, foundProfile) {
		console.log(foundProfile)
		if (err) {
			res.redirect('/notFound')
		} else if (foundProfile === null) {
			res.redirect('/notFound')
		} else {
			try {
				res.render('profile.ejs', {
					profiles: profiles,
					currentUser: req.session,
					profile: foundProfile
				})
			} catch (error) {
				res.redirect('/notFound')
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

console.log('localhost:3000')
