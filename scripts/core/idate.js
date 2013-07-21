/**
 * 关于时间格式的标准文档
 *     ISO 8601: http://en.wikipedia.org/wiki/ISO_8601
 *     W3C: http://www.w3.org/TR/NOTE-datetime
 *
 * 日期格式化参考:
 *     https://github.com/barbir/js-date-format
 */
define(function (require, exports, module) {

// 默认日期格式
var DEFAULT_FORMAT = 'yyyy-MM-dd';

var DEFAULT_LONG_FORMAT = 'yyyy-MM-dd hh:mm:ss.zzz';

var DEFAULT_PARSE_REGEX = '([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)'
    + '\\s?([0-9][0-9]?)?:?([0-9][0-9]?)?:?([0-9][0-9]?)?\\.?([0-9][0-9]?[0-9]?)?';

var H1 = 60 * 60 * 1000;

// 一天的毫秒数
var H24 = 24 * H1;

// 一周的毫秒数
var W7 = 7 * H24;

// 一年的毫秒数
var Y365 = 365 * H24;

// 每个月对应的天数
var monthQueue = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// 类型判断工具方法
var util = exports.util = {};
(function () {
    var toString = Object.prototype.toString;
    var tools = ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'];
    for (var i = 0; i < tools.length; i++) {
        util['is' + tools[i]] = (function(name) {
            return function (obj) {
                return toString.call(obj) == '[object ' + name + ']';
            };
        })(tools[i]);
    };
})();

var toInt = exports.toInt = function (value) {
    return parseInt(value, 10)|0;
};

/**
 * 数字位数左补齐
 * 如: pad(1, 3) -> 003
 * @param  {[type]} value  [description]
 * @param  {[type]} digits [description]
 * @return {[type]}        [description]
 */
var pad = exports.pad = function (value, digits) {
    var zeros = '';

    if (digits < 1) return '';

    for (var i = 0; i < digits; i++) {
        zeros += "0";
    }

    var output = value;

    output = zeros + value;
    output = output.substring(output.length - digits);

    return output;
};

// p判断给定的年份是否闰年
// 闰年, 返回 true, 否则, 返回 false
var isLeapYear = exports.isLeapYear = function (year) {
    return ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0))
        ? true : false ;
};

var i18n = exports.i18n = {
    week: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
    shortWeek: ['日','一','二','三','四','五','六'],
    month: ['一月','二月','三月','四月','五月','六月','七月','八月','九月',
            '十月','十一月','十二月'],
    shortMonth: ['一','二','三','四','五','六','七','八','九','十','十一',
                '十二']
};

/**
 * 按给定的格式，格式化给定的日期
 * 如：format('yyyy.MM.dd hh:mm:ss.z, MMMM.W')
 *     -> "2013.02.01 18:02:32.953, 二月.星期五"
 * arguments.length == 0
 *     date = new Date
 *     formatStr = DEFAULT_FORMAT
 * arguments.length == 1
 *     if date isString
 *         date = new Date
 *         formatStr = {formatStr}
 *         formatStr = {formatStr}
 *     else
 *         date = {date}
 *         formatStr = DEFAULT_FORMAT
 * arguments.length == 2
 *         date = {date}
 *         formatStr = {formatStr}
 * @param  {[type]} date      [description]
 * @param  {[type]} formatStr [description]
 * @return {[type]}           [description]
 */
