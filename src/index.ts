export type Fn<T = any> = () => T;
export type Fp<T = any> = () => Promise<T>;
export type Executor<T> = () => (T | Promise<T>);

export const sleep = (time: number) => new Promise((resolve) => {
  setTimeout(resolve, time);
});

/**
 * 失败重试函数
 * @param times 最大重试次数 
 * @param executor 重试执行的函数 
 * @returns Promise<T> 执行结果
 */
export function retry<T>(times: number, delay: number, executor: Executor<T>): Promise<T> {
  return Promise.resolve().then(executor).catch(e => {
    if (times <= 0) {
      return Promise.reject(e);
    }
    return sleep(delay).then(() => retry(times - 1, delay, executor));
  });
}


export default class Queue<T> {

  // 存储待执行任务的队列
  private _queue: Fn[] = [];

  // 存储执行结果的数组
  private _result: any[] = [];

  // 最大并发数
  private _maxConcurrency = 3;

  // 重试次数
  private _retryTimes = 1;

  // 重试延迟时间（毫秒）
  private _retryDelay = 1000;

  // 总任务数
  private _total = 0;

  // 数据列表（用于every方法）
  private _data: T[] = [];
  /**
   * 构造函数
   * @param maxConcurrency 最大并发数，默认为3
   * @param retryTimes 重试次数，默认为1
   * @param retryDelay 重试延迟时间（毫秒），默认为1000
   */
  constructor(maxConcurrency: number = 3, retryTimes: number = 1, retryDelay: number = 1000) {
    this._maxConcurrency = maxConcurrency;
    this._retryTimes = retryTimes;
    this._retryDelay = retryDelay;

  }

  /**
   * 创建队列实例的静态方法
   * @returns 新的Queue实例
   */
  public static createInstance(concurrency = 3, retry = 1, delay = 1000) {
    return new Queue(concurrency, retry, delay);
  }

  /**
   * 设置最大并发数
   * @param max 并发数
   * @returns 当前实例，支持链式调用
   */
  public maxConcurrency(max: number) {
    this._maxConcurrency = max;
    return this;
  }
  /**
   * 设置重试次数
   * @param times 重试次数
   * @returns 当前实例，支持链式调用
   */
  public retryTimes(times: number) {
    this._retryTimes = times;
    return this;
  }

  /**
   * 设置重试延迟时间
   * @param delay 延迟时间（毫秒）
   * @returns 当前实例，支持链式调用
   */
  public retryDelay(delay: number) {
    this._retryDelay = delay;
    return this;
  }

  /**
   * 设置数据列表（用于every方法）
   * @param list 数据列表
   * @returns 当前实例，支持链式调用
   */
  public data(list: T[]) {
    this._data = list;
    return this;
  }

  /**
   * 对数据列表中每个元素执行操作
   * @param fn 处理函数
   * @returns Promise 执行结果
   */
  public every(fn: (it: T, idx: number) => any) {
    const ps = this._data.map((t, i) => () => fn(t, i));
    return this.addTask(ps).exec();
  }

  /**
   * 添加任务到队列
   * @param fn 任务函数或函数数组
   * @returns 当前实例，支持链式调用
   */
  public addTask(fn: Fn<any> | Fn<any>[]) {
    const fns = Array.isArray(fn) ? fn : [fn];
    this._queue.push(...fns);
    this._total = this._queue.length;
    return this;
  }

  /**
  * 执行队列中的所有任务
  * @returns Promise 包含所有任务执行结果的数组
  */
  public exec(): Promise<any[]> {
    return new Promise((resolve) => {
      if (this._total === 0) {
        resolve([]);
        return;
      }
      let complete = 0;
      let concurrency = 0;
      // 根据最大并发数执行任务
      const executor = () => {
        if (!concurrency && complete == this._total) {
          resolve(this._result);
          return;
        }
        while (concurrency < this._maxConcurrency && this._queue.length) {
          const idx = this._total - this._queue.length;
          const func = this._queue.shift();
          concurrency++;
          Promise.resolve().then(func).then((rs) => {
            this._result[idx] = rs;
          }).catch(() => {
            return retry(this._retryTimes, this._retryDelay, () => Promise.resolve().then(func).then((rs) => {
              return this._result[idx] = rs;
            }).catch(e => {
              return this._result[idx] = e;
            }))
          }).finally(() => {
            concurrency--;
            complete++;
            // 继续执行下一个任务
            executor();
          })
        }
      }
      executor();
    });
  }
}