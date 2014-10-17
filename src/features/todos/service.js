
var subscribable = require('jqb-subscribable');

var Todo = require('./model');
var repository = require('./repository');


/**
 * Public API
 */

exports.init = init;

exports.start = start;

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

function start() {
	var subs = {};

	function changeHandler(model, before) {
		channel.emit('data:changed:todo:' + model.id, model, before);
	}

	function addHandler(model) {
		subs[model.id] = model.on('^change$', changeHandler);
	}

	function removeHandler(model) {
		subs[model.id].dispose();
		subs[model.id] = null;
	}

	repository.list().forEach(addHandler);
	channel.on('added:todo', addHandler);
	channel.on('removed:todo', removeHandler);
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

/**
 * Communicate list related changes 
 * add, remove, change(list)
 */
function watch(cb) {
	var t1, t2;
	var subs = {};

	function changeHandler(model, before) {
		cb('change', model, before);
	}

	function addHandler(model) {
		cb('add', model);
		subs[model.id] = model.on('change:list$', changeHandler);
	}

	function removeHandler(model) {
		cb('remove', model);
		subs[model.id].dispose();
		subs[model.id] = null;
	}

	repository.list().forEach(addHandler);
	t1 = channel.on('^added:todo', addHandler);
	t2 = channel.on('^removed:todo', removeHandler);

	return {
		dispose: function() {
			t1.dispose();
			t2.dispose();
			Object.keys(subs).forEach(function(k) {
				if (subs[k]) {
					subs[k].dispose();
				}
			});
		}
	};
}