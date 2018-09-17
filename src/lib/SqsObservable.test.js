import sinon from "sinon";
import SqsObservable from "./SqsObservable";
import { assert } from "chai";
import { take, toArray } from "rxjs/operators";

describe("Squirty", () => {
    let sandbox;
    let options = {
        QueueUrl: "url",
        WaitTimeSeconds: 1,
        MaxNumberOfMessages: 10
    };
    let queue;
    const messages = {
        ResponseMetadata: {
            RequestId: 'xyz'
        }, 
        Messages: [
            {
                MessageId: 'xyz1',
                ReceiptHandle: 'xyz1==',
                MD5OfBody: 'MD5_1',
                Body: '{ type: "MESSAGE_1" }'
            },
            {
                MessageId: 'xyz2',
                ReceiptHandle: 'xyz2==',
                MD5OfBody: 'MD5_2',
                Body: '{ type: "MESSAGE_2" }'
            },
            { 
                MessageId: 'xyz3',
                ReceiptHandle: 'xyz3==',
                MD5OfBody: 'MD5_3',
                Body: '{ type: "MESSAGE_3" }' 
            }
        ]
    };

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        queue = {
            receiveMessage: sandbox.stub(),
            deleteMessage: sandbox.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should poll for messages and delete on success", (done) => {
        const squirty$ = SqsObservable.create(
            options,
            queue
        );

        squirty$.pipe(take(3), toArray()).subscribe({
            next: messages => {
                assert.equal(messages.length, 3);
            },
            error: e => {
                done(e);
            },
            complete: () => {
                assert.equal(queue.receiveMessage.callCount, 1);
                assert.equal(queue.deleteMessage.callCount, 3);
                done();
            }
        });

        queue.receiveMessage.yield(null, messages);
    });
});