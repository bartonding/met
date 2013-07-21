define(function (require, exports, module) {

var BASIC_SIZE = 10;

return {

    // 'date' | 'week' | 'month' grid 的ID前缀
    'ID_PREFIX' : 'met_grid_',

    // grid 涉及的 className
    'CLASS': {
        'GRID'       : 'met-grid',
        'GRID_WRAP'  : 'met-grid-wrap',
        'TODAY'      : 'met-grid-today',
        'DATE'       : 'met-grid-date',
        'DAY'        : 'met-grid-day',
        'WEEK'       : 'met-grid-week',
        'WEEKEND'    : 'met-grid-weekend',
        'MONTH'      : 'met-grid-month',
        'SEASON'     : 'met-grid-season',

        // 顶部日期中高亮行，通常用于最后一行
        'LINE_HEIGHT': 'met-lineheight',
        'HOVER'      : 'met-grid-hover'
    },

    // 日|周|月的高度 & 是否显示 & 顺序
    'HEAD_HEIGHT': {
        'DATE'  : 2 * BASIC_SIZE,
        'DAY'   : 2 * BASIC_SIZE,
        'WEEK'  : 2 * BASIC_SIZE,
        'MONTH' : 2 * BASIC_SIZE,
        'SEASON': 2 * BASIC_SIZE
    },

    'HEAD_ORDER': {
        'DATE'  : ['MONTH', 'WEEK', 'DAY', 'DATE'],
        'WEEK'  : ['MONTH', 'WEEK', 'DATE'],
        'MONTH' : ['MONTH', 'SEASON', 'WEEK']
    }
};

});