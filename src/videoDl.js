import getVideoType from './videoType';
import parse from './parse/parse';

/**
 * @param { string } videoUrl: 视频地址
 * @param { object } options: 配置
 */
export async function videoDl(videoUrl, options) {
  const videoType = getVideoType(videoUrl); // 获取视频类型
  const parseResult = await parse(videoUrl, videoType, options);

  return parseResult;
}