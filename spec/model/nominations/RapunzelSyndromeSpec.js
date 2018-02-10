describe("RapunzelSyndrome", function() {
    const nomination = require('../../../model/nominations/RapunzelSyndrome').create();
    let match;
  
    beforeEach(function() {
        match = require('../../helpers/FullMatchData.json');
    });
  
    it("should be added to nominations list", () => {
        expect(require('../../../model/NominationsList').create().find(nom => nom.getName() === nomination.getName())).toBeDefined();
    });

    it("should return 0 if missed a tower last hit", function() {
      expect(nomination.getCondition()(match, 3)).toBe(0);
    });
  
    it("should return 1 if killed every tower", function() {
        expect(nomination.getCondition()(match, 128)).toBe(1);
    });
  });
  