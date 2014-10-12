
var uuid = require('uuid');
var time = require('time');
var subscribable = require('jqb-subscribable');

var defaultValues = {
    etag: 0,
    status: false,
    skipCount: 0,
    skipDate: null
};

function Todo(data) {
    
    this.__channel = subscribable.create();
    
    this.title = data.title || '';
    
    if (data.id) {
        this.id = data.id;
    } else {
        this.id = uuid.v4();
    }
    
    if (data.etag) {
        this.etag = data.etag;
    } else {
        this.etag = defaultValues.etag;
    }
    
    if (data.status) {
        this.status = data.status;
    } else {
        this.status = defaultValues.status;
    }
    
    if (data.date) {
        this.date = new Date(data.date);
    } else {
        this.date = new Date();
    }
    
    if (data.skipCount) {
        this.skipCount = data.skipCount;
    } else {
        this.skipCount = defaultValues.skipCount;
    }
    
    if (data.skipDate) {
        this.skipDate = new Date(data.skipDate);
    } else {
        this.skipDate = defaultValues.skipDate;
    }
    
}

Todo.prototype.serialize = function() {
    return {
        id: this.id,
        etag: this.etag,
        status: this.status,
        date: this.date.getTime(),
        title: this.title,
        skipDate: this.skipDate ? this.skipDate.getTime() : '',
        skipCount: this.skipCount
    };
};

Todo.prototype.toJSON = function() {
    return JSON.stringify(this.serialize());
};

Todo.prototype.on = function(evt, cb) {
    return this.__channel.on(evt, cb);
};

Todo.prototype.dispose = function() {
    this.__channel.dispose();
};







Todo.prototype.getTitle = function() {
    return this.title;
};

Todo.prototype.getDate = function() {
    return this.date;
};




Todo.prototype.isEqual = function(todo) {
    return this.toJSON() === todo.toJSON();
};

Todo.prototype.isDone = function() {
    return this.status;
};

Todo.prototype.isArchived = function() {
    return this.skipCount >= 5;
};

Todo.prototype.isToday = function() {
    if (this.isArchived()) {
        return false;
    }
    if (!this.skipDate) {
        return true;
    }
    return time.isPast(this.skipDate);
};

Todo.prototype.isTomorrow = function() {
    if (this.isArchived()) {
        return false;
    }
    if (this.isToday()) {
        return false;
    }
    return true;
};






Todo.prototype.update = function(data) {
    var self = this;
    var before = {};
    
    ['title','status','skipCount','skipDate'].forEach(function(key) {
        if (data[key] !== undefined) {
            before[key] = self[key];
            self[key] = data[key];
        }    
    });
    
    if (Object.keys(before).length > 0) {
        this.etag++;
        this.__channel.emit('change', this, before);
        return before;
    }
    
    return false;
};













Todo.prototype.toggle = function() {
    this.update({
        status: !this.status
    });
    this.__channel.emit('change:status', this, this.status);
};

Todo.prototype.tomorrow = function() {
    if (this.isArchived()) {
        return false;
    }
    if (this.isTomorrow()) {
        return false;
    }
    var changes = this.update({
        skipCount: this.skipCount + 1,
        skipDate: time.tomorrow()
    });
    this.__channel.emit('change:list', this, 'tomorrow', changes);
    if (this.isArchived()) {
        this.__channel.emit('archived', this);
    }
    return changes;
};

Todo.prototype.today = function() {
    if (this.isArchived()) {
        return false;
    }
    if (this.isToday()) {
        return false;
    }
    var changes = this.update({
        skipCount: this.skipCount - 1,
        skipDate: null
    });
    this.__channel.emit('change:list', this, 'today', changes);
    return changes;
};

Todo.prototype.restore = function() {
    if (this.isToday()) {
        return false;
    }
    if (this.isTomorrow()) {
        return false;
    }
    var changes = this.update({
        skipCount: 0,
        skipDate: null
    });
    this.__channel.emit('change:list', this, 'today', changes);
    this.__channel.emit('unarchived', this);
    return changes;
};


module.exports = Todo;
