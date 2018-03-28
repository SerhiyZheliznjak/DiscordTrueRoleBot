import {} from 'jasmine';
import { DiscordUtils } from '../DiscordUtils';

describe(`NominationUtils`, () => {
    beforeEach(() => {
        setupTestData();
    });

    it(`should prepend with spaces to desired length`, () => {
        const boosted = DiscordUtils.fillWithSpaces('abc', 5);
        expect(boosted).toEqual('abc  ');
    });

    it(`should not prepend with spaces if already desired length`, () => {
        const boosted = DiscordUtils.fillWithSpaces('abcde', 5);
        expect(boosted).toEqual('abcde');
    });

    it(`should not prepend with spaces if more than desired length`, () => {
        const boosted = DiscordUtils.fillWithSpaces('abcde', 3);
        expect(boosted).toEqual('abcde');
    });

    it(`should get longest length`, () => {
        const longest = DiscordUtils.getLongestLength(['1', '11', '3333', '3']);
        expect(longest).toEqual(4);
    });

    function setupTestData() {
    }
});
