/**
 * Created by developer on 2017/7/13.
 */
var _taskList = new Array();            //用来存产生的事项对象

function showHour() {
    $('#dayShow').remove();
    $('<script id="hourShow" src="../js/main.js" type="text/javascript"></script>').appendTo($("body"));
}
function showDay() {
    $('#hourShow').remove();
    $('<script id="dayShow" src="../js/main1.js" type="text/javascript"></script>').appendTo($("body"));
}