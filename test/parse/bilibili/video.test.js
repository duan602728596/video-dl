import { parseVideo } from '../../../src/parse/bilibili/parseVideo';

test('parse bilibili video url to be object', async function() {
  const videoUrl = 'https://www.bilibili.com/video/BV1qz4y1X7VP';
  const result = await parseVideo(videoUrl, 'bilibili-video');

  expect(typeof result === 'object').toBeTruthy();
  expect(typeof result?.title === 'string').toBeTruthy();
  expect(typeof result?.url === 'string').toBeTruthy();
  expect(typeof result?.extData.page === 'number').toBeTruthy();
});

test('parse bilibili video m4s url to be array', async function() {
  const videoUrl = 'https://www.bilibili.com/video/BV1As411f7Kd';
  const result = await parseVideo(videoUrl, 'bilibili-video', { m4s: true });

  expect(typeof result === 'object').toBeTruthy();
  expect(typeof result?.extData.m4s === 'object').toBeTruthy();
  expect(Array.isArray(result?.extData.m4s.video)).toBeTruthy();
  expect(Array.isArray(result?.extData.m4s.audio)).toBeTruthy();
});