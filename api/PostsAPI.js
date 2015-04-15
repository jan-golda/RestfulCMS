// import local modules
var Post 	= require('../models/Post');

// exports
var api = module.exports = {};

// registering router
api.registerRoutes = function(router){
	router.route('/posts')
		.get(getAll)
		.post(create);
	router.route('/posts/:id')
		.get(get)
		.put(edit)
		.delete(remove);
};

// routes
function getAll(req, res){
	// getting all posts
	Post.find()
		.exec(function(err, posts){
			if(err)
				throw err;
			
			// send respond
			res.json(posts).status(200).end();
		});
}
function create(req, res){
	// TODO: add handling
	res.sendStatus(404).end();
}
function get(req, res){
	// getting post by id
	Post.findOne()
		.where('id').eq(req.params.id)
		.exec(function(err, post){
			if(err)
				throw err;
			if(!post)
				return res.status(404).end();
			
			// send response
			res.json(post).status(200).end();
		});
}
function edit(req, res){
	// TODO: add handling
	res.sendStatus(404).end();
}
function remove(req, res){
	// removing post by id
	Post.remove()
		.where('id').eq(req.params.id)
		.exec(function(err, count){
			if(err)
				throw err;
			if(!count)
				return res.status(404).end();
			
			// sending response
			res.status(200).end();
		});
}
