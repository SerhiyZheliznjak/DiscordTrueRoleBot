describe("Nomination", function () {
    const Nomination = require('../../model/Nomination');
    let nomination;

    beforeEach(() => {
        nomination = new Nomination('name', val => val, 'message');
    });

    it("should be constructed properly", function () {
        expect(nomination.getName()).toBe('name');
        expect(nomination.getMessage()).toBe('message');
        expect(nomination.getCondition()).toBeDefined();
    });

    it("should be able to score match points", function () {
        nomination.scoreMatch(0);
        nomination.scoreMatch(1);
        expect(nomination.getScore()).toBe(1);
    });

    it("should be corrupted if all points are null", function () {
        nomination.scoreMatch(null);
        nomination.scoreMatch(null);
        expect(nomination.isCorrupted()).toBeTruthy();
    });

    it("should be fine if some points are null", function () {
        nomination.scoreMatch(0);
        nomination.scoreMatch(null);
        expect(nomination.isCorrupted()).toBeFalsy();
    });
});
