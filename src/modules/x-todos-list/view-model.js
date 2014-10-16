
var todos = require('todos');

module.exports = {
	init: function() {
		this.list = ko.observableArray();
		this._watch = todos.service.watch(this.watchHandler.bind(this));
	},
	dispose: function() {
		this._watch.dispose();
	},
	watchHandler: function(action, todo) {
		switch (action) {
			case 'add':
				this.list.push(todo);
				break;
			case 'remove':
				this.list.remove(todo);
				break;
		}
	}
};
