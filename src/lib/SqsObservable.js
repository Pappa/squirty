import { Observable } from "rxjs";

class SqsObservable {
    constructor(options, queue) {
        this.options = options;
        this.queue = queue;
        this.shouldPoll = false;
        
        return Observable.create((observer) => {
        
            const onMessage = (data) => {
                observer.next(data);
            };
        
            const onError = (e) => {
                this.shouldPoll = false;
                observer.error(e); // TODO: observable contract
                observer.complete();
            };

            const pollForMessages = () => {
                this.queue.receiveMessage(this.options, (e, data) => {
                    if (e) {
                        onError(e);
                    } else {
                        onMessage(data);
                        if (this.shouldPoll) {
                            pollForMessages();
                        }
                    }
                  });
            };

            pollForMessages();

			return () => {
                this.shouldPoll = false;
			};
		});
    }
  }

  const sqsObservable = {
    create: (options, queue) => new SqsObservable(options, queue)
  };

  export default sqsObservable;
  