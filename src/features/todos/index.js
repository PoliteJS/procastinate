
var repository = require('./repository');
var service = require('./service');
var dboxSync = require('./dbox-sync');

exports.init = function() {
	service.init();
    repository.init();
    repository.restore();
    dboxSync.init();
};

exports.start = function() {
	dboxSync.start();	
};

exports.service = service;
