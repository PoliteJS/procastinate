/**
 * PoliteJS Worspace - Single Page App Builder
 * ===========================================
 * 
 * 
 */


/**
 * Export `require()` to the global namespace
 */
window.require = require;

var lifecycle = require('jqb-lifecycle');
lifecycle.start([/*FEATURES*/], {
	dboxApiKey: '25a3qxz5guhce36',
	dboxOauthReceiver: '/oauth_receiver.html'	
});

// fake time to help development
//var time = require('time');
//time.setToday(new Date(2014, 9, 10));
// -- remove in production!!!!
