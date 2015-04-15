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
	// TODO: add handling
	res.sendStatus(404).end();
}
function create(req, res){
	// TODO: add handling
	res.sendStatus(404).end();
}
function get(req, res){
	// TODO: add handling
	res.sendStatus(404).end();
}
function edit(req, res){
	// TODO: add handling
	res.sendStatus(404).end();
}
function remove(req, res){
	// TODO: add handling
	res.sendStatus(404).end();
}
