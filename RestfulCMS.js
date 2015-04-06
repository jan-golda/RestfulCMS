// import node.js modules
var path	= require('path');

// import public modules
var express	= require('express');
var bodyParser	= require('body-parser');
var jwt		= require('jwt-simple');
var moment	= require('moment');
var requireAll	= require('require-all');
var morgan	= require('morgan');

// import private modules
var config	= require('./config');
var database	= require('./database');
var User	= require('./models/User');

// create express server
var server = express();

// parsing data
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

// logging
server.use(morgan('dev'));

// handling authentication
server.post('/authentication', function(req,res,next){
	User.findOne({username: req.body.username}, function(err, user){
		if(err)
			return next(err);
		if(!user)
			return res.status(401).send("Wrong username");
		if(!user.validPassword(req.body.password))
			return res.status(401).send("Wrong password");

		// calculate expired time
		var expires = moment().add(1, 'days').valueOf();

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
		return res.status(400).send("Missing token");

	try{
		// decoding token
		var decoded = jwt.decode(token, config.secret);

		// checking token expired time
		if(decoded.exp < moment().valueOf())
			return res.status(403).send("Token expired");

		// retriving user
		User.findById(decoded.iss, function(err, user){
			if(err)
				return next(err);

			if(!user)
				return res.status(403).send("Non existing user");

			// assign user to request
			req.user = user;

			// continue
			return next();
		});

	} catch(err){
		return res.status(403).send("Wrong token");
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
