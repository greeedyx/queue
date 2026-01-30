export var sleep = function (time) { return new Promise(function (resolve) {
    setTimeout(resolve, time);
}); };
/**
 * 失败重试函数
 * @param times 最大重试次数
 * @param executor 重试执行的函数
 * @returns Promise<T> 执行结果
 */
export function retry(times, delay, executor) {
    return Promise.resolve().then(executor).catch(function (e) {
        if (times <= 0) {
            return Promise.reject(e);
        }
        return sleep(delay).then(function () { return retry(times - 1, delay, executor); });
    });
}
