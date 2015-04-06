// import public modules
var mongoose	= require('mongoose');

// import local modules
var config	= require('./config');

// adding callbacks
mongoose.connection.on('error', function(err){
	console.log(err);
	console.log("Shutting down due to database problems");
	process.exit();
});
mongoose.connection.once('open', function(){
	console.log("Successfully connected to MongoDB");
});

// if authorization is required
if(config.database.user)
	var options = {user: config.database.user, password: config.database.password};

// connecting
mongoose.connect("mongodb://"+config.database.url+"/"+config.database.db, options);

// exports
module.exports = mongoose;
