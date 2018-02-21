describe("MaxDamageHit", function () {
    let match;
    let nomination;

    beforeEach(function () {
        match = require('../../test-data/TestMatchData.json');
        nomination = require('../../../model/nominations/MaxDamageHit').create();
    });

    it("should return null if match data is broken", function () {
        expect(nomination.getCondition()(match, 1)).toBe(null);
    });

    it("should return max_hit value if match data is fine", function () {
        expect(nomination.getCondition()(match, 0)).toBe(100500);
    });

    it("should return max_hit value as score", function () {
        nomination.addPoint(0, 100);
        nomination.addPoint(0, 200);
        nomination.addPoint(0, 100500);
        expect(nomination.getScore()).toBe(100500);
    });

    it("should be added to nominations list", () => {
        expect(require('../../../model/NominationsList').create().find(nom => nom.getName() === nomination.getName())).toBeDefined();
    });

    it('should treat as unscored if no AMs killed', () => {
        nomination.addPoint(0, 100);
        nomination.addPoint(0, 200);
        expect(nomination.isScored()).toBeFalsy();
    });

    it('should treat as scored if at least one AM killed', () => {
        nomination.addPoint(0, 100);
        nomination.addPoint(0, 1000);
        nomination.addPoint(0, 200);
        expect(nomination.isScored()).toBeTruthy();
    });

    it('should say how much AMs were killed by that dmg in message', () => {
        nomination.addPoint(0, 100);
        nomination.addPoint(0, 200);
        expect(nomination.getMessage()).toBe('Йобне раз, але сильно. Вбив 0.31 антимагів одиним ударом!');
    });
});
