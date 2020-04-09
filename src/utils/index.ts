export function resolvePromise(promise2: any, x: any, resolve: Resolve, reject: Reject) {
  if (promise2 === x) {
    return reject(new TypeError('--Chaining cycle detected for promise #<Promise>--'))
  }
  let called = false
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(x, (y: any) => {
          if (called) return
          called = true
          resolvePromise(promise2, y, resolve, reject)
        }, (r: any) => {
          if (called) return
          called = true
          reject(r)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}
