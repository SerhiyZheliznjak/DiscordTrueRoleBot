describe("JungleOppressor", function() {
    const nomination = require('../../../model/nominations/JungleOppressor').create();
    let match;
  
    beforeEach(function() {
        match = require('../../helpers/FullMatchData.json');
    });
  
    it("should be added to nominations list", () => {
        expect(require('../../../model/NominationsList').create().find(nom => nom.getName() === nomination.getName())).toBeDefined();
    });

    it("should return 0 if played dota", function() {
      expect(nomination.getCondition()(match, 132)).toBe(0);
    });
  
    it("should return 1 if did more damage to jungle than to enemy", function() {
        expect(nomination.getCondition()(match, 3)).toBe(1);
    });
  });
  