/**
 * Utility feature for today/tomorrow tasks
 */

var today;

exports.init = function() {
    today = new Date();
};

exports.today = function() {
    return today;
};

exports.tomorrow = function() {
    return new Date(today.getTime() + 86400000);
}

exports.setToday = function(d) {
    today = d;
};

exports.isToday = function(d) {
    return sameDay(d, today);
};

exports.isTomorrow = function(d) {
    var tomorrow = this.tomorrow();
    return sameDay(d, new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 0, 0, 0, 0, 0));
};

exports.isPast = function(d) {
    var diff = d.getTime() - today.getTime();
    return diff <= 0;
};

function sameDay(d1, d2) {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDay() === d2.getDay()
    );
}