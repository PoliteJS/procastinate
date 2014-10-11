
var uuid = require('uuid');
var time = require('time');

var defaultValues = {
    etag: 0,
    status: false,
    skipCount: 0,
    skipDate: null
};

function Todo(data) {
    
    this.title = data.title;
    
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





Todo.prototype.getTitle = function() {
    return this.title;
};

Todo.prototype.getDate = function() {
    return this.date;
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
    this.etag++;
};

Todo.prototype.tomorrow = function(data) {
    this.skipCount++;
};



module.exports = Todo;
