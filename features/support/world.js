var zombie = require('zombie');
module.exports.World = function(callback) {
	this.browser = new zombie();
	callback();
};