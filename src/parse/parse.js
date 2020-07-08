import { parseVideo as parseBilibiliVideo } from './bilibili/parseVideo';
import { parseAudio as parseBilibiliAudio } from './bilibili/parseAudio';
import { parseWeiboVideo } from './parseWeiboVideo';

const parseFunc = {
  'bilibili-video': parseBilibiliVideo,
  'bilibili-audio': parseBilibiliAudio,
  'weibo-video': parseWeiboVideo
};

/**
 * 根据地址和类型解析视频地址
 * @param { string } videoUrl: 视频地址
 * @param { string } videoType: 视频类型
 * @param { object } options: 配置
 * @return { object | null }
 */
async function parse(videoUrl, videoType, options) {
  if (videoType in parseFunc) {
    return await parseFunc[videoType](videoUrl, videoType, options);
  }

  return null;
}

export default parse;