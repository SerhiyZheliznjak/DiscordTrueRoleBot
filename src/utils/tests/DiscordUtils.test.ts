import {} from 'jasmine';
import { DiscordUtils } from '../DiscordUtils';

describe(`NominationUtils`, () => {
    beforeEach(() => {
        setupTestData();
    });

    it(`should get longest length`, () => {
        const longest = DiscordUtils.getLongestLength(['1', '11', '3333', '3']);
        expect(longest).toEqual(4);
    });

    function setupTestData() {
    }
});
