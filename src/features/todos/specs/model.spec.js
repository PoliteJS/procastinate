
var time = require('time');

var TodoModel = require('todos/model');

describe('model "Todo"', function() {
    
    var __NEW_TODO__, 
        __ARCHIVED_TODO__,
        __NEARLY_ARCHIVED_TODO__,
        __POSTPONED_TODO__;
    
    var __DATE_TODAY__ = new Date(2014, 9, 22, 12, 30, 0);
    var __DATE_IN_TODAY__ = new Date(2014, 9, 22, 12, 30, 0);
    var __DATE_TOMORROW__ = new Date(2014, 9, 23, 12, 30, 0);
    var __DATE_IN_TOMORROW__ = new Date(2014, 9, 23, 10, 30, 0);
    var __DATE_YESTERDAY__ = new Date(2014, 9, 21, 12, 30, 0);
    var __DATE_IN_YESTERDAY__ = new Date(2014, 9, 21, 15, 30, 0);
    var __DATE_IN_YESTERDAY__ = new Date(2014, 9, 21, 15, 30, 0);
    var __DATE_FUTURE__ = new Date(2014, 10, 21, 15, 30, 0);
    var __DATE_PAST__ = new Date(2014, 8, 21, 15, 30, 0);
    
    before(function() {
        time.init();
    });
    
    after(function() {
        time.init();
    });
    
    beforeEach(function() {
        time.setToday(__DATE_TODAY__);
        __NEW_TODO__ = new TodoModel({});
        __DONE_TODO__ = new TodoModel({status:true});
        __ARCHIVED_TODO__ = new TodoModel({skipCount:5});
        __NEARLY_ARCHIVED_TODO__ = new TodoModel({skipCount:4});
        __POSTPONED_TODO__ = new TodoModel({
            skipCount: 1,
            skipDate: __DATE_TOMORROW__.getTime()
        });
    });
    
    afterEach(function() {
        time.init();
    });
    
    describe('initialize with a COMPLETE data set', function() {
        
        // in today
        var set1 = {
            id: 'ewi-67dw',
            etag: 22,
            title: 'foo',
            status: true,
            date: __DATE_TODAY__.getTime(),
            skipDate: '',
            skipCount: 0
        };
        
        // in tomorrow
        var set2 = {
            id: 'fghj678',
            etag: 0,
            title: 'faa',
            status: false,
            date: __DATE_YESTERDAY__.getTime(),
            skipDate: __DATE_TODAY__.getTime(),
            skipCount: 3
        };
        
        // archived
        var set3 = {
            id: 'kk678',
            etag: 0,
            title: 'faa',
            status: false,
            date: __DATE_YESTERDAY__.getTime(),
            skipDate: __DATE_TODAY__.getTime(),
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
            expect(todo1.getDate()).to.deep.equal(__DATE_TODAY__);
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
    
    
    
    
    describe('isArchived()', function() {
        
        it('a new item should never be archived', function() {
            expect(__NEW_TODO__.isArchived()).to.be.false;
        });
        
        it('a new item should be archived after 5 postponing', function() {
            expect(__ARCHIVED_TODO__.isArchived()).to.be.true;
        });
        
        it('a new item should be archived after the 5th postponing action', function() {
            __NEARLY_ARCHIVED_TODO__.tomorrow();
            expect(__NEARLY_ARCHIVED_TODO__.isArchived()).to.be.true;
        });
    
    });
    
    
    
    
    describe('isToday()', function() {
        
        it('a new item should be created in the same day', function() {
            expect(__NEW_TODO__.isToday()).to.be.true;
        });
        
        it('an archived items should not be in today', function() {
            expect(__ARCHIVED_TODO__.isToday()).to.be.false;
        });
        
        it('an item which was postponed should NOT be in today', function() {
            expect(__POSTPONED_TODO__.isToday()).to.be.false;
        });
        
        it('in item which was postponed the day before should be in today', function() {
            time.setToday(__DATE_TOMORROW__);
            expect(__POSTPONED_TODO__.isToday()).to.be.true;
        });
        
    });
    
    
    
    
    
    describe('isTomorrow()', function() {
        
        it('a new item should be created in the same day', function() {
            expect(__NEW_TODO__.isTomorrow()).to.be.false;
        });
        
        it('an archived items should not be in tomorrow', function() {
            expect(__ARCHIVED_TODO__.isTomorrow()).to.be.false;
        });
        
        it('an item which was postponed should be be in tomorrow', function() {
            expect(__POSTPONED_TODO__.isTomorrow()).to.be.true;
        });
        
        it('in item which was postponed the day before should NOT be in tomorrow', function() {
            time.setToday(__DATE_TOMORROW__);
            expect(__POSTPONED_TODO__.isTomorrow()).to.be.false;
        });
    
    });
    
    
    
    
    
    
    describe('toggle()', function() {
        
        it('should toggle a new todo to be done', function() {
            __NEW_TODO__.toggle();
            expect(__NEW_TODO__.isDone()).to.be.true; 
        });
        
        it('should toggle a done todo to be undone', function() {
            __DONE_TODO__.toggle();
            expect(__DONE_TODO__.isDone()).to.be.false; 
        });
    
    });
    
    
    
    
    describe('tomorrow()', function() {
        
        it('should postpone a new todo', function() {
            __NEW_TODO__.tomorrow();
            expect(__NEW_TODO__.isTomorrow()).to.be.true;
        });
        
        it('should NOT postpone an archived new todo', function() {
            expect(__ARCHIVED_TODO__.tomorrow()).to.be.false;
        });
        
        it('should NOT postpone an already postponed todo', function() {
            expect(__POSTPONED_TODO__.tomorrow()).to.be.false;
        });
    
    });
    
    
    
    
    describe('today()', function() {
        
        it('should reset a posponed todo', function() {
            __POSTPONED_TODO__.today();
            expect(__POSTPONED_TODO__.isToday()).to.be.true;
        });
        
        it('should NOT reset an archived todo', function() {
            expect(__ARCHIVED_TODO__.today()).to.be.false;
        });
        
        it('should NOT reset a new todo', function() {
            expect(__NEW_TODO__.today()).to.be.false;
        });
        
    });
    
    
    
    describe('restore()', function() {
        
        it('should restore an archived todo', function() {
            __ARCHIVED_TODO__.restore();
            expect(__ARCHIVED_TODO__.isToday()).to.be.true;
        });
        
        it('should NOT restore an new todo', function() {
            expect(__NEW_TODO__.restore()).to.be.false;
        });
        
        it('should NOT restore a postponed todo', function() {
            expect(__POSTPONED_TODO__.restore()).to.be.false;
        });
    
    });
    
    
    
    describe('update()', function() {
        
        // status, skipDate, skipCount are already covered by existing tests
        it('should update title property', function() {
            __NEW_TODO__.update({title:'faa'});
            expect(__NEW_TODO__.getTitle()).to.equal('faa');
        });
        
        it('should update ETAG', function() {
            var etag = __NEW_TODO__.etag;
            __NEW_TODO__.update({title:'foo'});
            expect(__NEW_TODO__.etag - etag).to.equal(1);
        });
        
        it('should NOT update ETAG if there is no changes', function() {
            var etag = __NEW_TODO__.etag;
            __NEW_TODO__.update({});
            expect(__NEW_TODO__.etag - etag).to.equal(0);
        });
        
        it('should collect a list of changed properties', function() {
            var changes = __NEW_TODO__.update({title:'foo'});
            expect(changes).to.contain.key('title');
        });
        
        it('should collect a list of changed properties with former values', function() {
            __NEW_TODO__.update({title:'foo'});
            var changes = __NEW_TODO__.update({title:'faa'});
            expect(changes.title).to.equal('foo');
        });
        
    });
    
    
    
    describe('serialize()', function() {
        
        var data = {
            id: 'skur-344-ft-2344',
            title: 'foo',
            status: true,
            date: __DATE_TODAY__.getTime(),
            skipDate: __DATE_IN_TOMORROW__.getTime(),
            skipCount: 3,
            etag: 22
        };
        
        it('should provide a flat data representation', function() {
            var todo = new TodoModel(data);
            expect(todo.serialize()).to.deep.equal(data);
        });
        
        it('should serialize an today todo', function() {
            var todo = new TodoModel({
                id: 'skur-344-ft-2344',
                title: 'foo',
                date: __DATE_TODAY__.getTime()
            });
            expect(todo.serialize()).to.deep.equal({
                id: 'skur-344-ft-2344',
                title: 'foo',
                status: false,
                date: __DATE_TODAY__.getTime(),
                skipDate: '',
                skipCount: 0,
                etag: 0
            });
        });
        
        it('should be user to rebuild the same object', function() {
            var todo1 = new TodoModel(data);
            var todo2 = new TodoModel(todo1.serialize());
            expect(todo1.isEqual(todo2)).to.be.true;
        });
    
    });
    
    
    describe('dispose()', function() {
        
        it('dispose subscriptions', function() {
            var subscription = __NEW_TODO__.on('change', function() {});
            var stub = sinon.stub(subscription, 'dispose');
            __NEW_TODO__.dispose();
            expect(stub.called).to.be.true;
            stub.restore();
        });
        
    });
    
    
    describe('subscriptions', function() {
        
        it('should trigger a "change" event', function(done) {
            __NEW_TODO__.on('change', function(todo, changes) {
                expect(todo).to.equal(__NEW_TODO__);
                done();
            });
            __NEW_TODO__.update({title:'haha'});
        });
        
        it('should trigger a "change" event with changed properties', function(done) {
            __NEW_TODO__.on('change', function(todo, changes) {
                expect(changes).to.contain.key('title');
                done();
            });
            __NEW_TODO__.update({title:'haha'});
        });
        
        it('should communicate a new status', function(done) {
            __NEW_TODO__.on('change:status', function() {
                done();
            });
            __NEW_TODO__.toggle();
        });
        
        it('should communicate a LIST CHANGE when postponed', function(done) {
            __NEW_TODO__.on('change:list', function() {
                done();
            });
            __NEW_TODO__.tomorrow();
        });
        
        it('should communicate a LIST CHANGE when set back to today', function(done) {
            __POSTPONED_TODO__.on('change:list', function() {
                done();
            });
            __POSTPONED_TODO__.today();
        });
        
        it('should communicate a LIST CHANGE when unarchived', function(done) {
            __ARCHIVED_TODO__.on('change:list', function() {
                done();
            });
            __ARCHIVED_TODO__.restore();
        });
        
        it('should communicate when a todo get ARCHIVED', function(done) {
            __NEARLY_ARCHIVED_TODO__.on('archived', function() {
                done();
            });
            __NEARLY_ARCHIVED_TODO__.tomorrow();
        });
        
        it('should communicate when a todo get UNARCHIVED', function(done) {
            __ARCHIVED_TODO__.on('unarchived', function() {
                done();
            });
            __ARCHIVED_TODO__.restore();
        });
        
    });
    
});
