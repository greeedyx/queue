# greedyx/queue

- JavaScript 任务队列工具类

## 简介

`greedyx/queue` 是一个轻量级的 JavaScript 任务队列库，旨在简化异步任务的并发控制和错误处理。它非常适合用于需要批量处理相同逻辑任务的场景，支持并发控制、失败重试机制等功能。

## 安装

```shell
npm install greedyx/queue
```

## 功能特性

- **并发控制**：设置最大并发数，防止资源过载。
- **失败重试**：任务失败时自动重试，可配置重试次数与延迟。
- **批量任务处理**：支持批量任务添加，统一执行。
- **Promise 风格 API**：基于 Promise，支持 `then` 和 `catch` 处理结果。

## API

### 任务队列（适用每个任务逻辑相同的批任务）

```typescript
import Queue from "@greedyx/queue";

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

## 使用指南

### 创建队列实例

1. **使用静态方法创建**

   ```typescript
   Queue.createInstance();
   ```

   - 默认参数：`Queue.createInstance(maxConcurrency = 3, retryTimes = 1, retryDelay = 1000)`
   - 示例：

     ```typescript
     Queue.createInstance(4, 3, 1000);
     ```

2. **使用构造函数创建**

   ```typescript
   const queue = new Queue(4, 3, 1000);
   ```

   - 参数说明：
     - `maxConcurrency`: 最大并发任务数。
     - `retryTimes`: 每个任务失败时的重试次数。
     - `retryDelay`: 每次重试的延迟时间（毫秒）。

### 添加任务

1. **使用 `data` 方法添加任务数据源**

   ```typescript
   .data([1, 2, 3, 4, 5, 6, 7, 8]);
   ```

   - 参数是一个数组，数组中的每一项都会被 `every` 方法处理。

2. **使用 `add` 方法手动添加任务**

   ```typescript
   queue.add(
     arr.map((e) => () => {
       console.log("执行任务", e);
       return Promise.resolve(e * 2);
     })
   );
   ```

   - 参数是一个任务数组，每个任务是一个返回 `Promise` 的函数。

### 执行任务

```typescript
queue.exec().then((res) => {
  console.log("执行结果", res);
});
```

- `exec` 方法会启动队列中的所有任务，并返回一个 `Promise`，当所有任务完成时解析结果。

### 处理任务结果

- 成功结果：通过 `.then()` 获取所有任务的执行结果。
- 失败结果：通过 `.catch()` 捕获任何任务执行过程中的错误。

### 配置选项

1. **最大并发数**

   ```typescript
   .maxConcurrency(4);
   ```

   - 设置同一时间可以执行的最大任务数量。

2. **失败重试次数**

   ```typescript
   .retryTimes(3);
   ```

   - 设置任务失败后自动重试的次数。

3. **重试延迟时间**

   ```typescript
   .retryDelay(1000);
   ```

   - 设置每次重试之间的延迟时间（毫秒）。

## 示例代码

### 基本使用

```typescript
import Queue from "@greedyx/queue";

Queue.createInstance()
  .data([1, 2, 3, 4, 5, 6, 7, 8])
  .maxConcurrency(4)
  .retryTimes(3)
  .retryDelay(1000)
  .every((e) => {
    console.log("执行任务", e);
    return Promise.resolve(e * 2);
  })
  .then((res) => {
    console.log("执行结果", res);
  })
  .catch((err) => {
    console.error("任务执行失败", err);
  });
```

### 手动添加任务

```typescript
const queue = new Queue(4, 3, 1000);
const arr = [1, 2, 3, 4, 5, 6, 7, 8];

queue.add(
  arr.map((e) => () => {
    console.log("执行任务", e);
    return Promise.resolve(e * 2);
  })
);

queue.exec().then((res) => {
  console.log("执行结果", res);
});
```

## 常见问题

### 如何处理任务失败？

- 每个任务失败时会自动重试，重试次数由 `.retryTimes(n)` 控制。
- 如果有任务耗尽重试次数依然执行失败，将会在.then() 返回的结果数组中对应项返回异常对象。

### 如何控制并发数量？

- 使用 `.maxConcurrency(n)` 设置最大并发数，控制同时执行的任务数量。

### 如何动态添加任务？

- 可以多次调用 `.add(tasks)` 方法向队列中添加任务。
- 添加的任务会在下一次调用 `.exec()` 时执行。

## 贡献指南

如果你有兴趣贡献代码或改进，请参考 [CONTRIBUTING.md](CONTRIBUTING.md)。