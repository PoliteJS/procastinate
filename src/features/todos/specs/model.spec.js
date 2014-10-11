
var time = require('time');

var TodoModel = require('todos/model');

describe('model "Todo"', function() {
    
    
    
    
    
    describe('initialize with a COMPLETE data set', function() {
        
        var date1 = new Date(2014, 9, 10, 11, 29, 51);
        var date2 = new Date(2014, 9, 9, 14, 22);
        
        // in today
        var set1 = {
            id: 'ewi-67dw',
            etag: 22,
            title: 'foo',
            status: true,
            date: date1.getTime(),
            skipDate: '',
            skipCount: 0
        };
        
        // in tomorrow
        var set2 = {
            id: 'fghj678',
            etag: 0,
            title: 'faa',
            status: false,
            date: date2.getTime(),
            skipDate: date2.getTime() + 3600000,
            skipCount: 3
        };
        
        // archived
        var set3 = {
            id: 'fghj678',
            etag: 0,
            title: 'faa',
            status: false,
            date: date2.getTime(),
            skipDate: date2.getTime() + 3600000,
            skipCount: 5
        };
        
        var todo1, todo2, todo3;
        
        beforeEach(function() {
            todo1 = new TodoModel(set1);
            todo2 = new TodoModel(set2);
            todo3 = new TodoModel(set3);
        });
        
        it('should set a given "id"', function() {
            expect(todo1.id).to.equal(set1.id);
        });
        
        it('should set a given "etag"', function() {
            expect(todo1.etag).to.equal(set1.etag);
        });
        
        it('should set a given "title"', function() {
            expect(todo1.getTitle()).to.equal(set1.title);
        });
        
        it('should set an already done item', function() {
            expect(todo1.isDone()).to.be.true;
        });
        
        it('should set a pending item', function() {
            expect(todo2.isDone()).to.be.false;
        });
        
        it('should set a given "date"', function() {
            expect(todo1.getDate()).to.deep.equal(date1);
        });
        
        it('should set a given "skipCount"', function() {
            expect(todo1.skipCount).to.equal(set1.skipCount);
        });
        
        it('should set a given "skipDate"', function() {
            expect(todo2.skipDate.getTime()).to.deep.equal(set2.skipDate);
        });
        
        it('should set a given EMPTY "skipDate"', function() {
            expect(todo1.skipDate).to.deep.equal(null);
        });
    
    });
    
    
    
    
    describe('initialize with a PARTIAL data set', function() {
        
        var todo1, todo2;
        
        beforeEach(function() {
            todo1 = new TodoModel({
                title: 'foo'
            });
            todo2 = new TodoModel({
                title: 'faa'
            });
        });
        
        it('should greate a new todo with the title only', function() {
            expect(todo1.getTitle()).to.equal('foo');
        });
        
        it('should produce an unique id', function() {
            expect(todo1.id).to.not.equal(todo2.id);
        });
        
        it('should produce a created date object', function() {
            expect(todo1.getDate()).to.be.an.instanceOf(Date);
        });
        
        it('should be pending', function() {
            expect(todo1.isDone()).to.be.false;
        });
        
        it('should NOT be done', function() {
            expect(todo1.isDone()).to.be.false;
        });
        
        it('should set a valid ETAG', function() {
            var etag = todo1.etag;
            todo1.update({
                title: 'new title'
            });    
            expect(todo1.etag - etag).to.equal(1);
        });
        
        it('should produce a valid skipCount', function() {
            var skipCount = todo1.skipCount;
            todo1.tomorrow();
            expect(todo1.skipCount - skipCount).to.equal(1);
        });
        
    });
    
    
    
    
    describe('isArchived', function() {
        
        var todo1, todo2;
        
        beforeEach(function() {
            todo1 = new TodoModel({
                title: 'foo',
                skipCount: 5
            });
            todo2 = new TodoModel({
                title: 'faa',
                skipCount: 4
            });
        });
        
        it('a new item should never be archived', function() {
            var todo = new TodoModel({});
            expect(todo.isArchived()).to.be.false;
        });
        
        it('a new item should be archived after 5 postponing', function() {
            expect(todo1.isArchived()).to.be.true;
        });
        
        it('a new item should be archived after the 5th postponing action', function() {
            todo2.tomorrow();
            expect(todo2.isArchived()).to.be.true;
        });
    
    });
    
    
    
    
    describe('isToday', function() {
        
        var todayDate = new Date(2014, 9, 15, 12, 22);
        var inTodayDate = new Date(2014, 9, 15, 17, 22);
        
        beforeEach(function() {
            time.init();
            time.setToday(todayDate);
        });
        
        after(function() {
            time.init();
        });
        
        it('a new item should be created in the same day', function() {
            var todo = new TodoModel({});
            expect(todo.isToday()).to.be.true;
        });
        
        it('an archived items should not be in today', function() {
            var todo = new TodoModel({
                skipCount: 5
            });
            expect(todo.isToday()).to.be.false;
        });
        
        it('an item which was postponed should NOT be in today', function() {
            var todo = new TodoModel({
                date: todayDate.getTime(),
                skipDate: inTodayDate.getTime()
            });
            expect(todo.isToday()).to.be.false;
        });
        
        it('in item which was postponed the day before should be in today', function() {
            time.setToday(time.tomorrow());
            var todo = new TodoModel({
                date: todayDate.getTime(),
                skipDate: inTodayDate.getTime()
            });
            expect(todo.isToday()).to.be.true;
        });
        
    });
    
    
    
    
    
    describe('isTomorrow', function() {
    
        var todayDate = new Date(2014, 9, 15, 12, 22);
        var inTodayDate = new Date(2014, 9, 15, 17, 22);
        
        beforeEach(function() {
            time.init();
            time.setToday(todayDate);
        });
        
        after(function() {
            time.init();
        });
        
        it('a new item should be created in the same day', function() {
            var todo = new TodoModel({});
            expect(todo.isTomorrow()).to.be.false;
        });
        
        it('an archived items should not be in tomorrow', function() {
            var todo = new TodoModel({
                skipCount: 5
            });
            expect(todo.isTomorrow()).to.be.false;
        });
        
        it('an item which was postponed should be be in tomorrow', function() {
            var todo = new TodoModel({
                date: todayDate.getTime(),
                skipDate: inTodayDate.getTime()
            });
            expect(todo.isTomorrow()).to.be.true;
        });
        
        it('in item which was postponed the day before should NOT be in tomorrow', function() {
            time.setToday(time.tomorrow());
            var todo = new TodoModel({
                date: todayDate.getTime(),
                skipDate: inTodayDate.getTime()
            });
            expect(todo.isTomorrow()).to.be.false;
        });
    
    });
    
    
    
});
