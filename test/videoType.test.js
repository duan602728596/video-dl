import videoType from '../src/videoType';

test('bilibili video url to be "bilibili-video" type', function() {
  expect(videoType('https://www.bilibili.com/video/BV1qz4y1X7VP')).toBe('bilibili-video');
  expect(videoType('https://www.bilibili.com/video/av170001')).toBe('bilibili-video');
  expect(videoType('https://www.bilibili.com')).toBe(null);
});

test('bilibili audio url to be "bilibili-audio" type', function() {
  expect(videoType('https://www.bilibili.com/audio/au590187?type=3')).toBe('bilibili-audio');
});

test('weibo video url to be "weibo-video" type', function() {
  expect(videoType('https://weibo.com/tv/show/1034:4524107799396354?from=old_pc_videoshow')).toBe('weibo-video');
});