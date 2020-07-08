import { videoDl } from '../src/videoDl';

test('videoDl func to be return object', async function() {
  const result0 = await videoDl('https://www.bilibili.com/video/BV17z4y1D7JH?spm_id_from=333.851.b_7265706f7274466972737431.11');
  const result1 = await videoDl('https://weibo.com/tv/show/1034:4524350184030274');

  expect(typeof result0 === 'object').toBeTruthy();
  expect(typeof result1 === 'object').toBeTruthy();
});