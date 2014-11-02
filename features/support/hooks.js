module.exports = function (callback) {
	this.Before(function(callback) {
		callback();
	});
	this.After(function(callback) {
		callback();
	});
};