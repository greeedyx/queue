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

// 静态方法创建实例, 空参默认等价于Queue.createInstance(3, 1, 1000)
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
    console.log("执行结果", res);
  });

// 等同于如下代码：
const queue = new Queue(4, 3, 1000);
const arr = [1, 2, 3, 4, 5, 6, 7, 8];
// 添加任务，可添加单个或多个任务
queue.add(
  arr.map((e) => () => {
    console.log("执行任务", e);
    return Promise.resolve(e * 2);
  })
);
queue.exec().then((res) => {
  console.log("执行结果", res);
});

// 等同于如下代码：
Queue.createInstance(4, 3, 1000)
  .data([1, 2, 3, 4, 5, 6, 7, 8])
  .every((e) => {
    console.log("执行任务", e);
    return Promise.resolve(e * 2);
  })
  .then((res) => {
    console.log("执行结果", res);
  });
```
