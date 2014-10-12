
var service = require('dbox/service');

describe('dbox/service', function() {

	// fake dropbox client
	function createDropboxClient(status) {
		var client = {
			status: status
		};
		client.authenticate = function(a,b) {
			this.status = status;
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
		client.signOut = function(cb) {
			this.status = false;
			cb(null);
		}
		return client;
	};

	beforeEach(function() {
		service.init(createDropboxClient(true));
	});

	it('should check for authentication at start time', function(done) {
		service.on('status-changed', function(status) {
			expect(status).to.be.true;
			done();
		});
		service.start();
	});

	it('should connect', function(done) {
		service.on('status-changed', function(status) {
			expect(status).to.be.true;
			done();
		});
		service.connect();
	});

	it('should disconnect', function(done) {
		service.start();
		service.on('status-changed', function(status) {
			expect(status).to.be.false;
			done();
		});
		service.disconnect();
	});

	describe('onReady()', function() {

		var spy;

		beforeEach(function() {
			spy = sinon.spy();
		});

		it('should register and run a logic if stauts is already set', function() {
			service.start();
			service.onReady(spy);
			expect(spy.calledOnce).to.be.true;
		});

		it('should register and run a logic as soon the state change', function() {
			service.onReady(spy);
			service.start();
			expect(spy.calledOnce).to.be.true;
		});

		it('should register and run a "onReady" logic only once', function() {
			service.onReady(spy);
			service.start();
			service.disconnect();
			service.connect();
			expect(spy.calledOnce).to.be.true;
		});

	});

	describe('custom events', function() {

		it('should trigger CONNECTED message', function(done) {
			service.on('connected', done);
			service.start();
		});

		it('should trigger DISCONNECTED message', function(done) {
			service.on('disconnected', done);
			service.start();
			service.disconnect();
		});

	});

});