describe("BestKDA", function() {
    const nomination = require('../../../model/nominations/BestKDA').create();
    let match;
  
    beforeEach(function() {
        match = require('../../helpers/TestMatchData.json');
    });
  
    it("should return null if match data is broken", function() {
      expect(nomination.getCondition()(match, 1)).toBe(null);
    });
  
    it("should return kda string if match data is fine", function() {
        expect(nomination.getCondition()(match, 0)).toBe('9/6/13');
    });

    it("should return max_hit value as score", function() {
        nomination.addPoint(0, '9/6/13');
        nomination.addPoint(1, '9/1/13');
        nomination.addPoint(2, '9/0/13');
        expect(nomination.getScore()).toBe('9/0/13');
    });

    it("should be added to nominations list", () => {
        expect(require('../../../model/NominationsList').create().find(nom => nom.getName() === nomination.getName())).toBeDefined();
    });
  });
  