
var repository = require('todos/repository');
var Todo = require('todos/model');

describe('todos/repository', function() {

	var localStorageGetItemStub;

	beforeEach(function() {
		repository.init();
	});

	describe('API', function() {

		var stub1, stub2, stub3;

		before(function() {
			stub1 = sinon.stub(localStorage, 'getItem', function() {});
			stub2 = sinon.stub(localStorage, 'setItem', function() {});
			stub3 = sinon.stub(localStorage, 'removeItem', function() {});
		});

		after(function() {
			stub1.restore();
			stub2.restore();
			stub3.restore();
		});

		it('should add Todos', function() {
			var todo = new Todo({});
			repository.add(todo);
			expect(repository.list().shift()).to.equal(todo);
		});

		describe('should add ONLY Todos', function() {
			[new Function(),{},Object.create({}),null,undefined,0,1,-1,'',true,false].forEach(function(item) {
				it(item, function() {
					expect(repository.add(item)).to.be.false;
				});	
			});
		});

		it('should find an item by id', function() {
			var todo = new Todo({});
			repository.add(todo);
			expect(repository.find(todo.id)).to.equal(todo);
		});

		it('should remove an item', function() {
			var todo1 = new Todo({});
			var todo2 = new Todo({});
			repository.add(todo1);
			repository.add(todo2);
			repository.remove(todo1);
			expect(repository.list().shift()).to.equal(todo2);
		});

		it('should NOT remove a non existent item', function() {
			var todo1 = new Todo({});
			repository.add(todo1);
			repository.remove(new Todo({}));
			expect(repository.list().shift()).to.equal(todo1);
		});

	});

	describe('persistency', function() {

		it('should persist items when added', function(done) {
			var stub = sinon.stub(localStorage, 'setItem', function(key, val) {
				expect(todo.serialize()).to.deep.equal(JSON.parse(val));
				stub.restore();
				done();
			});
			var todo = new Todo({});
			repository.add(todo);
		});

		it('should persist items when updated', function(done) {
			var todo = new Todo({});
			repository.add(todo);
			var stub = sinon.stub(localStorage, 'setItem', function(key, val) {
				expect(todo.serialize()).to.deep.equal(JSON.parse(val));
				stub.restore();
				done();
			});
			todo.update({title:'foo'});
		});

		it('should persist the items list', function(done) {
			var todo1 = new Todo({});
			var todo2 = new Todo({});
			repository.add(todo1);
			var stub = sinon.stub(localStorage, 'setItem', function(key, val) {
				if (key !== 'todos') {
					return;
				}
				expect([todo1.id, todo2.id]).to.deep.equal(JSON.parse(val));
				stub.restore();
				done();
			});
			repository.add(todo2);
		});

		it('should restore a persisted repository', function() {
			var stub1 = sinon.stub(localStorage, 'setItem', function() {});
			var stub2 = sinon.stub(localStorage, 'getItem', function(key) {
				switch (key) {
					case 'todos':
						return JSON.stringify([1,2]);
					case 'todo-1':
						return JSON.stringify({
							id: 1,
							title: 'foo'
						});
					case 'todo-2':
						return JSON.stringify({
							id: 2,
							title: 'faa'
						});
				};
			});

			repository.restore();
			expect(repository.list().length).to.equal(2);

			stub1.restore();
			stub2.restore();
		});

		it('should restore an empty persisted repository', function() {
			var stub1 = sinon.stub(localStorage, 'setItem', function() {});
			var stub2 = sinon.stub(localStorage, 'getItem', function(key) {
				return null;
			});

			repository.restore();
			expect(repository.list().length).to.equal(0);

			stub1.restore();
			stub2.restore();
		});

		it('should handle data inconsistency', function() {
			var todo = new Todo({id:1,title:'foo'});
			var stub1 = sinon.stub(localStorage, 'setItem', function() {});
			var stub2 = sinon.stub(localStorage, 'getItem', function(key) {
				switch (key) {
					case 'todos':
						return JSON.stringify([1,2]);
					case 'todo-1':
						return todo.toJSON();
				};
				return null;
			});

			repository.restore();
			expect(repository.list().shift().serialize()).to.deep.equal(todo.serialize());

			stub1.restore();
			stub2.restore();
		});

		it('should remove stored items when removing data', function() {
			var keys = [1, 2];
			var stub1 = sinon.stub(localStorage, 'setItem', function(key, val) {
				if (key === 'todos') {
					keys = JSON.parse(val);
				}
			});
			var stub2 = sinon.stub(localStorage, 'getItem', function(key) {
				switch (key) {
					case 'todos':
						return JSON.stringify(keys);
					case 'todo-1':
						return JSON.stringify({
							id: 1,
							title: 'foo'
						});
					case 'todo-2':
						return JSON.stringify({
							id: 2,
							title: 'faa'
						});
				};
			});

			repository.restore();
			repository.remove(repository.list()[0]);

			repository.init();
			repository.restore();
			expect(repository.list()[0].id).to.equal(2);

			stub1.restore();
			stub2.restore();
		});

	});

});
