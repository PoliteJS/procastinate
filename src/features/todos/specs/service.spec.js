describe('todos/service', function() {

	var service = require('todos/service');
	var repository = require('todos/repository');

	var todoData = {
		id: 123, 
		title: 'foo'
	};

	beforeEach(function() {
		repository.init();
		service.init();
	});

	describe('create', function() {

		describe('by USER', function() {

			it('should collect into repository', function() {
				service.createTodo(todoData);
				expect(
					repository.find(123)
				).to.have.property('id', 123);
			});

			it('should notify for ui', function(done) {
				service.on('added:todo', function(todo) {
					expect(todo).to.have.property('id', 123);
					done();
				});
				service.createTodo(todoData);
			});

			it('should notify for sync', function(done) {
				service.on('data:added:todo', function(todo) {
					expect(todo).to.have.property('id', 123);
					done();
				});
				service.createTodo(todoData);
			});

		});

		describe('by SYNC', function() {

			it('should collect into repository', function() {
				service.createTodo(todoData, true);
				expect(
					repository.find(123)
				).to.have.property('id', 123);
			});

			it('should notify for ui', function(done) {
				service.on('added:todo', function(todo) {
					expect(todo).to.have.property('id', 123);
					done();
				});
				service.createTodo(todoData, true);
			});

			it('should NOT notify for data', function() {
				var spy = sinon.spy();
				service.on('data:added:todo', spy);
				service.createTodo(todoData, true);
				expect(spy.called).to.be.false;
			});

		});

	}); // -- create
	
	describe('remove', function() {

		var todo;
		beforeEach(function() {
			todo = service.createTodo(todoData, true);
		});

		describe('by USER', function() {
			it('should be removed from repository', function() {
				expect(
					service.removeTodo(todo)
				).to.be.true;
			});
			it('should notify for ui', function(done) {
				service.on('removed:todo', function(todo) {
					expect(todo).to.have.property('id', 123);
					done();
				});
				service.removeTodo(todo);
			});
			it('should notify for data', function(done) {
				service.on('data:removed:todo', function(todo) {
					expect(todo).to.have.property('id', 123);
					done();
				});
				service.removeTodo(todo);
			});
		});

		describe('by SYNC', function() {
			it('should be removed from repository', function() {
				expect(
					service.removeTodo(todo, true)
				).to.be.true;
			});
			it('should notify for ui', function(done) {
				service.on('removed:todo', function(todo) {
					expect(todo).to.have.property('id', 123);
					done();
				});
				service.removeTodo(todo, true);
			});
			it('should NOT notify for data', function() {
				var spy = sinon.spy();
				service.on('data:removed:todo', spy);
				service.removeTodo(todo, true);
				expect(spy.called).to.be.false;
			});
		});

	});

	describe('watch', function() {
		it('should start watching', function() {
			var spy = sinon.spy();
			service.createTodo({title:'foo'});
			service.createTodo({title:'faa'});
			service.watch(spy);
			service.createTodo({title:'fii'});
			expect(spy.callCount).to.equal(3);
		});
		it('should stop watching', function() {
			var spy = sinon.spy();
			service.createTodo({title:'foo'});
			var ticket = service.watch(spy);
			service.createTodo({title:'fii'});
			ticket.dispose();
			service.createTodo({title:'faa'});
			expect(spy.callCount).to.equal(2);
		});
	});
	

});