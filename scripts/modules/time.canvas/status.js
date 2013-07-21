define(function (require, exports, module) {

var CONFIG = require('./config');
var util = require('modules/time.canvas.util');

var DEF_LEVEL = 'DATE';

var CanvasStatus = {

    // 控制台容器对象
    el: null,

    // 视图级别
    level: DEF_LEVEL,

    // 基础栅格宽度，以天为计算单位，随缩放而改变
    gridWidth: util.getLevelMinWidth(DEF_LEVEL),

    // 每个栅格代表的天数
    gridDates: DEF_LEVEL === 'DATE' ? 1 : 7,

    // 当前日期
    today: new Date,

    // 标杆日期，画布最左边的日期
    poleDate: iDate.increase(new Date, -1 * (CONFIG.PRE_DATES)),

    // 当前鼠标所在日期
    mouseDate: null,

    // 画布可视区域的日期起始值
    visibleDates: [new Date, new Date],

    // 时间画布的宽度
    canvasWidth: 0,
};

_.extend(CanvasStatus, CONFIG);

return CanvasStatus;
});