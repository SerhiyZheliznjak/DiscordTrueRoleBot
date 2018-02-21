describe("MotherOfGod", function() {
    let nomination;
    let match;
  
    beforeEach(function() {
        match = require('../../test-data/FullMatchData.json');
        nomination = require('../../../model/nominations/MotherOfGod').create();
    });

    it("should be added to nominations list", () => {
        expect(require('../../../model/NominationsList').create().find(nom => nom.getName() === nomination.getName())).toBeDefined();
    });

    it("should return 0 if player died", function () {
        expect(nomination.getCondition()(match, 1)).toBe(0);
    });

    it("should score if player has 0 deaths", function () {
        expect(nomination.getCondition()(match, 2)).toBe(1);
    });

    it("should score if player didnt die in more than 10 recent matches", function () {
        for (let i = 0; i < 11; i++) {
            nomination.scoreMatch(match, 2);
        }
        nomination.scoreMatch(match, 1);
        nomination.scoreMatch(match, 1);
        nomination.scoreMatch(match, 1);
        nomination.scoreMatch(match, 1);
        expect(nomination.getScore()).toBe(11);
        expect(nomination.isScored()).toBeTruthy();
    });

    it("should not be scored if player died in more than 10 recent matches", function () {
        for (let i = 0; i < 11; i++) {
            nomination.scoreMatch(match, 1);
        }
        nomination.scoreMatch(match, 2);
        nomination.scoreMatch(match, 2);
        nomination.scoreMatch(match, 2);
        nomination.scoreMatch(match, 2);
        expect(nomination.getScore()).toBe(4);
        expect(nomination.isScored()).toBeFalsy();
    });
  });
  