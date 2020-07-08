"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js/object/define-property");

require("core-js/modules/es.promise");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.parseVideo = parseVideo;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/map"));

var _url = _interopRequireDefault(require("url"));

var _querystring = _interopRequireDefault(require("querystring"));

var _axios = _interopRequireDefault(require("axios"));

var _jsdom = require("jsdom");

var _md = _interopRequireDefault(require("crypto-js/md5"));

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) ' + 'Chrome/84.0.4147.38 Safari/537.36 Edg/84.0.522.15';
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
      const str = scriptStr.replace(/window\._{2}INITIAL_STATE_{2}\s*=\s*/, '') // 剔除"="前面的字符串
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
      const str = scriptStr.replace(/window\.__playinfo__=/, ''); // 剔除"="前面的字符串

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
  return (0, _map.default)(data).call(data, (item, index) => {
    var _item$baseUrl, _item$mimeType;

    return {
      url: (_item$baseUrl = item.baseUrl) !== null && _item$baseUrl !== void 0 ? _item$baseUrl : item.base_url,
      mimeType: (_item$mimeType = item.mimeType) !== null && _item$mimeType !== void 0 ? _item$mimeType : item.mime_type,
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


async function parseVideo(videoUrl, videoType, options) {
  const {
    m4s = false
  } = options !== null && options !== void 0 ? options : {}; // 请求html

  const {
    data: html
  } = await (0, _axios.default)({
    url: videoUrl,
    responseType: 'text',
    headers: {
      Host: 'www.bilibili.com',
      'User-Agent': USER_AGENT
    }
  }); // 对html进行解析，获取initialState

  const dom = new _jsdom.JSDOM(html);
  const {
    document
  } = dom.window;
  const scripts = document.querySelectorAll('script');
  const initialState = parsingInitialState(scripts);

  if (!initialState) {
    return null;
  } // 解析title


  const h1Title = document.querySelector('#viewbox_report .tit').innerHTML; // 解析page

  const {
    search
  } = new _url.default.URL(videoUrl);

  const searchResult = _querystring.default.parse(search.replace(/^\?/, ''));

  const page = searchResult.p ? Number(searchResult.p) : 1; // 解析cid

  const {
    cid,
    part
  } = initialState.videoData.pages[page - 1]; // 获取视频地址

  let flvUrl = null;
  let durl = null; // b站请求接口需要的key

  const APP_KEY = 'iVGUTjsxvpLeuDCf';
  const BILIBILI_KEY = 'aHRmhWMLkdeMuILqORnYZocwMBpMEOdt'; // 查询参数

  const QUERY_ARRAY = ['qn=80&quality=80&type=', 'quality=2&type=mp4'];

  for (const query of QUERY_ARRAY) {
    var _playData$durl;

    const payload = `appkey=${APP_KEY}&cid=${cid}&otype=json&page=${page}&${query}`;
    const sign = (0, _md.default)(`${payload}${BILIBILI_KEY}`).toString();
    const {
      data: playData
    } = await _axios.default.get(`https://interface.bilibili.com/v2/playurl?${payload}&sign=${sign}`);

    if (playData === null || playData === void 0 ? void 0 : (_playData$durl = playData.durl) === null || _playData$durl === void 0 ? void 0 : _playData$durl.length) {
      flvUrl = playData.durl[0].url;
      durl = playData.durl;
      break;
    }
  } // 返回值


  const videoResult = {
    videoType,
    title: `${h1Title}${part}`,
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
  }; // 解析m4s

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