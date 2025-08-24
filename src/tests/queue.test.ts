import Queue from '../index';

describe('Queue Class', () => {

  test('执行成功', async () => {
    Queue.createInstance()
      .data([1, 2, 3, 4, 5, 6, 7, 8])
      .maxConcurrency(4)
      .retryTimes(3)
      .retryDelay(1000)
      .every((e) => {
        console.log('执行任务', e);
        return Promise.resolve(e * 2);
      }).then(res => {
        console.log('执行成功', res);
      }).catch(err => {
        console.error('执行失败', err);
      });
  });

});