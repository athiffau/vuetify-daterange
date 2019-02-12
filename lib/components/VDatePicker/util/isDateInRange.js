function dateFromStr(strDate) {
    var deltaDay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var deltaMonth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var deltaYear = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    if (typeof strDate === 'string') {
        var yr = parseInt(strDate.substring(0, 4));
        var mon = parseInt(strDate.substring(5, 8));
        var dt = parseInt(strDate.substring(8, 10));
        var d = new Date(yr, mon - 1, dt);
        if (typeof d.setMonth === 'function') {
            d.setMonth(d.getMonth() + deltaMonth, d.getDate() + deltaDay);
            d.setFullYear(d.getFullYear() + deltaYear);
            return d;
        }
    }
    return null;
}
export default function isDateInRange(date, range) {
    var dateToCheck = dateFromStr(date);
    if (Array.isArray(range)) {
        if (typeof range[0] === 'string' && typeof range[1] === 'string') {
            var startDate = dateFromStr(range[0]);
            var endDate = dateFromStr(range[1]);
            return startDate && endDate && dateToCheck ? startDate.getTime() <= dateToCheck.getTime() && endDate.getTime() >= dateToCheck.getTime() : false;
        }
    }
    return false;
}
export function isHoverAfterStartDate(btnDate, startDate, hoveringDate) {
    var _me = dateFromStr(btnDate);
    var _std = dateFromStr(startDate);
    var _htd = dateFromStr(hoveringDate);
    return _std && _htd && _me ? _me.getTime() >= _std.getTime() && _me.getTime() <= _htd.getTime() && _std.getTime() < _htd.getTime() : false;
}
//# sourceMappingURL=isDateInRange.js.map