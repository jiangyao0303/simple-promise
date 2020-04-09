interface Executor {
  (resolve: Resolve, reject: Reject): void;
}

interface Resolve {
  (y?: any): void;
}

interface Reject {
  (r?: any): void;
}

interface Callback {
  (value?: any): any;
}
