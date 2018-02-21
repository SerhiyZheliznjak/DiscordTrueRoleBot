describe("Rage", function() {
    const nomination = require('../../../model/nominations/Rage').create();
    // let match;
  
    // beforeEach(function() {
    //     match = require('../../test-data/TestMatchData.json');
    // });

    it("should be added to nominations list", () => {
        expect(require('../../../model/NominationsList').create().find(nom => nom.getName() === nomination.getName())).toBeDefined();
    });
  });
  