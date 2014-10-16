
var subscribable = require('jqb-subscribable');

var client;
var channel;

var currentStatus;
var lastStatus;

exports.init = function(_client) {
	client = _client;
	channel = subscribable.create();
	currentStatus = lastStatus = null;
};

exports.start = function() {
    client.authenticate({interactive:false}, updateStatus);
};

exports.getClient = function() {
	return client;
};

exports.connect = function() {
    client.authenticate(updateStatus);
};

exports.disconnect = function() {
    client.signOut(function(err) {
        updateStatus(err, client);
    });
};

exports.on = function(evt, cb) {
	return channel.on(evt, cb);
};

exports.one = function(evt, cb) {
	channel.one(evt, cb);
};

exports.onReady = function(cb) {
	if (currentStatus !== null) {
		cb(currentStatus);
	} else {
		this.one('status-changed', cb);
	}
};

exports.onConnected = function(cb) {
    var self = this;
    if (currentStatus === true) {
        cb(self.getClient());
    } else {
        return this.on('connected', function() {
            cb(self.getClient());
        });
    }  
};

function updateStatus(err, client) {
    if (err) {
        return err;
    }
    currentStatus = client.isAuthenticated();
    if (currentStatus !== lastStatus) {
    	channel.emit('status-changed', currentStatus);
    }
    if (currentStatus === true) {
    	channel.emit('connected');
    }
    if (currentStatus === false) {
    	channel.emit('disconnected');
    }
    lastStatus = currentStatus;
}