var format = exports.format = function (date, formatStr) {
    if (util.isString(date)) {
        formatStr = date;
        date = null;
    }
    formatStr || (formatStr = DEFAULT_FORMAT);
    date   || (date   = new Date());

    var _year    = date.getFullYear();
    var _month   = date.getMonth() + 1;
    var _date    = date.getDate();
    var _day     = date.getDay();
    var _hours   = date.getHours();
    var _minutes = date.getMinutes();
    var _seconds = date.getSeconds();
    var _milliseconds = date.getMilliseconds();

    var parts       = {};
    parts['d']      = _date;
    parts['dd']     = pad(_date, 2);
    parts['w']      = i18n.shortWeek[_day];
    parts['W']      = i18n.week[_day];
    parts['M']      = _month;
    parts['MM']     = pad(_month, 2);
    parts['MMM']    = i18n.shortMonth[_month - 1];
    parts['MMMM']   = i18n.month[_month - 1];
    parts['yyyy']   = _year;
    parts['yyy']    = pad(_year, 2) + 'y';
    parts['yy']     = pad(_year, 2);
    parts['y']      = 'y';
    parts['h']      = _hours;
    parts['hh']     = pad(_hours, 2);
    parts['m']      = _minutes;
    parts['mm']     = pad(_minutes, 2);
    parts['s']      = _seconds;
    parts['ss']     = pad(_seconds, 2);
    parts['z']      = _milliseconds;
    parts['zz']     = _milliseconds + 'z';
    parts['zzz']    = pad(_milliseconds, 3);

    var i = 0;
    var output = '';
    var token = '';

    while (i < formatStr.length) {

        token = formatStr.charAt(i);

        while((i + 1 < formatStr.length)
            && parts[token + formatStr.charAt(i + 1)] !== undefined) {
            token += formatStr.charAt(++i);
        }

        if (parts[token] !== undefined) {
            output += parts[token];
        } else {
            output += token;
        }

        i++;
    }
    return output;
};

var formats = exports.formats = function (dates, formatStr) {
    dates || (dates = []);
    formatStr || (formatStr = DEFAULT_LONG_FORMAT);

    _.each(dates, function (date, idx) {
        dates[idx] = format(parse(date), formatStr);
    });

    return dates;
};

var toString = exports.toString = function (date) {
    date || (date = new Date);
    return format(date, DEFAULT_LONG_FORMAT);
};

/**
 * 转化一个指定格式的日期字符串为时间对象
 * 默认时间格式见 DEFAULT_FORMAT = 'yyyy-MM-dd'
 * 如：btDate.toDate('2012-04-02')
 *     -> Date 实例
 *
 * 这里未使用 Date.parse，因为如下:
 *     1）各浏览器对解析格式存在差异
 *     2）自行实现，可支持自定义格式的解析
 * @param  {[type]} value     [description]
 * @param  {[type]} formatStr [description]
 * @return {[type]}           [description]
 */
var parse = exports.parse = function (date, formatStr) {
    if (arguments.length === 0) {
        throw Error('function "toDate" need at least one parameter');
    }
    if (util.isDate(date)) {
        return date;
    }
    if (util.isNumber(date)) {
        return new Date(date);
    }
    // formatStr || (formatStr = DEFAULT_FORMAT);

    var output      = new Date(0);
    var parts       = {};
    parts['d']      = '([0-9][0-9]?)';
    parts['dd']     = '([0-9][0-9])';
    parts['M']      = '([0-9][0-9]?)';
    parts['MM']     = '([0-9][0-9])';
    parts['yyyy']   = '([0-9][0-9][0-9][0-9])';
    parts['yyy']    = '([0-9][0-9])[y]';
    parts['yy']     = '([0-9][0-9])';
    parts['hh']     = '([0-9][0-9])';
    parts['h']      = '([0-9][0-9]?)';
    parts['m']      = '([0-9][0-9]?)';
    parts['mm']     = '([0-9][0-9])';
    parts['s']      = '([0-9][0-9]?)';
    parts['ss']     = '([0-9][0-9])';
    parts['z']      = '([0-9][0-9]?[0-9]?)';
    parts['zz']     = '([0-9][0-9][0-9]?)[z]';
    parts['zzz']    = '([0-9][0-9][0-9])';

    var i = 0;
    var regex = "";
    var outputs = [];

    if (formatStr) {
        var token = "";
        while (i < formatStr.length) {
            token = formatStr.charAt(i);
            while((i + 1 < formatStr.length)
                && parts[token + formatStr.charAt(i + 1)] !== undefined) {
                token += formatStr.charAt(++i);
            }

            if (parts[token] !== undefined) {
                regex += parts[token];
                outputs[outputs.length] = token;
            } else {
                regex += token;
            }

            i++;
        }
    } else {
        regex = DEFAULT_PARSE_REGEX;
        outputs = DEFAULT_LONG_FORMAT.split(/-|\s|:|\./);
    }

    var r = new RegExp(regex);
    var matches = date.match(r);

    if(matches === undefined || matches.length - 1 !== outputs.length) {
        return undefined;
    }

    // console.log('outputs: ', outputs);
    // console.log('regex: ', regex);
    // console.log('date: ', date);
    // console.log('matches: ', matches);
    for(i = 1; i <= outputs.length; i++) {
        switch (outputs[i-1]) {
            case 'yyyy':
            case 'yyy':
                output.setYear(toInt(matches[i]));
                break;
            case 'yy':
                output.setYear(2000 + toInt(matches[i]));
                break;
            case 'MM':
            case 'M':
                output.setMonth(toInt(matches[i]) - 1);
                break;
            case 'dd':
            case 'd':
                output.setDate(toInt(matches[i]));
                break;
            case 'hh':
            case 'h':
                output.setHours(toInt(matches[i]));
                break;
            case 'mm':
            case 'm':
                output.setMinutes(toInt(matches[i]));
                break;
            case 'ss':
            case 's':
                output.setSeconds(toInt(matches[i]));
                break;
            case 'zzz':
            case 'zz':
            case 'z':
                output.setMilliseconds(toInt(matches[i]));
                break;
        }
    }
    return output;
};

