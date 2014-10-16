
var todos = require('todos');

module.exports = {
	init: function(model) {
		this.model = model;
	},
	dispose: function() {},
	remove: function() {
		todos.service.removeTodo(this.model);
	}
};
