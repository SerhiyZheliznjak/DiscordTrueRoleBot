import {} from 'jasmine';
import NominationService from "../../services/NominationService";
import { Observable, Observer } from "rxjs";
import { MatchJson } from "../../dota-api/DotaJsonTypings";

describe(`NominationService`, () => {
    let service;
    let dataStoreMock;
    let getMatchesObserver: Observer<MatchJson>;

    beforeEach(() => {
        setupTestData();
        setupMocks();
        service = new NominationService(dataStoreMock);
    });

    it(`should `, () => {

    });

    it(`should `, () => {

    });

    it(`should `, () => {

    });

    function setupMocks() {
        dataStoreMock = jasmine.createSpyObj('dataStoreMock', ['getMatches']);
        dataStoreMock.getMatches.and.callFake((matchesIds: number[]) => {
            return Observable.create(observer => {
                getMatchesObserver = observer;
            });
        });
    }

    function setupTestData() {

    }
});
