import {} from 'jasmine';
import Nominations from '../Nominations';

describe(``, () => {
    it(`should get list of all nominations`, () => {
        expect(Nominations.all.length).toBe(25);
    });

    it(`should have nominations with getScoreText implemented`, () => {
        Nominations.all.forEach(nomination => {
            expect(() => nomination.getScoreText()).not.toThrow();
        });
    });

    it(`should have nominations with getScoreDescription implemented`, () => {
        Nominations.all.forEach(nomination => {
            expect(() => nomination.getScoreDescription()).not.toThrow();
        });
    });

    it(`should have nominations with getThumbURL implemented`, () => {
        Nominations.all.forEach(nomination => {
            expect(() => nomination.getThumbURL()).not.toThrow();
        });
    });

    it(`should have nominations with scorePoint implemented`, () => {
        Nominations.all.forEach(nomination => {
            expect(() => nomination.scorePoint(undefined, 0)).not.toThrow();
        });
    });
});
