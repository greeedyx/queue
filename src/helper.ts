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

