import { parseWeiboVideo } from '../../src/parse/parseWeiboVideo';

test('parse weibo video url to be object', async function() {
  const videoUrl = 'https://weibo.com/tv/show/1034:4524350184030274?from=old_pc_videoshow';
  const result = await parseWeiboVideo(videoUrl, 'weibo-video');

  expect(typeof result === 'object').toBeTruthy();
  expect(typeof result?.title === 'string').toBeTruthy();
  expect(typeof result?.url === 'string').toBeTruthy();
});