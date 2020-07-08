import url from 'url';
import axios from 'axios';

/**
 * 随机字符串
 * @param { number } len: 字符串长度
 */
function randomStr(len = 0) {
  const key = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890-_=';
  let sub = '';

  for (let i = 0; i < len; i++) {
    sub += key[Math.floor(Math.random() * key.length)];
  }

  return sub;
}

/**
 * 获取最高清的视频的视频地址
 * @param { { [key: string]: string } } urls
 */
function getVideoByQuality(urls) {
  let max = 0;
  let uri = null;

  for (const key in urls) {
    const p = Number(key.match(/[0-9]+/)[0]); // 画质

    if (p > max) {
      max = p;
      uri = urls[key];
    }
  }

  return uri;
}

/**
 * 解析微博地址
 * @param { string } videoUrl: 视频地址
 * @param { string } videoType: 视频类型
 * @param { object } options: 配置
 */
export async function parseWeiboVideo(videoUrl, videoType, options) {
  // 获取id
  const urlResult = new url.URL(videoUrl);
  const videoId = urlResult.pathname.replace(/\/tv\/show\//i, '');

  // 获取视频信息
  const data = JSON.stringify({
    Component_Play_Playinfo: { oid: videoId }
  });
  const { data: videoInfo } = await axios({
    url: `https://weibo.com/tv/api/component?page=${ encodeURIComponent(urlResult.pathname) }`,
    method: 'POST',
    headers: {
      referer: videoUrl,
      Cookie: `SUB=${ randomStr(94) }` // 随机一个94位的sub字符串
    },
    data: `data=${ data }`
  });

  const { Component_Play_Playinfo: playInfo } = videoInfo.data;

  return {
    videoType,
    title: playInfo.title,
    url: getVideoByQuality(playInfo.urls), // 挑选最高清的视频
    duration: playInfo.duration_time,
    extData: {
      id: videoId,
      description: playInfo.text,
      pic: playInfo.cover_image,
      urls: playInfo.urls
    }
  };
}