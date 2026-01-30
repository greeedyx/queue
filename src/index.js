var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { retry } from './helper';
var Queue = /** @class */ (function () {
    /**
     * 构造函数
     * @param maxConcurrency 最大并发数，默认为3
     * @param retryTimes 重试次数，默认为1
     * @param retryDelay 重试延迟时间（毫秒），默认为1000
     */
    function Queue(maxConcurrency, retryTimes, retryDelay) {
        if (maxConcurrency === void 0) { maxConcurrency = 3; }
        if (retryTimes === void 0) { retryTimes = 1; }
        if (retryDelay === void 0) { retryDelay = 1000; }
        // 存储待执行任务的队列
        this._queue = [];
        // 存储执行结果的数组
        this._result = [];
        // 最大并发数
        this._maxConcurrency = 3;
        // 重试次数
        this._retryTimes = 1;
        // 重试延迟时间（毫秒）
        this._retryDelay = 1000;
        // 总任务数
        this._total = 0;
        // 数据列表（用于every方法）
        this._data = [];
        this._maxConcurrency = maxConcurrency;
        this._retryTimes = retryTimes;
        this._retryDelay = retryDelay;
    }
    /**
     * 创建队列实例的静态方法
     * @returns 新的Queue实例
     */
    Queue.createInstance = function (concurrency, retry, delay) {
        if (concurrency === void 0) { concurrency = 3; }
        if (retry === void 0) { retry = 1; }
        if (delay === void 0) { delay = 1000; }
        return new Queue(concurrency, retry, delay);
    };
    /**
     * 设置最大并发数
     * @param max 并发数
     * @returns 当前实例，支持链式调用
     */
    Queue.prototype.maxConcurrency = function (max) {
        this._maxConcurrency = max;
        return this;
    };
    /**
     * 设置重试次数
     * @param times 重试次数
     * @returns 当前实例，支持链式调用
     */
    Queue.prototype.retryTimes = function (times) {
        this._retryTimes = times;
        return this;
    };
    /**
     * 设置重试延迟时间
     * @param delay 延迟时间（毫秒）
     * @returns 当前实例，支持链式调用
     */
    Queue.prototype.retryDelay = function (delay) {
        this._retryDelay = delay;
        return this;
    };
    /**
     * 设置数据列表（用于every方法）
     * @param list 数据列表
     * @returns 当前实例，支持链式调用
     */
    Queue.prototype.data = function (list) {
        this._data = list;
        return this;
    };
    /**
     * 对数据列表中每个元素执行操作
     * @param fn 处理函数
     * @returns Promise 执行结果
     */
    Queue.prototype.every = function (fn) {
        var ps = this._data.map(function (t, i) { return function () { return fn(t, i); }; });
        return this.add(ps).exec();
    };
    /**
     * 添加任务到队列
     * @param fn 任务函数或函数数组
     * @returns 当前实例，支持链式调用
     */
    Queue.prototype.add = function (fn) {
        var _a;
        var fns = Array.isArray(fn) ? fn : [fn];
        (_a = this._queue).push.apply(_a, __spreadArray([], __read(fns), false));
        this._total = this._queue.length;
        return this;
    };
    /**
     * 执行队列中的所有任务
     * @returns Promise 包含所有任务执行结果的数组
     */
    Queue.prototype.exec = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this._total === 0) {
                resolve([]);
                return;
            }
            var complete = 0;
            var concurrency = 0;
            // 根据最大并发数执行任务
            var executor = function () {
                if (!concurrency && complete == _this._total) {
                    resolve(_this._result);
                    return;
                }
                var _loop_1 = function () {
                    var idx = _this._total - _this._queue.length;
                    var func = _this._queue.shift();
                    concurrency++;
                    Promise.resolve().then(func).then(function (rs) {
                        _this._result[idx] = rs;
                    }).catch(function () {
                        return retry(_this._retryTimes, _this._retryDelay, function () { return Promise.resolve().then(func).then(function (rs) {
                            return _this._result[idx] = rs;
                        }).catch(function (e) {
                            return _this._result[idx] = e;
                        }); });
                    }).finally(function () {
                        concurrency--;
                        complete++;
                        // 继续执行下一个任务
                        executor();
                    });
                };
                while (concurrency < _this._maxConcurrency && _this._queue.length) {
                    _loop_1();
                }
            };
            executor();
        });
    };
    return Queue;
}());
export default Queue;
