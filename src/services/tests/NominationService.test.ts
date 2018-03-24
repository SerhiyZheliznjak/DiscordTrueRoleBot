import {} from 'jasmine';
import NominationService from "../../services/NominationService";
import { Observable, Observer } from "rxjs";
import { MatchJson } from "../../dota-api/DotaJsonTypings";
import NominationResult from '../../model/NominationResult';
import PlayerFullMatches from '../../model/PlayerFullMatches';

describe(`NominationService`, () => {
    let service: NominationService;
    let dataStoreMock;
    let dotaApiMock;
    let nominationUtilsMock;
    let getMatchesObserver: Observer<MatchJson>;
    let playersMatches: PlayerFullMatches[];
    let hallOfFame: Map<number, NominationResult>;

    beforeEach(() => {
        setupTestData();
        setupMocks();
        service = new NominationService(dataStoreMock, dotaApiMock, nominationUtilsMock);
    });

    it(`should getNewRecords`, () => {

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
        dotaApiMock = jasmine.createSpyObj(`dotaApiMock`, ['']);
        nominationUtilsMock = jasmine.createSpyObj(`nominationUtilsMock`, ['']);
    }

    function setupTestData() {
        playersMatches = [];
        hallOfFame = new Map<number, NominationResult>();
    }
});
