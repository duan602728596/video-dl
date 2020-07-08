"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js/object/define-property");

require("core-js/modules/es.promise");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _parseVideo = require("./bilibili/parseVideo");

var _parseAudio = require("./bilibili/parseAudio");

var _parseWeiboVideo = require("./parseWeiboVideo");

const parseFunc = {
  'bilibili-video': _parseVideo.parseVideo,
  'bilibili-audio': _parseAudio.parseAudio,
  'weibo-video': _parseWeiboVideo.parseWeiboVideo
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

var _default = parse;
exports.default = _default;