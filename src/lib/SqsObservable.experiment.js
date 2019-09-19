import { Observable } from "rxjs";
import { of, from, bindCallback } from "rxjs";

export const create = (options, queue) => {
  return from(queue.receiveMessage(options).promise());
};

/// .pipe(repeatWhen(() => shouldPoll ? of(true) : EMPTY)

// const poll = of({}).pipe(
//     mergeMap(_ => fakeDelayedRequest()),
//     tap(display),
//     delay(3000),
//     repeat()
//   );
