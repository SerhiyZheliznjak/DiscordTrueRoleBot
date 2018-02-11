describe("MaxDamageHit", function() {
    const nomination = require('../../../model/nominations/MaxDamageHit').create();
    let match;
  
    beforeEach(function() {
        match = require('../../helpers/TestMatchData.json');
    });
  
    it("should return null if match data is broken", function() {
      expect(nomination.getCondition()(match, 1)).toBe(null);
    });
  
    it("should return max_hit value if match data is fine", function() {
        expect(nomination.getCondition()(match, 0)).toBe(100500);
    });

    it("should return max_hit value as score", function() {
        nomination.addPoints(0, 100);
        nomination.addPoints(0, 200);
        nomination.addPoints(0, 100500);
        expect(nomination.getScore()).toBe(100500);
    });

    it("should be added to nominations list", () => {
        expect(require('../../../model/NominationsList').create().find(nom => nom.getName() === nomination.getName())).toBeDefined();
    });
  });
  