/**
 * 给定月份，返回该月份的天数
 * 如果参数为空，返回当前月份的天数
 * 闰年的 2 月为 29 天
 * 参数支持纯数字和字符串式数字，非法参数放回 undefined
 * @param  {[type]} month 对应自然月份
 * @return {[type]}       [description]
 */
var getDates = exports.getDates = function (date) {
    date || (date = new Date);
    date = parse(date);
    var y = date.getFullYear();
    var m = date.getMonth();
    return (isLeapYear(y) && m === 1) ? 29 : monthQueue[m];
};

// 常规Date方法的支持，挂到 exports 下
// 支持传入指定格式
(function () {
var fn = ['getDate', 'getDay', 'getMonth', 'getYear', 'getHours', 'getMinutes',
          'getSeconds', 'getMilliseconds'];
var reg = ['^[d]{1,2}$', '^[wW]$', '^[M]{1,2}$', '^[y]{2,4}$', '^[h]{1,2}$', '^[m]{1,2}$',
           '^[s]{1,2}$', '^[z]{1,3}$'];
for (var i = 0; i < fn.length; i++) {
    exports[fn[i]] = (function(fnName, regStr) {
        return function (date, fstr) {
            var argLen = arguments.length;
            if (argLen === 1 && util.isString(date)
                && new RegExp(regStr).test(date)) {
                fstr = date;
                date = null;
            }

            date || (date = new Date);
            date = parse(date);

            return fstr ? format(date, fstr) : date[fnName]();
        };
    })(fn[i], reg[i]);
};
})();
// 为内部访问的便利
var getDay          = exports.getDay;
var getMonth        = exports.getMonth;
var getYear         = exports.getYear;
var getHours        = exports.getHours;
var getMinutes      = exports.getMinutes;
var getSeconds      = exports.getSeconds;
var getMilliseconds = exports.getMilliseconds;

/**
 * 判断给定的日期是否是周末
 * @param  {[type]}  date [description]
 * @return {Boolean}      [description]
 */
var isWeekend = exports.isWeekend = function (date) {
    var day = getDay(date);
    return day === 0 || day === 6;
};

/**
 * 返回指定日期的时间戳
 * 默认日期为当前日期
 * @param  {[type]} date [description]
 * @return {[type]}      [description]
 */
var getTime = exports.getTime = function (date){
    date || (date = new Date);
    return parse(date).getTime();
};

/**
 * 两个日期之间的时间戳差（毫秒/ms）
 *
 * @param  {[type]} t1 [description]
 * @param  {[type]} t2 [description]
 * @return {[type]}    [description]
 */
var diffTime = exports.diffTime = function (t1, t2) {
    return getTime(t1) - getTime(t2);
};

