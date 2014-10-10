
var uuid = require('uuid');

var defaultValues = {
    etag: 0,
    status: false,
    skipCount: 0,
    skipDate: null
};

function Todo(data) {
    
    if (data.id !== undefined) {
        this.id = data.id;
    } else {
        this.id = uuid.v4();
    }
    
    if (data.etag !== undefined) {
        this.etag = data.etag;
    } else {
        this.etag = defaultValues.etag;
    }
    
    this.title = data.title;
    
    if (data.status !== undefined) {
        this.status = data.status;
    } else {
        this.status = defaultValues.status;
    }
    
    if (data.date !== undefined) {
        this.date = new Date(data.date);
    } else {
        this.date = new Date();
    }
    
    if (data.skipCount !== undefined) {
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

Todo.prototype.update = function(data) {
    
    this.title = data.title;
    
    this.etag++;
};

Todo.prototype.tomorrow = function(data) {
    this.skipCount++;
};



module.exports = Todo;
