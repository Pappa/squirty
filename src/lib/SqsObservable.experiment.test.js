import sinon from "sinon";
import { expect } from "chai";
import { of, from, bindCallback } from "rxjs";
import {
  take,
  toArray,
  delay,
  map,
  repeat,
  tap,
  catchError
} from "rxjs/operators";
import { create } from "./SqsObservable.experiment";

let sandbox;

const resolve = data =>
  sandbox.stub().returns({ promise: sandbox.stub().resolves(data) });

const reject = e =>
  sandbox.stub().returns({ promise: sandbox.stub().rejects(e) });

describe("Squirty", () => {
  let options = {
    QueueUrl: "url",
    WaitTimeSeconds: 1,
    MaxNumberOfMessages: 10
  };
  let queue;
  const messages = {
    ResponseMetadata: {
      RequestId: "xyz"
    },
    Messages: [
      {
        MessageId: "xyz1",
        ReceiptHandle: "xyz1==",
        MD5OfBody: "MD5_1",
        Body: '{ type: "MESSAGE_1" }'
      },
      {
        MessageId: "xyz2",
        ReceiptHandle: "xyz2==",
        MD5OfBody: "MD5_2",
        Body: '{ type: "MESSAGE_2" }'
      },
      {
        MessageId: "xyz3",
        ReceiptHandle: "xyz3==",
        MD5OfBody: "MD5_3",
        Body: '{ type: "MESSAGE_3" }'
      }
    ]
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    queue = {};
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should poll for messages and delete on success", done => {
    queue.receiveMessage = resolve(messages);
    const messages$ = create(options, queue).pipe(
      delay(50),
      repeat()
    );

    messages$
      .pipe(
        take(3),
        toArray()
      )
      .subscribe(
        m => {
          expect(m[0].ResponseMetadata.RequestId).to.equal("xyz");
          done();
        },
        e => expect.fail(e)
      );
  });
});
