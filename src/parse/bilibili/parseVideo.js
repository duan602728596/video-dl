import url from 'url';
import querystring from 'querystring';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import md5 from 'crypto-js/md5';

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) '
  + 'Chrome/84.0.4147.38 Safari/537.36 Edg/84.0.522.15';

/**
 * 解析initialState
 * @param { Array<HTMLScriptElement> } scripts
 * @return { object | null }
 */
function parsingInitialState(scripts) {
  let initialState = null;

  for (const script of scripts) {
    const scriptStr = script.innerHTML;

    if (/^window\._{2}INITIAL_STATE_{2}\s*=\s*.+$/.test(scriptStr)) {
      const str = scriptStr
        .replace(/window\._{2}INITIAL_STATE_{2}\s*=\s*/, '')                 // 剔除"="前面的字符串
        .replace(/;\(function\(\){var s;.+$/i, ''); // 剔除后面可能存在的函数

      initialState = JSON.parse(str);
      break;
    }
  }

  return initialState;
}

/**
 * 解析playInfo
 * @param { Array<HTMLScriptElement> } scripts
 */
function formatPlayInfo(scripts) {
  let playInfo = null;

  for (const script of scripts) {
    const scriptStr = script.innerHTML;

    if (/^window\._{2}playinfo_{2}=.+$/.test(scriptStr)) {
      const str = scriptStr
        .replace(/window\.__playinfo__=/, ''); // 剔除"="前面的字符串

      playInfo = JSON.parse(str);
    }
  }

  return playInfo;
}

/**
 * 获取m4s内的字段
 * @param { Array<object> } data: 视频信息的数组
 */
function m4sOmit(data) {
  return data.map((item, index) => {
    return {
      url: item.baseUrl ?? item.base_url,
      mimeType: item.mimeType ?? item.mime_type,
      codecs: item.codecs
    };
  });
}

/**
 * 解析视频
 * @param { string } videoUrl: 视频地址
 * @param { string } videoType: 视频类型
 * @param { object } options: 配置
 * @param { boolean } options.m4s: 是否获取m4s的地址
 */
export async function parseVideo(videoUrl, videoType, options) {
  const { m4s = false } = options ?? {};

  // 请求html
  const { data: html } = await axios({
    url: videoUrl,
    responseType: 'text',
    headers: {
      Host: 'www.bilibili.com',
      'User-Agent': USER_AGENT
    }
  });

  // 对html进行解析，获取initialState
  const dom = new JSDOM(html);
  const { document } = dom.window;
  const scripts = document.querySelectorAll('script');
  const initialState = parsingInitialState(scripts);

  if (!initialState) {
    return null;
  }

  // 解析title
  const h1Title = document.querySelector('#viewbox_report .tit').innerHTML;

  // 解析page
  const { search } = new url.URL(videoUrl);
  const searchResult = querystring.parse(search.replace(/^\?/, ''));
  const page = searchResult.p ? Number(searchResult.p) : 1;

  // 解析cid
  const { cid, part } = initialState.videoData.pages[page - 1];

  // 获取视频地址
  let flvUrl = null;
  let durl = null;

  // b站请求接口需要的key
  const APP_KEY = 'iVGUTjsxvpLeuDCf';
  const BILIBILI_KEY = 'aHRmhWMLkdeMuILqORnYZocwMBpMEOdt';

  // 查询参数
  const QUERY_ARRAY = ['qn=80&quality=80&type=', 'quality=2&type=mp4'];

  for (const query of QUERY_ARRAY) {
    const payload = `appkey=${ APP_KEY }&cid=${ cid }&otype=json&page=${ page }&${ query }`;
    const sign = md5(`${ payload }${ BILIBILI_KEY }`).toString();
    const { data: playData } = await axios.get(`https://interface.bilibili.com/v2/playurl?${ payload }&sign=${ sign }`);

    if (playData?.durl?.length) {
      flvUrl = playData.durl[0].url;
      durl = playData.durl;
      break;
    }
  }

  // 返回值
  const videoResult = {
    videoType,
    title: `${ h1Title }${ part }`,
    url: flvUrl,
    duration: initialState.videoData.duration,
    extData: {
      page,
      bv: initialState.bvid,
      av: initialState.aid,
      description: initialState.videoData.desc,
      pic: initialState.pic,
      durl
    }
  };

  // 解析m4s
  if (m4s === true) {
    const playInfo = formatPlayInfo(scripts);

    if (playInfo.data.dash) {
      const m4sInfo = {
        video: m4sOmit(playInfo.data.dash.video),
        audio: m4sOmit(playInfo.data.dash.audio)
      };

      videoResult.extData.m4s = m4sInfo;
    }
  }

  return videoResult;
}