import { AWS } from "aws-sdk/global";
import SQS from "aws-sdk/clients/sqs";
import { defaultParams } from "./config";
import SqsObservable from "./SqsObservable";

class Squirty {
  constructor(options, queue) {
    if (!options || !options.QueueUrl) {
      throw new Error("options.QueueUrl is required");
    }
    const sqs =
      queue ||
      new SQS({
        region: options.Region || process.env.AWS_REGION || "eu-west-1"
      });
    const params = Object.assign({}, defaultParams, options);

    return SqsObservable.create(params, sqs);
  }
}

const squirty = {
  create: (options, queue) => new Squirty(options, queue)
};

export default squirty;