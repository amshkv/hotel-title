


function Datepicker($obj) {

    $.datetimepicker.setLocale('ru');

    $obj.datetimepicker({
        timepicker: false,
        format: 'j M y',
        formatDate: 'j M y',
        minDate: 0,
        scrollInput: false
    });
}


function calToPhp(d) {
    var fmt = new DateFormatter();
    var d1 = fmt.parseDate(d, 'j M y');
    var d2 = fmt.formatDate(d1, 'Y-m-d');
    return d2;
}

function phpToCal(d) {
    var fmt = new DateFormatter();
    var d1 = fmt.parseDate(d, 'Y-m-d');
    var d2 = fmt.formatDate(d1, 'j M y');
    return d2;
}


function date_short(date, time) {
    var today = new Date();
    var day = new Date(date);
    var res;

    today.setHours(0, 0, 0, 0);
    day.setHours(0, 0, 0, 0);

    if (day < today - 86400000) { // 24*60*60*1000
        // раньше чем вчера
        res = phpToCal(date);
    } else if (day < today) {
        // вчера
        res = 'вчера';
    } else {
        // сегодня или потом
        res = time;
    }
    return res;
}
