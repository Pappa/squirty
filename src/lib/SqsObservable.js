import { Observable, Subscriber } from "rxjs";

export default class SqsObservable {
    constructor(options, queue) {
        this.options = options;
        this.queue = queue;
        
        return Observable.create((observer) => {
            const subscriber = new Subscriber(openObserver);
            
            const onOpen = (event) => {
                subscriber.next(event);
                subscriber.complete();
            };
        
            const onMessage = (message) => {
                observer.next(JSON.parse(message));
            };
        
            const onError = (error) => {
                observer.error(error); // TODO: observable contract
                observer.complete();
            };

			return () => {
				// unsubscribe
			};
		});
    }
  
    static create = (options, queue) => new SqsObservable(options, queue);
  }
  