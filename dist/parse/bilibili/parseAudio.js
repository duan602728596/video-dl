"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js/object/define-property");

require("core-js/modules/es.promise");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.parseAudio = parseAudio;

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/promise"));

var _url = _interopRequireDefault(require("url"));

var _axios = _interopRequireDefault(require("axios"));

/**
 * @param { string } audioUrl: 音频地址
 * @param { string } videoType: 视频类型
 * @param { object } options: 配置
 */
async function parseAudio(audioUrl, videoType, options) {
  // 解析音频id
  const urlResult = new _url.default.URL(audioUrl);
  const auid = Number(urlResult.pathname.replace(/^\/audio\/au/i, '')); // 获取相关信息

  const [audioInfoRes, audioUrlInfoRes] = await _promise.default.all([_axios.default.get(`https://www.bilibili.com/audio/music-service-c/web/song/info?sid=${auid}`), _axios.default.get(`https://www.bilibili.com/audio/music-service-c/web/url?sid=${auid}&privilege=${2}&quality=${2}`)]);
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