"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js/object/define-property");

require("core-js/modules/es.promise");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.videoDl = videoDl;

var _videoType = _interopRequireDefault(require("./videoType"));

var _parse = _interopRequireDefault(require("./parse/parse"));

/**
 * @param { string } videoUrl: 视频地址
 * @param { object } options: 配置
 */
async function videoDl(videoUrl, options) {
  const videoType = (0, _videoType.default)(videoUrl); // 获取视频类型

  const parseResult = await (0, _parse.default)(videoUrl, videoType, options);
  return parseResult;
}