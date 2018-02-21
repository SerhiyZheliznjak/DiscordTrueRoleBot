describe("BestKDA", function() {
    const BestKDA = require('../../../model/nominations/BestKDA');
    const CONST = require('../../../constants');
    let nomination;
    let match;
  
    beforeEach(function() {
        match = require('../../test-data/TestMatchData.json');
        nomination = BestKDA.create();
    });

    it("should be added to nominations list", () => {
        expect(require('../../../model/NominationsList').create().find(nom => nom.getName() === nomination.getName())).toBeDefined();
    });

    it("should return null if match data is broken", function() {
      expect(nomination.getCondition()(match, 1)).toBe(null);
    });
  
    it("should return kda string if match data is fine", function() {
        expect(nomination.getCondition()(match, 0)).toBe('9/6/13/'+ CONST.WON());
    });

    it("should return top kda as score", function() {
        nomination.addPoint(0, '9/6/13/'+ CONST.WON());
        nomination.addPoint(1, '9/1/13');
        nomination.addPoint(2, '9/0/13/' + CONST.LOST());
        expect(nomination.getScore()).toBe('9/0/13/' + CONST.LOST());
    });

    it("should distinguish higher scores", () => {
        nomination.addPoint(0, '9/6/13/'+ CONST.WON());
        nomination.addPoint(1, '9/1/13');
        nomination.addPoint(2, '9/0/13/' + CONST.LOST());
        const other = BestKDA.create();
        other.addPoint(0, '9/6/13/'+ CONST.WON());
        other.addPoint(1, '9/1/13');
        other.addPoint(2, '9/0/14/' + CONST.LOST());
        expect(nomination.hasHigherScoreThen(other)).toBeFalsy();
        expect(other.hasHigherScoreThen(nomination)).toBeTruthy();
        nomination.addPoint(3, '10/0/15/' + CONST.LOST());
        expect(nomination.hasHigherScoreThen(other)).toBeTruthy();
    });

    it("should distinguish higher having string as input", () => {
        nomination.addPoint(0, '9/6/13/'+ CONST.WON());
        nomination.addPoint(1, '9/1/13');
        nomination.addPoint(2, '9/0/13/' + CONST.LOST());
        expect(nomination.isMyScoreHigher('9/0/14/'+ CONST.LOST())).toBeFalsy();
        nomination.addPoint(3, '10/0/15/' + CONST.LOST());
        expect(nomination.isMyScoreHigher('9/0/14/'+ CONST.LOST())).toBeTruthy();
    });

    it("should distinguish if it has valid score", () => {
        expect(nomination.isScored()).toBeFalsy();
        nomination.addPoint(0, '0/0/0/'+ CONST.WON());
        expect(nomination.isScored()).toBeFalsy();
        nomination.addPoint(1, '9/1/13');
        expect(nomination.isScored()).toBeTruthy();                
    });
  });
  