
var subscribable = require('jqb-subscribable');

var Todo = require('./model');
var repository = require('./repository');


/**
 * Public API
 */

exports.init = init;

exports.createTodo = createTodo;

exports.removeTodo = removeTodo;

exports.watch = watch;

exports.on = on;




/**
 * Implementation
 */

var channel;

function init() {
	channel = subscribable.create();
}

function on(evt, cb) {
	return channel.on(evt, cb);
}

function createTodo(data, synced) {
	var todo = new Todo(data);
	repository.add(todo);
	channel.emit('added:todo:' + todo.id, todo);
	if (!synced) {
		channel.emit('data:added:todo:' + todo.id, todo);
	}
	return todo;
}

function removeTodo(todo, synced) {
	if (repository.remove(todo)) {
		channel.emit('removed:todo:' + todo.id, todo);
		if (!synced) {
			channel.emit('data:removed:todo:' + todo.id, todo);
		}
		return true;
	} else {
		return false;
	}
}

function watch(cb) {
	var t1, t2;
	repository.list().forEach(function(model) {
		cb('add', model);
	});

	t1 = channel.on('^added:todo', function(model) {
		cb('add', model);
	});

	t2 = channel.on('^removed:todo', function(model) {
		cb('remove', model);
	});

	return {
		dispose: function() {
			t1.dispose();
			t2.dispose();
		}
	};
}