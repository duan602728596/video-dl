"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _url = _interopRequireDefault(require("url"));

/**
 * @param { string } videoUrl: 视频地址
 * @return { string | null }
 *   bilibili-video: b站视频
 *   bilibili-audio: b站音频
 */
function videoType(videoUrl) {
  const urlResult = new _url.default.URL(videoUrl);
  let videoType = null; // 解析为bilibili网站

  if (/bilibili\.com$/i.test(urlResult.hostname)) {
    // 解析为视频
    if (/^\/video\/[ab]v/i.test(urlResult.pathname)) {
      videoType = 'bilibili-video';
    } // 解析为音频


    if (/^\/audio\/au/i.test(urlResult.pathname)) {
      videoType = 'bilibili-audio';
    }
  }

  if (/weibo\.com$/.test(urlResult.hostname)) {
    videoType = 'weibo-video';
  }

  return videoType;
}

var _default = videoType;
exports.default = _default;