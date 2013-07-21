define(function (require, exports, module) {

require('./canvas.css');
require('./window.event');

var iDate  = require('core/idate');
var iEvent = require('core/ievent');

var CONFIG = require('./config');
var status = require('./status');
var util   = require('modules/time.canvas.util');

var TimeCanvas = Backbone.View.extend({

    className: 'met-time-canvas',

    events: {
        'mousedown'  : 'dragStartHandler',
        'mousemove'  : 'dateHoverHandler',
        'mousewheel' : 'canvasZoomHandler'
    },

    initialize: function () {
        this.el = $(this.el);
        this.render();
        status.el = this.el;
        status.canvasWidth = this.el.width();
        this.updateVisibleDates();
    },

    render: function () {
        $(document.body).append(this.el);
        return this;
    },

    _printVisibleDates: function () {
        return false;
        var vd = status.visibleDates;
        var ds = iDate.formats(vd, 'yyyy-MM-dd');

        console.log('visible dates: ',
            ds[0], ',', ds[1], ',',
            iDate.diffDate(vd[1], vd[0]),
            status.level, status.gridWidth);
    },

    // 更新画布可视区域的日期范围
    updateVisibleDates: function () {
        var vd = status.visibleDates;
        vd[0] = status.poleDate;
        vd[1] = iDate.increase(vd[0], this.getGridAmount());

        this._printVisibleDates();
        // canvas visible dates change
        iEvent.trigger('canvas.vdchange', vd[0], vd[1]);
    },

    // 更新标杆日期
    updatePoleDate: function (offset) {
        var u = offset > 0 ? 1 : -1;
        var n = this.getGridAmount(Math.abs(offset));
        // console.log('change pole-date: ', u * n);
        status.poleDate = iDate.increase(status.poleDate, u * n);
        this.updateVisibleDates();
    },

    // 计算当前画布可视区域可容纳的 grid 数量
    getGridAmount: function (width) {
        width || (width = status.canvasWidth);
        return Math.floor(width / status.gridWidth);
    },

    // -------------------------------------------------------------------------
    // -- 鼠标在控制台中的移动，记录鼠标当前所在的日期
    // -------------------------------------------------------------------------
    dateHoverHandler: function (e) {
        var n = this.getGridAmount(e.pageX||1);
        var cd = iDate.format(iDate.increase(status.poleDate, n));
        if (cd === status.mouseDate) {
            return;
        }
        status.mouseDate = cd;
        // console.log(e.pageX, cd);
        iEvent.trigger('canvas.mousedate.change', cd);
    },

    // -------------------------------------------------------------------------
    // -- 鼠标滚轮事件，控制台的缩放处理
    // -------------------------------------------------------------------------
    canvasZoomHandler: function (e, uzoom) {
        e.preventDefault();
        // console.log('canvas.zoom.handler: ', uzoom);
        if (this.updateZoomInfo(uzoom)) {
            this.updateVisibleDates();
        }
    },

    // 更新 poleDate & gridWidth & level
    updateZoomInfo: function (zoom) {
        var nw = status.gridWidth + zoom * status.SCROLL_SIZE;
        var level = util.getLevel(nw);
        if (level.length === 0) return false;

        var mplen = iDate.diffDate(status.mouseDate, status.poleDate);
        var len = status.gridWidth * mplen;
        status.poleDate = iDate.increase(status.mouseDate,
                -1 * Math.round(len/nw));

        status.gridWidth = nw;
        if (status.level !== level) {
            status.level = level;
            status.gridDates = level === 'DATE' ? 1 : 7;
            iEvent.trigger('canvas.level.change', level);
        }
        return true;
    },

    // -------------------------------------------------------------------------
    // -- 以下为时间画布拖动相关的事件的处理
    // -------------------------------------------------------------------------
    dragStartHandler: function (e) {
        if (!e.ctrlKey) return;
        this._draggingHandler = $.proxy(this.draggingHandler, this);
        this._canvasDragEnd = $.proxy(this.canvasDragEnd, this);
        $(document).on('mousemove', this._draggingHandler);
        $(document).on('mouseup',   this._canvasDragEnd);
        this.dx = e.pageX;
        this.dy = e.pageY;
    },
    draggingHandler: function (e) {
        if (!e.ctrlKey) {
            this.canvasDragEnd(e);
            return;
        }
        var x = e.pageX;
        var y = e.pageY;
        // console.log(x, y);
        var osx = this.dx - x;
        var osy = this.dy - y;
        if (Math.abs(osx) > status.gridWidth * status.gridDates) {
            this.dx = x;
            this.dy = y;
            this.updatePoleDate(osx);
        }
    },
    canvasDragEnd: function (e) {
        // console.log('canvas.dragEnd');
        $(document).off('mousemove', this._draggingHandler);
        $(document).off('mouseup',   this._canvasDragEnd);
    }
});

// 确保每次引用的是同一个实例
var tc = window.tc = new TimeCanvas();

iEvent.on('window.resize', function (w, h) {
    var curWidth = tc.el.width();
    if ((curWidth - status.canvasWidth) !== 0) {
        status.canvasWidth = curWidth;
        tc.updateVisibleDates();
    }
});

return tc;

});