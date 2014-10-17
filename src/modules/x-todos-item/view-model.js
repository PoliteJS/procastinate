
var todos = require('todos');

module.exports = {
	init: function(model) {
		this.model = model;
		this.isDone = ko.observable(false);

		this.model.on('change', this.update.bind(this));
		this.update(model);

	},
	dispose: function() {},
	update: function(model) {
		this.isDone(model.status);
	},
	toggle: function() {
		this.model.toggle();
	}
};
