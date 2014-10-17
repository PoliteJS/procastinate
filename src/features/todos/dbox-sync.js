
var dbox = require('dbox');
// var dataStore = require('dbox/dstore');
var repository = require('./repository');
var service = require('./service');


/**
 * Public API
 */

exports.init = init;

exports.start = start;


/**
 * API Implementation
 */

var todosTable;
var syncing;

function init() {
	todosTable = null;
	syncing = null;
}

function start() {
	var s1, s2, s3, store;

	function recordsChangedHandler(event) {
		event.affectedRecordsForTable('todos2').forEach(syncRemoteRecord);
	}

	dbox.service.onConnect(function() {
		dbox.store.open();
		dbox.store.onReady(function(store) {

			todosTable = store.getTable('todos2');
			sync();

			s1 = service.on('data:added:todo', syncLocalModel);
			s2 = service.on('data:changed:todo', syncLocalModel);
			s3 = service.on('data:removed:todo', removeRemoteRecord);

			// live sync updates
			store.recordsChanged.addListener(recordsChangedHandler);
		});
	});
	
	dbox.service.onDisonnect(function() {
		todosTable = null;
		s1 && s1.dispose();
		s2 && s2.dispose();
		s3 && s3.dispose();
	});	
};

function sync() {
	syncing = new Date();
	
	syncRemote2Local();
	syncLocal2Remote();

	syncing = null;
}

function syncRemote2Local() {
	var records = todosTable.query();
	records.forEach(syncRemoteRecord);
}

function syncLocal2Remote() {
	var models = repository.list();
	models.forEach(syncLocalModel);
}

function syncRemoteRecord(record) {
	var todo = repository.find(record.get('id'));
	var etag = record.get('etag');

	if (etag === -1) {
		if (todo) {
			service.removeTodo(todo, true);
		}
		return;
	}

	if (!todo) {
		service.createTodo(record.getFields(), true);
	} else if (record.get('etag') > todo.etag) {
		todo.update(record.getFields());
	}
}

function removeRemoteRecord(model) {
	var record = todosTable.query({
		id: model.id
	}).shift();
	if (!record) {
		return false;
	}
	var fields = record.getFields();
	Object.keys(fields).forEach(function(key) {
		if (['id'].indexOf(key) !== -1) {
			return;
		}
		fields[key] = '';
	});
	fields.etag = -1;
	record.update(fields);
}

function syncLocalModel(model) {
	var record = todosTable.query({
		id: model.id
	}).shift();
	if (!record) {
		console.log('create', model.getTitle());
		todosTable.insert(model.serialize());
	} else if (model.etag > record.get('etag')) {
		record.update(model.serialize());
	}
}
