import { } from 'jasmine';
import { Nenza } from '../../nominations/Nenza';

describe('Nenza', () => {
    const nenza = new Nenza();

    beforeEach(() => {

    });
    it('should treat bad words occurences in the begginging of the line', () => {
        const msg = 'fuck you all';
        expect(nenza.isNenzaMessage(msg)).toBeTruthy();
    });

    it('should treat bad words occurences in the middle of text', () => {
        const msg = 'why are you so fucking bad';
        expect(nenza.isNenzaMessage(msg)).toBeTruthy();
    });

    it('should distingish good messages', () => {
        const msg = 'why are you so bad pida';
        expect(nenza.isNenzaMessage(msg)).toBeFalsy();
    });

    it('should treat bad words occurences in the end of text', () => {
        const msg = 'why are you so bad pidaras';
        expect(nenza.isNenzaMessage(msg)).toBeTruthy();
    });
});
