import { AWS } from "aws-sdk/global";
import SQS from "aws-sdk/clients/sqs";
import { defaultParams, requiredParams } from "./config";

export default class Squirty {
  constructor(options) {
    this.q =
      options.Queue ||
      new SQS({
        region: options.Region || process.env.AWS_REGION || "eu-west-1"
      });
  }

  static create = options => new Squirty(options);
}
