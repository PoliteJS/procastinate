var time = require('time');

describe('time', function() {
    
    var now = new Date();
    var adate = new Date(2013, 9, 5, 12, 55, 22);
    var inToday = new Date(2013, 9, 5, 16, 55, 22);
    var inTomorrow = new Date(2013, 9, 6, 10, 55, 22);
    var inYesterday = new Date(2013, 9, 4, 23, 59, 22);
    var inFuture = new Date(2013, 10, 6, 10, 55, 22);
    var inPast = new Date(2012, 10, 6, 10, 55, 22);
    
    beforeEach(function() {
        time.init();
    });
    
    it('should get a real today date', function() {
        var diff = Math.abs(now.getTime() - time.today().getTime());
        expect(diff).to.be.below(1000);
    });
    
    it('should calculate a 24h date as "tomorrow"', function() {
        var diff = Math.abs(now.getTime() - time.tomorrow().getTime());
        expect(diff).to.be.at.least(86400000);
    });
    
    it('should set a today date', function() {
        time.setToday(adate);
        expect(time.today()).to.equal(adate);
    });
    
    describe('detect dates', function() {
        
        beforeEach(function() {
            time.setToday(adate);
        });
        
        describe('isToday', function() {

            it('should validate a "today" date', function() {
                expect(time.isToday(inToday)).to.be.true;
            });

            it('should NOT validate a "tomorrow" date', function() {
                expect(time.isToday(inTomorrow)).to.be.false;
            });
            
            it('should NOT validate a "yesterday" date', function() {
                expect(time.isToday(inYesterday)).to.be.false;
            });
            
            it('should NOT validate a "future" date', function() {
                expect(time.isToday(inFuture)).to.be.false;
            });
            
            it('should NOT validate a "past" date', function() {
                expect(time.isToday(inPast)).to.be.false;
            });

        });
        
        describe('isTomorrow', function() {
            
            it('should validate a "tomorrow" date', function() {
                expect(time.isTomorrow(inTomorrow)).to.be.true;
            });
            
            it('should NOT validate a "today" date', function() {
                expect(time.isTomorrow(inToday)).to.be.false;
            });
            
            it('should NOT validate a "yesterday" date', function() {
                expect(time.isTomorrow(inYesterday)).to.be.false;
            });
            
            it('should NOT validate a "future" date', function() {
                expect(time.isTomorrow(inFuture)).to.be.false;
            });
            
            it('should NOT validate a "past" date', function() {
                expect(time.isTomorrow(inPast)).to.be.false;
            });
        
        });

    });
    
});