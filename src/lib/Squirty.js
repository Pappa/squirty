import { AWS } from "aws-sdk/global";
import SQS from "aws-sdk/clients/sqs";
import { defaultParams } from "./config";
import SqsObservable from "./SqsObservable";

export default class Squirty {
  constructor(options, queue) {
    if (!options.QueueUrl) {
      throw "QueueUrl is a required option property";
    }
    const sqs = queue || new SQS({ region: options.Region || process.env.AWS_REGION || "eu-west-1"});
    const params = Object.assign({}, defaultParams, options);

    return SqsObservable.create(params, sqs);
  }

  static create = (options, queue) => new Squirty(options, queue);
}
