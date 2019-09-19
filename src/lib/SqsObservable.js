import { Observable } from "rxjs";

class SqsObservable {
  constructor(options, queue) {
    this.options = options;
    this.queue = queue;
    this.shouldPoll = false;

    return Observable.create(observer => {
      const onMessage = message => {
        observer.next(message);
      };

      const onError = e => {
        this.shouldPoll = false;
        observer.error(e); // TODO: observable contract
        observer.complete();
      };

      const deleteMessage = message => {
        const options = {
          QueueUrl: this.options.QueueUrl,
          ReceiptHandle: message.ReceiptHandle
        };

        this.queue.deleteMessage(options, e => {
          if (e) {
            onError(e);
          }
        });
      };

      const handleMessages = data => {
        if (data && data.Messages && data.Messages.length) {
          data.Messages.forEach(message => {
            deleteMessage(message);
            onMessage(message);
          });
        }
      };

      const pollForMessages = () => {
        this.queue.receiveMessage(this.options, (e, data) => {
          if (e) {
            onError(e);
          } else {
            handleMessages(data);
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

/// .pipe(repeatWhen(() => shouldPoll ? of(true) : EMPTY)

// const poll = of({}).pipe(
//     mergeMap(_ => fakeDelayedRequest()),
//     tap(display),
//     delay(3000),
//     repeat()
//   );
