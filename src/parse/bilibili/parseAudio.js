import url from 'url';
import axios from 'axios';

/**
 * @param { string } audioUrl: 音频地址
 * @param { string } videoType: 视频类型
 * @param { object } options: 配置
 */
export async function parseAudio(audioUrl, videoType, options) {
  // 解析音频id
  const urlResult = new url.URL(audioUrl);
  const auid = Number(urlResult.pathname.replace(/^\/audio\/au/i, ''));

  // 获取相关信息
  const [audioInfoRes, audioUrlInfoRes] = await Promise.all([
    axios.get(`https://www.bilibili.com/audio/music-service-c/web/song/info?sid=${ auid }`),
    axios.get(`https://www.bilibili.com/audio/music-service-c/web/url?sid=${ auid }&privilege=${ 2 }&quality=${ 2 }`)
  ]);
  const [audioInfo, audioUrlInfo] = [audioInfoRes.data.data, audioUrlInfoRes.data.data];

  return {
    videoType,
    title: audioInfo.title,
    url: audioUrlInfo.cdns[0],
    duration: audioInfo.duration,
    extData: {
      au: auid,
      description: audioInfo.intro,
      pic: audioInfo.cover,
      cdns: audioUrlInfo.cdns
    }
  };
}