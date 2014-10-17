
var subscribable = require('jqb-subscribable');

var service = require('./service');

var channel;
var activeStore;

exports.init = function() {
	channel = subscribable.create();
	activeStore = null;
};

exports.open = function(sid, cb) {

	cb = cb || function() {};

	function handler(err, _store) {
		if (err) {
			return cb(err);
		}
		activeStore = _store;
		cb(null, activeStore);
		channel.emit('opened', activeStore);
	}

	this.close();

	if (sid) {
		this.getStore(sid, handler);
	} else {
		this.getStore(handler);
	}
};

exports.close = function() {
	if (activeStore) {
		channel.emit('closed', activeStore);
		activeStore = null;
	}
};

exports.onReady = function(cb) {
	if (activeStore) {
		cb(activeStore);
	} else {
		channel.one('opened', cb);
	}
};

exports.getStore = function(sid, cb) {

	if (typeof sid === 'function') {
		cb = sid;
		sid = null;
	}

	service.onConnect(function(client) {
		var mgr = client.getDatastoreManager();

		function handler(err, datastore) {
			if (err) {
				return cb(err);
			}
			cb(null, datastore);
		}

		if (sid === null) {
			mgr.openDefaultDatastore(handler);
		} else {
			mgr.openOrCreateDatastore(sid, handler);
		}
	});
};

exports.getActiveStore = function() {
	return activeStore;
};
