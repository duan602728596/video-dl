import { parseAudio } from '../../../src/parse/bilibili/parseAudio';

test('parse bilibili audio url to be object', async function() {
  const audioUrl = 'https://www.bilibili.com/audio/au590187?type=3';
  const result = await parseAudio(audioUrl, 'bilibili-audio');

  expect(typeof result === 'object').toBeTruthy();
  expect(typeof result?.title === 'string').toBeTruthy();
  expect(typeof result?.url === 'string').toBeTruthy();
  expect(typeof result?.extData.au === 'number').toBeTruthy();
});