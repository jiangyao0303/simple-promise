"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("../constants/const");
var utils_1 = require("../utils");
var SimplePromise = (function () {
    function SimplePromise(executor) {
        var _this = this;
        this.onResolvedCallBacks = [];
        this.onRejectedCallBacks = [];
        this.status = const_1.PENDING;
        var resolve = function (value) {
            if (value instanceof SimplePromise) {
                return value.then(resolve, reject);
            }
            if (_this.status === const_1.PENDING) {
                _this.value = value;
                _this.status = const_1.RESOLVED;
                _this.onResolvedCallBacks.forEach(function (cb) { return cb(); });
            }
        };
        var reject = function (reason) {
            if (_this.status === const_1.PENDING) {
                _this.reason = reason;
                _this.status = const_1.REJECTED;
                _this.onRejectedCallBacks.forEach(function (cb) { return cb(); });
            }
        };
        try {
            executor(resolve, reject);
        }
        catch (e) {
            console.log(e);
            reject(e);
        }
    }
    SimplePromise.prototype.then = function (onFulFilled, onRejected) {
        var _this = this;
        onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : function (v) { return v; };
        onRejected = typeof onRejected === 'function' ? onRejected : function (e) {
            throw e;
        };
        var promise2 = new SimplePromise(function (resolve, reject) {
            if (_this.status === const_1.PENDING) {
                _this.onResolvedCallBacks.push(function () {
                    setTimeout(function () {
                        try {
                            var x = onFulFilled(_this.value);
                            utils_1.resolvePromise(promise2, x, resolve, reject);
                        }
                        catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
                _this.onRejectedCallBacks.push(function () {
                    setTimeout(function () {
                        try {
                            var x = onRejected(_this.reason);
                            utils_1.resolvePromise(promise2, x, resolve, reject);
                        }
                        catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
            }
            if (_this.status === const_1.RESOLVED) {
                setTimeout(function () {
                    try {
                        var x = onFulFilled(_this.value);
                        utils_1.resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (_this.status === const_1.REJECTED) {
                setTimeout(function () {
                    try {
                        var x = onRejected(_this.reason);
                        utils_1.resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 0);
            }
        });
        return promise2;
    };
    SimplePromise.prototype.catch = function (onRejected) {
        return this.then(null, onRejected);
    };
    SimplePromise.prototype.finally = function (fn) {
        return this.then(function (value) {
            return Promise.resolve(fn()).then(function () {
                return value;
            }, function (r) {
                return Promise.resolve(fn()).then(function () {
                    return value;
                });
            });
        });
    };
    SimplePromise.resolve = function (value) {
        return new SimplePromise(function (resolve, reject) {
            resolve(value);
        });
    };
    SimplePromise.reject = function (reason) {
        return new SimplePromise(function (resolve, reject) {
            reject(reason);
        });
    };
    SimplePromise.all = function (promises) {
        return new Promise(function (resolve, reject) {
            var arr = [];
            var idx = 0;
            var promiseData = function (value, index) {
                arr[index] = value;
                if (++idx === promises.length) {
                    resolve(arr);
                }
            };
            var _loop_1 = function (i) {
                var cur = promises[i];
                if (cur instanceof SimplePromise) {
                    cur.then(function (y) {
                        promiseData(y, i);
                    }, reject);
                }
                else {
                    promiseData(cur, i);
                }
            };
            for (var i = 0; i < promises.length; i++) {
                _loop_1(i);
            }
        });
    };
    SimplePromise.race = function (promises) {
        return new Promise(function (resolve, reject) {
            Array.from(promises).forEach(function (i) {
                Promise.resolve(i).then(resolve, reject);
            });
        });
    };
    return SimplePromise;
}());
exports.default = SimplePromise;
//# sourceMappingURL=index.js.map