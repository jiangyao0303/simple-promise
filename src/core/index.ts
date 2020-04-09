import { PENDING, RESOLVED, REJECTED } from '../constants/const';
import { resolvePromise } from '../utils'
import compile = WebAssembly.compile;

class SimplePromise {
  protected status: string;
  value: any;
  reason: any;
  onResolvedCallBacks: any[] = [];
  onRejectedCallBacks: any[] = [];

  constructor(executor: Executor) {
    this.status = PENDING;
    let resolve = (value: any) => {
      if (value instanceof SimplePromise) {
        return value.then(resolve, reject)
      }
      if (this.status === PENDING) {
        this.value = value;
        this.status = RESOLVED;

        this.onResolvedCallBacks.forEach(cb => cb())
      }
    };
    let reject = (reason: any) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;

        this.onRejectedCallBacks.forEach(cb => cb())
      }
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  }

  then(onFulFilled?: Callback, onRejected?: Callback) {
    onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : e => {
      throw e
    }

    let promise2 = new SimplePromise((resolve: Resolve, reject: Reject) => {
      if (this.status === PENDING) {
        this.onResolvedCallBacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulFilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.onRejectedCallBacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
      if (this.status === RESOLVED) {
        setTimeout(() => {
          try {
            let x = onFulFilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
    });
    return promise2
  }

  catch(onRejected: Reject) {
    return this.then(null, onRejected)
  }

  finally(fn: any) {
    return this.then((value: any) => {
      return Promise.resolve(fn()).then(() => {
        return value
      },(r: any) => {
        return Promise.resolve(fn()).then(() => {
          return value
        })
      })
    })
  }

  static resolve(value?: any) {
    return new SimplePromise((resolve, reject) => {
      resolve(value)
    })
  }

  static reject(reason: any) {
    return new SimplePromise((resolve, reject) => {
      reject(reason)
    })
  }

  static all(promises: any[]) {
    return new Promise((resolve: Resolve, reject: Reject) => {
      let arr: any[] = []
      let idx: number = 0;
      let promiseData = (value: any, index: number) => {
        arr[index] = value
        if (++idx === promises.length) {
          resolve(arr)
        }
      }
      for (let i = 0; i < promises.length; i++) {
        let cur = promises[i]
        if (cur instanceof SimplePromise) {
          cur.then(y => {
            promiseData(y, i)
          }, reject)
        } else {
          promiseData(cur, i)
        }
      }
    })
  }

  static race(promises: any[]) {
    return new Promise((resolve, reject) => {
      Array.from(promises).forEach(i => {
        Promise.resolve(i).then(resolve, reject)
      })
    })
  }
}

export default SimplePromise
