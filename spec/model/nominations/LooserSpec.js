describe("Looser", function () {
    const nomination = require('../../../model/nominations/Looser').create();
    let match;

    beforeEach(function () {
        match = require('../../test-data/FullMatchData.json');
    });

    it("should be added to nominations list", () => {
        expect(require('../../../model/NominationsList').create().find(nom => nom.getName() === nomination.getName())).toBeDefined();
    });

    it("should return 0 if didn't loose", () => {
        expect(nomination.getCondition()(match, 132)).toBe(0);
    });

    it("should return 1 if lost", () => {
        expect(nomination.getCondition()(match, 3)).toBe(1);
    });
});
