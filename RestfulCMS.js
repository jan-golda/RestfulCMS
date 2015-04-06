// import node.js modules
var path	= require('path');

// import public modules
var express	= require('express');
var bodyParser	= require('body-parser');
var jwt		= require('jwt-simple');
var moment	= require('moment');
var requireAll	= require('require-all');

// import private modules
var config	= require('./config');
var database	= require('./database');
var User	= require('./models/User');

// create express server
var server = express();

// parsing data
server.use(bodyParser);

// handling authentication
server.post('/authentication', function(req,res,next){
	User.findOne({username: req.body.username}, function(err, user){
		if(err)
			return next(err);
		if(!user)
			return res.end("Wrong username", 401);
		if(!user.validPassword(req.body.password))
			return res.end("Wrong password", 401);

		// calculate expired time
		var expires = moment().add('days', 1).valueOf();

		// create token
		var token = jwt.encode({
			iss: user._id,
			exp: expires
		}, config.secret);

		// send response
		res.json({
			token: token,
			expires: expires
		}).end();
	});
});

// checking authorization
server.all('*', function(req, res, next){
	// retriving token from request
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

	if(!token)
		return res.end("Missing token", 400);

	try{
		// decoding token
		var decoded = jwt.decode(token, config.secret);

		// checking token expired time
		if(decoded.exp < moment().valueOf())
			return res.end("Token expired", 403);

		// retriving user
		User.findById(decoded.iss, function(err, user){
			if(err)
				return next(err);

			// assign user to request
			req.user = user;

			// continue
			return next();
		});

	} catch(err){
		return res.end("Wrong token", 403);
	}
});

// loading APIs
var apiRouter = express.Router();
var APIs = requireAll(path.join(__dirname, 'api'));
for(var name in APIs){
	if(!APIs.hasOwnProperty(name))return;
	APIs[name].registerRoutes(apiRouter);
	console.log("API loaded: "+name);
}

// adding APIs to routes
server.use(apiRouter);

// listening
server.listen(config.port, function(){
	console.log("Listening on port "+config.port);
});