/**
 * 两个日期之间相差的天数
 * @param  {[type]} t1 [description]
 * @param  {[type]} t2 [description]
 * @return {[type]}    [description]
 */
var diffDate = exports.diffDate = function (t1, t2) {
    if (arguments.length === 1) {
        t2 = format(DEFAULT_FORMAT);
    }
    var dt = diffTime(format(t1, DEFAULT_FORMAT), t2);
    var sc = dt < 0 ? -1 : 1;
    return sc * Math.floor(Math.abs(dt/H24));
};

/**
 * 给定的日期，增加指定天数
 * 默认增加一天
 * 单位说明：
 *     W：周
 *     D：天
 *     H：小时
 *     M：分钟
 *     S：秒
 *     MS：毫秒
 * @param  {[type]} date  [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
var unitValue = {'W': W7, 'D': H24, 'H': H1, 'M': H1/60, 'S': 1000, 'MS': 1};
var increase = exports.increase = function (date, value) {
    var argLen = arguments.length;
    if (argLen === 1) {
        value = date;
        date = null;
    }
    if (!util.isNumber(value)) {
        value || (value = '1D');
    }

    var date = format(date, DEFAULT_FORMAT);
    var stime = getTime(date);
    var m = ('' + value).match(/([^\d\s]+)$/);
    var u = m ? m[1] : 'D'; // 默认单位为 天
    u = u.toUpperCase();
    value = toInt(value) * unitValue[u];

    return parse(stime + value);
};

/**
 * 给定日期，返回该日期对应第几周
 * @param  {[type]} date [description]
 * @return {[type]}      [description]
 */
var getWeek = exports.getWeek = function (date) {
    date || (date = new Date);
    date = parse(date);

    // 本年的第一天
    var sDate = parse(date.getFullYear() + '-01-01');
    // 本年第一周结束的时间戳
    // var endFirstWeek = increase(sDate, (6 - getDay(sDate))).getTime();
    var endFirstWeek = getEndWeek(sDate).getTime();
    var offset = date.getTime() - endFirstWeek;
    if (offset <= 0) {
        return 1;
    }
    return Math.ceil(offset/W7) + 1;
};

var getStartWeek = exports.getStartWeek = function (date) {
    date || (date = new Date);
    date = parse(date);
    var day = date.getDay();
    day = day === 0 ? 7 : day;
    return increase(date, -1 * day + 1);
};

var getEndWeek = exports.getEndWeek = function (date) {
    date || (date = new Date);
    date = parse(date);
    var day = date.getDay();
    day = day === 0 ? 7 : day;
    return increase(date, (7 - day));
};

/**
 * 判断给定的两个日期是否为同一周
 * 第二个参数为空时，默认为当天
 * @param  {[type]}  d1 [description]
 * @param  {[type]}  d2 [description]
 * @return {Boolean}    [description]
 */
var isSomeWeek = exports.isSomeWeek = function (d1, d2) {
    return getWeek(d1) === getWeek(d2);
};

/**
 * 给定日期返回
 *     [季度, 距离季末还有多少天, 距离季初已经过去多少天]
 * @type {[type]}
 */
// var _season = [['01-01', '03-31'], ['04-01', '06-30'],
//                ['07-01', '09-30'], ['10-01', '12-31']];
var _season = [[1,1, 3,31], [ 4,1,  6,30],
               [7,1, 9,30], [10,1, 12,31]];
var getSeason = exports.getSeason = function (date) {
    date || (date = new Date);
    var date = parse(date);
    var fullyear = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var s = _season;
    var season = 0, remain = 0, passed, i, len;
    for (i = 0, len = s.length; i < len; i++) {
        if (m >= s[i][0] && m <= s[i][2]) {
            season = i + 1;
            remain = diffDate(
                fullyear + '-' + s[i][2] + '-' + s[i][3],
                date
            );
            passed = diffDate(
                date,
                fullyear + '-' + s[i][0] + '-' + s[i][1]
            );
            break;
        }
    }
    return [season, remain, passed];
};

// 用于测试
window.iDate = exports;

});