// 时间画布的参数值
define(function (require, exports, module) {

// 基准尺寸，单位 'px'。任何其它单位务必确保是它的整数倍
var BASIC_SIZE = 2;

return {
    'BASIC_SIZE': BASIC_SIZE,

    // 滚轮滚动一次变化的值
    'SCROLL_SIZE': BASIC_SIZE,

    // 时间画布的三种视图模式：0-日，1-周，2-月
    // 通过鼠标滚轮切换
    'LEVEL': ['DATE', 'WEEK', 'MONTH'],

    // 每个 level 下，对应的 grid width 值范围
    // 顺序与 LEVEL 中保持一致
    'GRID_WIDTH': [
        // DATE
        [ 10 * BASIC_SIZE,  50 * BASIC_SIZE],
        // WEEK
        [ 4 * BASIC_SIZE, 10 * BASIC_SIZE],
        // MONTH
        [ 3 * BASIC_SIZE, 5 * BASIC_SIZE]
    ],

    // 时间画布中，当前日期距离画布左边的天数
    'PRE_DATES': 1 * 7
};

});