

var service = require('./service');

var dropboxClient;

exports.init = function(config) {
	
	dropboxClient = new Dropbox.Client({
        key: config.dboxApiKey
    });

    dropboxClient.authDriver(new Dropbox.AuthDriver.Popup({
        receiverUrl: window.location.origin + config.dboxOauthReceiver
    }));

    service.init(dropboxClient);

};

exports.start = function() {
	service.start();
};

exports.service = service;
