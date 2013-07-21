define(function (require, exports, module) {

var CONFIG = require('./time.canvas/config');

// 获取 LEVEL 对应的索引值
var getLevelIndex = exports.getLevelIndex = function (level) {
    return _.indexOf(CONFIG.LEVEL, level || 'DATE');
};

// 获取给定 LEVEL 的最小值
var getLevelMinWidth = exports.getLevelMinWidth = function (level) {
    var idx = getLevelIndex(level);
    return CONFIG.GRID_WIDTH[idx][0];
};

// 获取给定 LEVEL 的中间值
var getLevelMidWidth = exports.getLevelMidWidth = function (level) {
    var idx = getLevelIndex(level);
    var lw = CONFIG.GRID_WIDTH[idx];
    return Math.round((lw[0] + lw[1])/2);
};

// 获取给定 LEVEL  的最大值
var getLevelMaxWidth = exports.getLevelMaxWidth = function (level) {
    var idx = getLevelIndex(level);
    return CONFIG.GRID_WIDTH[idx][1];
};

// 给定一个宽度值，返回所属的 LEVEL
// 如果不属于所有的 LEVEL, 返回空字符串
var getLevel = exports.getLevel = function (width) {
    var gws = CONFIG.GRID_WIDTH;
    var i = 0, len = gws.length, ws, idx = -1;
    for (; i < len; i++) {
        ws = gws[i];
        if (width >= ws[0] && width <= ws[1]) {
            idx = i;
            break;
        }
    }

    if (idx === -1) {
        return '';
    }
    return CONFIG.LEVEL[idx];
};

});