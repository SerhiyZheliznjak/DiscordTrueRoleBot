describe("Donor", function() {
    const nomination = require('../../../model/nominations/Donor').create();
    let match;
  
    beforeEach(function() {
        match = require('../../helpers/FullMatchData.json');
    });
  
    it("should be added to nominations list", () => {
        expect(require('../../../model/NominationsList').create().find(nom => nom.getName() === nomination.getName())).toBeDefined();
    });

    it("should return 0 if didn't give first blood", function() {
      expect(nomination.getCondition()(match, 132)).toBe(0);
    });
  
    it("should return 1 value if gave first blood", function() {
        expect(nomination.getCondition()(match, 3)).toBe(1);
    });
  });
  