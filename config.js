// import node.js modules
var fs		= require('fs');
var path	= require('path');

// export config
module.exports = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));