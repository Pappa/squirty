import { Observable } from "rxjs";

export default class SqsObservable {
    constructor(options, queue) {
    }
  
    static create = (options, queue) => new SqsObservable(options, queue);
  }
  