// REQUIRE VARIABLES
const express = require('express')
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
let sameInterestProfilesUnsorted //LIST OF PROFILES WITH THE SAME INTERESTS WITH DOUBLE PROFILES
let sameInterestProfiles //LIST OF PROFILES WITH THE SAME INTERESTS
let onlineProfiles //LIST OF PROFILES WHO ARE ONLINE

// CHECK IF USER IS SIGNED IN
const isSignedIn = req => {
	// CHECK IF A SESSIONUSER HAS BEEN SELECTED
	if (req.session.username) {
		return true
	} else {
		return false
	}
}

// CATCH SESSIONSTATE AT HOMEPAGE
const home = (req, res) => {
	// GO TO HOMEPAGE WHEN SESSION FOUND
	if (isSignedIn(req)) {
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

// SETUP SESSION / UPDATE SESSION
const sessionProfile = (req, res) => {
	// SAVE ALL PROFILES FROM DATABASE IN AN ARRAY
	profilesToArray().then(profilesArray => {
		allProfiles = profilesArray
		let sessionUser = req.body.sessionProfiles
		allProfiles.forEach((profile, i) => {
			if (profile.name === sessionUser) {
				console.log(sessionUser + ': im in!')
				req.session._id = profile._id
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

const checkInterests = () => {
	sameInterestProfilesUnsorted = []
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

// CHECK WHICH USERS ARE ONLINE
const checkOnlineStatus = () => {
	onlineProfiles = []
	profiles.forEach(profile => {
		if (profile.onlineStatus === 'online') {
			onlineProfiles.push(profile)
		}
	})
}

// SAVE PROFILES IN LOCAL ARRAY
const profilesToArray = () => {
	// CREATE A NEW PROMISE; THIS MUST FINISH FIRST BEFORE CONTINUEING WITH THEN
	return new Promise(resolve => {
		resolve(
			localDB
				.collection('profiles')
				.find()
				.toArray()
		)
	})
}

const updateDatabase = () => {
	mongoClient.connect(uri, { useUnifiedTopology: true }, function(
		err,
		clientDB
	) {
		if (err) {
			console.log('I AM ERROR: ' + err)
		} else {
			localDB = clientDB.db(process.env.DB_NAME)
			console.log('Database updated')
		}
	})
}

// function find(req, res, next) {
// 	localDB
// 		.collection('profiles')
// 		.find()
// 		.toArray(profilesArray)
//
// 	function profilesArray(err, profilesArray) {
// 		if (err) {
// 			next(err)
// 		} else {
// 			res.render('listOfProfiles', { profiles: profilesArray })
// 		}
// 	}
// }

// Make an aboutpage
// function about(req, res) {
// 	if (req.url === '/about') {
// 		res.status(200).send('<h1>hi</h1>')
// 		res.end('this is my website\n')
// 	} else {
// 		res.end('Hello World!\n')
// 	}
// }

// Play sound when accessing /mp3
// function mp3(req, res) {
// 	res.sendfile(__dirname + '/static/audio/waaah.mp3')
// 	console.log('Why no Wah in smash bros?')
// }

// function signIn(req, res) {
// 	res.render('sign-in')
// }

// function profile(req, res) {
// 	res.render('profile')
// }

const edit = (req, res) => {
	localDB.collection('profiles').updateOne(
		{
			_id: mongo.ObjectID(currentUser._id)
		},
		{
			$set: {
				gender: req.body.gender,
				location: req.body.location,
				about: req.body.about,
				age: parseInt(req.body.age) //CONVERT TO INTEGER
			}
		}
	)
	sessionProfile(req, res)
	res.redirect('/profile/' + currentUser._id)
}

// function edit(req, res) {
// 	localDB.collection('profiles').updateOne(
// 		{
// 			_id: mongo.ObjectID(currentUser._id)
// 		},
// 		{
// 			$set: {
// 				name: req.body.name,
// 				age: parseInt(req.body.age), //CONVERT TO INTEGER
// 				gender: req.body.gender,
// 				location: req.body.location,
// 				about: req.body.about
// 			}
// 		}
// 	)
// 	sessionProfile(req, res)
// 	res.redirect('/')
// }

// function edit2(req, res, next) {
// 	localDB.collection('profiles').insertOne(
// 		{
// 			name: req.body.name,
// 			age: req.body.age,
// 			interests: req.body.interests,
// 			location: req.body.location
// 		},
// 		insertProfile
// 	)
//
// 	function insertProfile(err, foundData) {
// 		if (err) {
// 			next(err)
// 		} else {
// 			console.log('trying pushing data...')
// 			res.redirect('/profile/' + foundData.insertedId)
// 		}
// 	}
// }

const form = (req, res) => {
	if (isSignedIn(req)) {
		res.render('edit.ejs', { currentUser: currentUser })
	} else {
		res.render('sign-in')
	}
}

// function form(req, res) {
// 	res.render('edit.ejs', { currentUser: currentUser })
// }

const profileID = (req, res) => {
	if (isSignedIn(req)) {
		let profileID = req.params.id

		localDB.collection('profiles').findOne(
			{
				_id: mongo.ObjectID(profileID)
			},
			profileIDFound
		)
	} else {
		res.render('sign-in')
	}

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

const notFound = (req, res) => {
	res.status(404).render('notFound.ejs', {
		profiles: sameInterestProfiles,
		currentUser: currentUser
	})
}

const interests = (req, res) => {
	if (isSignedIn(req)) {
		res.render('editInterests.ejs', {
			profiles: profiles,
			currentUser: currentUser
		})
	} else {
		res.render('sign-in')
	}
}

const removePage = (req, res) => {
	if (isSignedIn(req)) {
		res.render('remove.ejs', {
			allProfiles: allProfiles,
			currentUser: currentUser
		})
	} else {
		res.render('sign-in')
	}
}

const remove = (req, res) => {
	let profileID = req.body._id

	localDB.collection('profiles').deleteOne(
		{
			_id: mongo.ObjectID(profileID)
		},
		deleteProfile
	)

	function deleteProfile(err) {
		if (err) {
			res.redirect('/notFound')
		} else {
			updateDatabase()
			sessionProfile(req, res)
		}
	}
}

const addPage = (req, res) => {
	if (isSignedIn(req)) {
		res.render('add.ejs', {
			allProfiles: allProfiles,
			currentUser: currentUser
		})
	} else {
		res.render('sign-in')
	}
}

const add = (req, res, next) => {
	let interestArray = []
	interestArray.push(req.body.interest)

	localDB.collection('profiles').insertOne(
		{
			name: req.body.name,
			age: parseInt(req.body.age), //CONVERT TO INTEGER
			gender: req.body.gender,
			onlineStatus: 'offline',
			interests: interestArray,
			location: req.body.location,
			about: req.body.about
		},
		insertProfile
	)

	function insertProfile(err, foundData) {
		if (err) {
			next(err)
		} else {
			updateDatabase()
			sessionProfile(req, res)
			console.log('trying pushing data...')
			res.redirect('/profile/' + foundData.insertedId)
		}
	}
}

// SETUP EXPRESS
express()
	.use(bodyParser.urlencoded({ extended: true }))
	.use(
		session({
			secret: 'secret-key', // COMPUTES THE HASH: NEEDS A STRING OR SESSION ACCESS WOULD BE DENIED
			resave: false,
			saveUninitialized: false // DON'T CREATE A NEW A NEW SESSION WHEN ADDING NEW CONTENT LIKE SESSION.NAME: ...
		})
	)
	.use('/static', express.static('static')) //Here you link to the folder static. So when /static is called in html, express will use the folder static. You can name the folder whatever you want as long as you change the express.static(foldername).
	.set('view engine', 'ejs') // SET TEMAPLATE ENGINE
	.set('views', 'view') // SET FOLDER WHERE TEMPLATES ARE LOCATED
	.post('/edit', edit) // CALL FUNCTION TO UPDATE YOUR OWN PROFILE
	.post('/', sessionProfile) // SETUP SESSION WITH ITS LOCAL VARIABLES
	.post('/remove', remove) // CALL FUNCTION TO REMOVE THE PROFILE ON ROUTE /REMOVE
	.post('/add', add) // CALL FUNCTION TO ADD THE PROFILE ON ROUTE /ADD
	.get('/', home) // LOAD INDEX TEMPLATE
	.get('/profile/:id', profileID) // UNIQUE PROFILE PAGE BASED ON ITS ID
	.get('/edit', form) // LOAD PAGE WITH FORM TO EDIT YOUR OWN PROFILE
	.get('/interests', interests) // LOAD PAGE TO LOOK AT YOUR INTERESTS
	.get('/remove', removePage) // LOAD PAGE WHERE YOU CAN REMOVE PAGES
	.get('/add', addPage) // LOAD PAGE TO ADD A PROFILE
	.use(notFound) // LOAD A NOTFOUND PAGE IF ROUTE NOT FOUND
	.listen(process.env.PORT)

console.log('Website can be found at ' + process.env.PORT)
