
var dstore = require('dbox/dstore');

describe('dbox/dstore', function() {

	// fake dropbox client
	function createDropboxClient() {
		var client = {
			status: true
		};
		client.authenticate = function(a,b) {
			this.status = client.status;
			if (a.call) {
				return a(null, client);	
			}
			if (b.call) {
				return b(null, client);	
			}
		};
		client.isAuthenticated = function() {
			return this.status;
		};
		client.getDatastoreManager = function() {
			return {
				openDefaultDatastore: function(cb) {
					cb(null, {
						getTable: function() {}
					});
				},
				openOrCreateDatastore: function(id, cb) {
					cb(null, {
						id: id,
						getTable: function() {}
					});
				}
			}
		}
		return client;
	};

	beforeEach(function() {
		service.init(createDropboxClient(true));
		dstore.init();
		service.start();
	});

	it('should provide the default datastore', function(done) {
		dstore.getStore(function(err, store) {
			expect(store).to.contain.key('getTable');
			done();
		});
	});

	it('should provide a custom datastore', function(done) {
		dstore.getStore('foo', function(err, store) {
			expect(store).to.contain.key('getTable');
			done();
		});
	});

	it('should work with a datastore', function(done) {
		dstore.open();
		dstore.onReady(function(store) {
			expect(store).to.deep.equal(dstore.getActiveStore());
			done();
		});
	});

	it('should close the active store', function(done) {
		dstore.open();
		dstore.onReady(function(store) {
			dstore.close();
			expect(dstore.getActiveStore()).to.be.null;
			done();
		});
	});

});