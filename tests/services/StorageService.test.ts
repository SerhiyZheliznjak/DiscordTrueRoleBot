import StorageService from "../../src/services/StorageService";
import Constants from "../../src/Constants";

describe(`StorageService`, () => {

    let mongodbMock;

    let recentMatches;
    let winners;
    let service: StorageService;

    beforeEach(() => {
        setupTestData();
        setupMocks();
        service = new StorageService(); // mongodbMock
    });

    describe(`should getRecentMatches`, () => {
        it(`create empty directory and return empty table`, () => {
            // existsSpy.and.returnValue(false);
            // const result = service.getRecentMatches();
            // expect(existsSpy).toHaveBeenCalledWith(Constants.RECENT_MATCHES);
            // expect(mkdirpSpy).toHaveBeenCalledWith(getDirictories(Constants.RECENT_MATCHES));
            // expect(result).toEqual([]);
        });
        it(`read file and convert to json`, () => {
            // existsSpy.and.returnValue(true);
            // readFileSpy.and.returnValue(JSON.stringify(recentMatches));
            // const result = service.getRecentMatches();
            // expect(existsSpy).toHaveBeenCalledWith(Constants.RECENT_MATCHES);
            // expect(readFileSpy).toHaveBeenCalledWith(Constants.RECENT_MATCHES, 'utf8');
            // expect(mkdirpSpy).not.toHaveBeenCalled();
            // expect(result).toEqual(recentMatches.table);
        });
    });

    describe(`should saveRecentMatches`, () => {
        // it(`create empty directory and return empty table`, () => {

        // });
        // it(`read file and convert to json`, () => {

        // });
    });

    describe(`should saveWinners`, () => {
        // it(`create empty directory and return empty table`, () => {

        // });
        // it(`read file and convert to json`, () => {

        // });
    });

    describe(`should getWinners`, () => {
        // it(`create empty directory and return empty table`, () => {
        //     existsSpy.and.returnValue(false);
        //     const result = service.getWinners();
        //     expect(existsSpy).toHaveBeenCalledWith(Constants.WINNERS_FILE_PATH);
        //     expect(mkdirpSpy).toHaveBeenCalledWith(getDirictories(Constants.WINNERS_FILE_PATH));
        //     expect(result).toEqual([]);
        // });
        // it(`read file and convert to json`, () => {
        //     existsSpy.and.returnValue(true);
        //     readFileSpy.and.returnValue(JSON.stringify(winners));
        //     const result = service.getWinners();
        //     expect(existsSpy).toHaveBeenCalledWith(Constants.WINNERS_FILE_PATH);
        //     expect(readFileSpy).toHaveBeenCalledWith(Constants.WINNERS_FILE_PATH, 'utf8');
        //     expect(mkdirpSpy).not.toHaveBeenCalled();
        //     expect(result).toEqual(winners.table);
        // });
    });

    function setupMocks() {
        mongodbMock = jasmine.createSpyObj('mongodbMock', ['']);
    }

    function setupTestData() {
        recentMatches = { table: [{ match_id: 898989898 }] };
        winners = {table: [{account_id: 998989}]};
    }

    function getDirictories(filePath: string): string {
        const pathToCreate = filePath.split('/');
        pathToCreate.pop();
        return pathToCreate.join('/');
    }
});
