describe("Nomination", function () {
    const Nomination = require('../../model/Nomination');
    const Point = require('../../model/Point');
    let nomination;

    beforeEach(() => {
        nomination = new Nomination('name', match => match.point, 10, 'message');
    });

    it("should be constructed properly", function () {
        expect(nomination.getName()).toBe('name');
        expect(nomination.getMessage()).toBe('message 0');
        expect(nomination.getCondition()).toBeDefined();
    });

    it("should be able to score match points", function () {
        nomination.scoreMatch({match_id: 1, point: 0});
        nomination.scoreMatch({match_id: 2, point: 1});
        expect(nomination.getScore()).toBe(1);
    });

    it("should be corrupted if all points are null", function () {
        nomination.scoreMatch({match_id: 1, point: null});
        nomination.scoreMatch({match_id: 2, point: null});
        expect(nomination.isCorrupted()).toBeTruthy();
    });

    it("should be fine if some points are null", function () {
        nomination.scoreMatch({match_id: 1, point: 0});
        nomination.scoreMatch({match_id: 1, point: null});
        expect(nomination.isCorrupted()).toBeFalsy();
    });
});
