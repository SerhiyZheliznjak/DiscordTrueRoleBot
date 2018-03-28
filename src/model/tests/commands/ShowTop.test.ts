import {} from 'jasmine';
import { ShowTop } from '../../commands/ShowTop';
import NominationResult from '../../NominationResult';

describe(``, () => {
    let processor: ShowTop;
    let clientMock;
    let dataStoreMock;
    let nominationServiceMock;
    let profileMap: Map<number, string>;
    let results: NominationResult[];

    beforeEach(() => {
        setupTestData();
        setupMocks();
        processor = new ShowTop(clientMock, dataStoreMock, nominationServiceMock);
    });

    it(`should getLongestLength`, () => {
        expect(processor.getLongestLength(profileMap)).toBe(5);
    });
    it(`should `, () => {

    });
    it(`should `, () => {

    });

    function setupMocks() {
        clientMock = jasmine.createSpyObj('clientMock', ['']);
        dataStoreMock = jasmine.createSpyObj('dataStoreMock', ['']);
        nominationServiceMock = jasmine.createSpyObj('nominationServiceMock', ['']);
    }

    function setupTestData() {
        profileMap = new Map();
        profileMap.set(1, 'abc');
        profileMap.set(1, 'abcde');
        results = [];
    }
});
