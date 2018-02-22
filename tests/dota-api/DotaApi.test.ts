import DotaApi from '../../src/dota-api/DotaApi';
import { Observable } from 'rxjs';

let dotaApi: DotaApi;
let RxHttpRequestMock;
let httpGetObserver;

describe(`DotaApi`, () => {
    beforeEach(() => {
        setupMocks();
        dotaApi = new DotaApi(RxHttpRequestMock);
    });
    it(`should queue request`, () => {
        dotaApi.getMatch(89898).subscribe(() => {});
        dotaApi.getMatch(89898).subscribe(() => {});
        dotaApi.getMatch(777).subscribe(() => {});
        expect(DotaApi.queue.length).toBe(2);
        expect(DotaApi.queue[0].observers.length).toBe(2);
        expect(DotaApi.queue[1].observers.length).toBe(1);
    });
});

function setupMocks() {
    RxHttpRequestMock = jasmine.createSpyObj('RxHttpRequestMock', ['get']);
    RxHttpRequestMock.get.and.returnValue(Observable.create(observer => {
        httpGetObserver = observer;
    }));
}
