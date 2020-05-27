const { MongoClient } = require('mongodb');
require('dotenv').config();

var mongoDB =
	'mongodb+srv://Marco:Esepidg@projecttech-fzjsx.mongodb.net/test?retryWrites=true&w=majority';
let localDB = null;

MongoClient.connect(mongoDB, { useUnifiedTopology: true }, function(
	err,
	clientDB
) {
	if (err) {
		console.log('I AM ERROR: ' + err);
	} else {
		localDB = clientDB.db(process.env.DB_NAME);
		console.log(localDB);
		console.log('Connection with database succesfull');
	}
});
