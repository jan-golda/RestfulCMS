// import local modules
var database	= require('../database');

// create schema
var Post = database.Schema({
	id:		{type: String, trim: true, lowercase: true},
	title:		{type: String},
	content:	{type: String},
	author:		{type: String, ref: 'User'},
	createdAt:	{type: Date, default: Date.now}
});

// plugins
Post.plugin(require('mongoose-timestamp'));

// exports
module.exports = database.model('Post', Post);
