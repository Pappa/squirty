import sinon from "sinon";
import Squirty from "./Squirty";
import SqsObservable from "./SqsObservable";
import { assert } from "chai";

describe("Squirty", () => {
    let sandbox;
    let options = {
        QueueUrl: "url"
    };

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(SqsObservable, "create");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should throw an error if no QueueUrl is provided", () => {
        assert.throws(() => {
            Squirty.create();
        }, Error, "options.QueueUrl is required");
        assert.throws(() => {
            Squirty.create({});
        }, Error, "options.QueueUrl is required");
    });

    it("should call SqsObservable.create()", () => {
        Squirty.create(options);
        assert.isTrue(SqsObservable.create.calledOnce);
    });

    it("should pass an sqs instance to SqsObservable.create()", () => {
        const sqs = {};
        Squirty.create(options, sqs);
        assert.isTrue(SqsObservable.create.calledWith(sinon.match.any, sqs));
    });

    it("should merge the default parameters", () => {
        const sqs = {};
        const params = { 
            QueueUrl: 'url',
            AttributeNames: [],
            MessageAttributeNames: [],
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 20,
            VisibilityTimeout: null
        };
        Squirty.create(options, sqs);
        assert.isTrue(SqsObservable.create.calledWith(params, sqs));
    });
});