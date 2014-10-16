
var todos = require('todos');

module.exports = {
	init: function() {
		this.todo = ko.observable();
	},
	create: function() {
		todos.service.createTodo({
			title: this.todo()
		});
		this.todo('');
	}
};
