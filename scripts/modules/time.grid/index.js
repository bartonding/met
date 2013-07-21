define(function (require, exports, module) {

require('./grid.css');

var iDate = require('core/idate');
var iEvent = require('core/ievent');
var CONFIG = require('./config');

var status = require('modules/time.canvas/status');

var TimeGrid = Backbone.View.extend({

    className: CONFIG.CLASS.GRID_WRAP,

    events: {},

    initialize: function () {
        this.el = $(this.el);
        tc.el.append(this.el);
        this.initHeadPosition();
        this.render();
    },

    initHeadPosition: function () {
        this.head = {};
        this.totalHeight = 0;
        this.lastType = '';
        var HEIGHT = CONFIG.HEAD_HEIGHT;
        var self = this;
        _.each(CONFIG.HEAD_ORDER[status.level], function (type) {
            self.head[type] = self.totalHeight;
            self.totalHeight += HEIGHT[type];
            self.lastType = type;
        });
    },

    render: function () {
        // var _st = +new Date;
        if (CONFIG.HEAD_ORDER[status.level].length === 0) return;
        var self  = this;
        var vds   = status.visibleDates;
        var len   = iDate.diffDate(vds[1], vds[0]);
        var level = status.level;
        var outs  = [], cdate, i = -1;
        var wm    = {'MONTH': -1, 'WEEK': -1, 'SEASON': -1};
        var _wm   = {'MONTH': null, 'WEEK': null, 'SEASON': null};
        var ng    = {'MONTH': true, 'WEEK': true};

        while (i++ < len) {
            cdate = iDate.increase(vds[0], i);
            _wm['MONTH'] = iDate.getMonth(cdate);
            _wm['WEEK']  = iDate.getWeek(cdate);
            _wm['SEASON'] = iDate.getSeason(cdate)[0];
            _.each(CONFIG.HEAD_ORDER[level], function (type) {
                if (type === 'MONTH' || type === 'WEEK' || type === 'SEASON') {
                    if (wm[type] !== _wm[type]) {
                        wm[type] = _wm[type];
                        ng[type] = true;
                    } else {
                        ng[type] = false;
                        return;
                    }
                }
                outs[outs.length] = self.createGrid(cdate, type);
            });
            // 创建栅格
            if (((level === 'MONTH' || level === 'WEEK') && ng['WEEK'])
                || level === 'DATE') {
                outs[outs.length] = self.createGrid(cdate, 'GRID');
            }
        }

        // console.log('grid render time1: ', (+new Date - _st));
        this.el.empty().html(outs.join(''));
        // console.log('grid render time2: ', (+new Date - _st));
    },

    updateLevel: function (level) {
        this.initHeadPosition();
    },

    getGridId: function (date, type) {
        type || (type = 'GRID');
        var formatStr = 'yyyy_MM'; // format
        if (type === 'DATE' || type === 'DAY') formatStr += '_dd';
        if (type === 'GRID') formatStr += '_gdd';
        if (type === 'SEASON') formatStr = 'yyyy_Q';
        var id = iDate.format(date, formatStr);
        if (type === 'WEEK') {
            id += 'w' + iDate.getWeek(date);
        }
        if (type === 'DAY') {
            id += 'w';
        }
        if (type === 'SEASON') {
            id += iDate.getSeason(date)[0];
        }
        return CONFIG.ID_PREFIX + id;
    },

    // type = 'DATE' | 'WEEK' | 'MONTH'
    createGrid: function (date, type) {
        type || (type = 'GRID');
        var level  = status.level;
        var HEIGHT = CONFIG.HEAD_HEIGHT;
        var sd     = status.visibleDates[0]; // 可视的第一个日期
        var gw     = status.gridWidth; // 当前grid width，与LEVEL相关
        var left   = iDate.diffDate(date, sd) * gw;
        var gid    = this.getGridId(date, type);
        var cn     = []; // class name
        var style  = ['left:' + left + 'px;'];
        var text   = '';

        switch (type) {
            case 'GRID':
                cn.push(CONFIG.CLASS.GRID);
                if (level === 'DATE' && iDate.isWeekend(date)) {
                    cn.push(CONFIG.CLASS.WEEKEND);
                }
                // 当天或当周
                if (iDate.diffDate(date) === 0 ||
                    (level !== 'DATE' && iDate.isSomeWeek(date))) {
                    cn.push(CONFIG.CLASS.TODAY);
                }
                text = '';
                var wl = (level !== 'DATE') ? (8 - iDate.getDay(date)) : 1;
                8 - iDate.getDay(date);
                style.push('width:' + (wl * gw) + 'px;');
                break;
            case 'DATE':
                cn.push(CONFIG.CLASS.DATE);
                text = (level !== 'DATE') ? '' : iDate.format(date, 'dd');
                style.push('width:' + gw + 'px;');
                break;
            case 'DAY':
                cn.push(CONFIG.CLASS.DAY);
                if (iDate.isWeekend(date)) {
                    cn.push(CONFIG.CLASS.WEEKEND);
                }
                text = iDate.getDay(date, 'w');
                style.push('width:' + gw + 'px;');
                break;
            case 'WEEK':
                cn.push(CONFIG.CLASS.WEEK);
                text = '' + iDate.getWeek(date) + '周';
                var wl = 8 - iDate.getDay(date);
                style.push('width:' + (wl * gw) + 'px;');
                break;
            case 'MONTH':
                cn.push(CONFIG.CLASS.MONTH);
                text = iDate.format(date, 'yyyy 年 MM 月');
                var ml = iDate.getDates(date) - iDate.getDate(date) + 1;
                style.push('width:' + (ml * gw) + 'px;');
                break;
            case 'SEASON':
                cn.push(CONFIG.CLASS.SEASON);
                var ss = iDate.getSeason(date);
                text = 'Q' + ss[0];
                style.push('width:' + ((ss[1] + 1) * gw) + 'px;');
                break;
        };

        if (type !== 'GRID') {
            if (this.lastType === type) {
                cn.push(CONFIG.CLASS.LINE_HEIGHT);
            }
            style.push('height:' + HEIGHT[type] + 'px;');
            style.push('line-height:' + HEIGHT[type] + 'px;');
            style.push('top:' + this.head[type] + 'px;');
        }

        var output = [
            '<div id="' + gid + '" ',
                'class="' + cn.join(' ') + '" ',
                // 'data-date="' + iDate.format(date) + '" ',
                'style="' + style.join('') + '" ',
            '>' + text,
            '</div>'
        ];

        return output.join('');
    }

});

var tg = window.tg = new TimeGrid();

iEvent.on('canvas.vdchange', function (startDate, endDate) {
    tg.render();
});

iEvent.on('canvas.level.change', function (level) {
    tg.updateLevel(level);
});

var curMouseDateId = tg.getGridId(new Date);
iEvent.on('canvas.mousedate.change', function (date) {
    if (status.level !== 'DATE') {
        date = iDate.getStartWeek(date);
    }
    var id = tg.getGridId(iDate.parse(date));
    $('#' + curMouseDateId).removeClass(CONFIG.CLASS.HOVER);
    $('#' + id).addClass(CONFIG.CLASS.HOVER);
    curMouseDateId = id;
});

});