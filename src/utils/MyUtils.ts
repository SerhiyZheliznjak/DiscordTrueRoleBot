import { Observable } from "rxjs";

export default class MyUtils {
    public static subscriptionChain<T>(observables: Observable<T>[], next: (t: T) => void, complete: () => void) {
        const nextObservable = observables.shift();
        if (nextObservable) {
            nextObservable.subscribe(result => {
                next(result);
                this.subscriptionChain(observables, next, complete);
            });
        } else {
            complete();
        }
    }
}
