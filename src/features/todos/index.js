
var repository = require('./repository');

exports.init = function() {
    repository.init();
    repository.restore();
};
