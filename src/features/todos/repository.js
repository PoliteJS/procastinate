/**
 * capable of LocalStorage persistency
 * key "todos" - list of stored ids
 * key "todo-{id}" - single todo data
 */

var Todo = require('./model');

module.exports = {
	init: init,
	restore: restore,
	add: addItem,
	remove: removeItem,
	list: getList,
	find: getById
};


/**
 * Public API implementation
 */

var items;
var subscriptions;
var restoring;

function init() {
	items = [];
	subscriptions = {};
	restoring = false;
} 

function restore() {
	var self = this;
	restoring = true;
	unserializeList().forEach(unserializeItem);
	restoring = false;
}

function getList() {
	return items.filter(function() {
		return true;
	});
}

function getById(itemId) {
	return items.filter(function(item) {
		return itemId === item.id;
	}).shift();
}

function addItem(item) {
	if (
		!item || 
		!(item instanceof Todo)
	) {
		return false;
	}
	items.push(item);

	subscriptions[item.id] = item.on('change', serializeItem);
	if (!restoring) {
		serializeItem(item);
		serializeList();
	}

	return true;
}

function removeItem(item) {
	var index = items.indexOf(item);
	if (index === -1) {
		return false;
	}
	items.splice(index, 1);

	subscriptions[item.id].dispose();
	subscriptions[item.id] = null;
	
	serializeList();
	removeSerializedItem(item.id);

	return true;
}

/**
 * Local Storage Utility
 */

function serializeList() {
	var data = Object.keys(subscriptions).filter(function(id) {
		return subscriptions[id] !== null;
	});
	localStorage.setItem('todos', JSON.stringify(data));
}

function unserializeList() {
	try {
		return JSON.parse(localStorage.getItem('todos')) || [];
	} catch(e) {}
	return [];
};

function serializeItem(item) {
	localStorage.setItem('todo-' + item.id, item.toJSON());
}

function unserializeItem(itemId) {
	try {
		var data = JSON.parse(localStorage.getItem('todo-' + itemId));
		addItem(new Todo(data));
	} catch(e) {}
}

function removeSerializedItem(itemId) {
	try {
		localStorage.removeItem('todo-' + itemId);
	} catch(e) {}
}
