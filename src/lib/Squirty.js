import { AWS } from "aws-sdk/global";
import SQS from "aws-sdk/clients/sqs";
import { defaultParams } from "./config";
import SqsObservable from "./SqsObservable";

export default {
  create: (options, queue) => {
    if (!options || !options.QueueUrl) {
      throw new Error("options.QueueUrl is required");
    }
    const params = Object.assign({}, defaultParams, options);
    const sqs =
      queue ||
      new SQS({
        region: options.Region || process.env.AWS_REGION || "eu-west-1"
      });

    return SqsObservable.create(params, sqs);
  }
};
