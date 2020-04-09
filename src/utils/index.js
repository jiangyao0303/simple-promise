"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('--Chaining cycle detected for promise #<Promise>--'));
    }
    var called = false;
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        try {
            var then = x.then;
            if (typeof then === 'function') {
                then.call(x, function (y) {
                    if (called)
                        return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, function (r) {
                    if (called)
                        return;
                    called = true;
                    reject(r);
                });
            }
            else {
                resolve(x);
            }
        }
        catch (e) {
            if (called)
                return;
            called = true;
            reject(e);
        }
    }
    else {
        resolve(x);
    }
}
exports.resolvePromise = resolvePromise;
//# sourceMappingURL=index.js.map