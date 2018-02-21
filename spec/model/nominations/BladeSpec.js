describe("Blade", function() {
    const nomination = require('../../../model/nominations/Blade').create();
    let match;
  
    beforeEach(function() {
        match = require('../../test-data/TestMatchData.json');
    });
  
    it("should be added to nominations list", () => {
        expect(require('../../../model/NominationsList').create().find(nom => nom.getName() === nomination.getName())).toBeDefined();
    });

    it("should return 0 if didn't claim first blood", function() {
      expect(nomination.getCondition()(match, 1)).toBe(0);
    });
  
    it("should return 1 value if claimed first blood", function() {
        expect(nomination.getCondition()(match, 0)).toBe(1);
    });

    it("should be able to score match points", function () {
        nomination.scoreMatch(match, 0);
        nomination.scoreMatch(require('../../test-data/FullMatchData.json'), 0);
        expect(nomination.getScore()).toBe(1);
    });
  });
  