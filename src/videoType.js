import url from 'url';

/**
 * @param { string } videoUrl: 视频地址
 * @return { string | null }
 *   bilibili-video: b站视频
 *   bilibili-audio: b站音频
 */
function videoType(videoUrl) {
  const urlResult = new url.URL(videoUrl);
  let videoType = null;

  // 解析为bilibili网站
  if (/bilibili\.com$/i.test(urlResult.hostname)) {
    // 解析为视频
    if (/^\/video\/[ab]v/i.test(urlResult.pathname)) {
      videoType = 'bilibili-video';
    }

    // 解析为音频
    if (/^\/audio\/au/i.test(urlResult.pathname)) {
      videoType = 'bilibili-audio';
    }
  }

  if (/weibo\.com$/.test(urlResult.hostname)) {
    videoType = 'weibo-video';
  }

  return videoType;
}

export default videoType;