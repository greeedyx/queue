# greedyx/queue

- JavaScript 任务队列工具类

## 安装

```shell
npm install greedyx/queue
```

## API


### 任务队列（适用每个任务逻辑相同的批任务）

```typescript
import { Queue } from "@greedyx/queue";

// 静态方法创建实例
Queue.createInstance()
  // 设置数据源
  .data([1, 2, 3, 4, 5, 6, 7, 8])
  // 设置最大并发数
  .maxConcurrency(4)
  // 设置失败重试次数
  .retryTimes(3)
  // 失败重试时每次延迟多久
  .retryDelay(1000)
  // 数据源的每项执行的任务，返回一个Promise
  .every((e) => {
    console.log("执行任务", e);
    return Promise.resolve(e * 2);
  })
  .then((res) => {
    console.log("执行成功", res);
  })
  .catch((err) => {
    console.error("执行失败", err);
  });
```
