/**
 * Created by developer on 2017/7/6.
 */
//获取当前时间
setInterval(function() {
    var now = new Date();
    var nowYear = now.getFullYear();
    var nowMonth = now.getMonth()+1;
    var nowDay = now.getDate();
    var nowHour = now.getHours();
    var nowMinute = now.getMinutes();
    var nowSecond = now.getSeconds();
    var nowTime = "<strong>当前时间："+nowYear+"-"+nowMonth+"-"+nowDay+" "+nowHour+":"+nowMinute+":"+nowSecond+"</strong>";
    $('#todayTime').html(nowTime);
}, 1000);

//获取星期数
function weekChange(date) {
    var week;
    switch (date){
        case 0:week = "Sun";break;
        case 1:week = "Mon"; break;
        case 2:week = "Tus"; break;
        case 3:week = "Wed"; break;
        case 4:week = "Thu"; break;
        case 5:week = "Fri"; break;
        case 6:week = "Sat";
    }
    return week;
}

//获取每月的天数
function getDaysInMonth(month, year) {
    var days;
    switch(month)
    {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            days = 31;
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            days = 30;
            break;
        case 2:
            if (((year% 4)==0) && ((year% 100)!=0) || ((year% 400)==0))
                days = 29;
            else
                days = 28;
            break;
    }
    return (days);
}

//计算工作量
function wordloadCount(dateFrom,dateTo) {
    var workload = 0;
    var total = (dateTo.getTime()-dateFrom.getTime())/1000;
    var day = parseInt(total / (24*60*60));         //计算整数天数
    var afterDay = total - day*24*60*60;            //取得算出天数后剩余的秒数
    var hour = parseInt(afterDay/(60*60));          //计算整数小时数
    var afterHour = total/60 - day*24*60 - hour*60; //取得算出小时数后剩余的分数

    workload  = day*24+hour;
    if((parseInt(dateFrom.getMinutes())==30)&&(parseInt(dateTo.getMinutes())!=30)){
        workload = workload+0.5;
    }
    if((parseInt(dateFrom.getMinutes())!=30)&&(parseInt(dateTo.getMinutes())==30)){
        workload = workload+0.5;
    }
    return workload;
}

//创建事项对象
function Task(from, to, task) {
    var _from = new Date();
    var _to = new Date();
    var _task = task;
    var _workload = 0;
    var _alltime = 0;

    var dvArrFrom = from.split('T');
    var dvArrTo = to.split('T');
    var dvArrFromYMD = dvArrFrom[0].split('-');
    var dvArrToYMD = dvArrTo[0].split('-');

    //获取正确的时间
    if(dvArrFrom[1] == undefined){
        _from = new Date(parseInt(dvArrFromYMD[0], 10), parseInt(dvArrFromYMD[1], 10) - 1,
            parseInt(dvArrFromYMD[2], 10),0,0,0);
    }else{
        var dvArrFromHMS = dvArrFrom[1].split(':');

        if(dvArrFromHMS[0] == undefined) dvArrFromHMS[0] = 0;
        if(dvArrFromHMS[1] == undefined) dvArrFromHMS[1] = 0;
        if(dvArrFromHMS[2] == undefined) dvArrFromHMS[2] = 0;

        _from = new Date(parseInt(dvArrFromYMD[0], 10), parseInt(dvArrFromYMD[1], 10) - 1,
            parseInt(dvArrFromYMD[2], 10),parseInt(dvArrFromHMS[0],10),
            parseInt(dvArrFromHMS[1],10),parseInt(dvArrFromHMS[2],10));
    }
    if(dvArrTo[1] == undefined){
        _to = new Date(parseInt(dvArrToYMD[0], 10), parseInt(dvArrToYMD[1], 10) - 1,
            parseInt(dvArrToYMD[2], 10),0,0,0);
    }else{
        var dvArrToHMS = dvArrTo[1].split(':');

        if(dvArrToHMS[0] == undefined) dvArrToHMS[0] = 0;
        if(dvArrToHMS[1] == undefined) dvArrToHMS[1] = 0;
        if(dvArrToHMS[2] == undefined) dvArrToHMS[2] = 0;

        _to = new Date(parseInt(dvArrToYMD[0], 10), parseInt(dvArrToYMD[1], 10) - 1,
            parseInt(dvArrToYMD[2], 10),parseInt(dvArrToHMS[0],10),
            parseInt(dvArrToHMS[1],10),parseInt(dvArrToHMS[2],10));
    }

    _workload = wordloadCount(_from,_to);   //计算整个时间区域内所有的工作量
    _alltime = wordloadCount(_from,_to);

    /*    //计算去除非工作时间的工作量
     var _fmonend = new Date(_from.getFullYear(),_from.getMonth(),_from.getDate(),11,30,0);
     var _fafterend = new Date(_from.getFullYear(),_from.getMonth(),_from.getDate(),18,0,0);
     var _tmonstart = new Date(_to.getFullYear(),_to.getMonth(),_to.getDate(),8,30,0);
     var _tafterstart = new Date(_to.getFullYear(),_to.getMonth(),_to.getDate(),13,30,0);
     var _ftmp = new Date();
     var _ttmp = new Date();
     if(_from.getDate() == getDaysInMonth(_from.getMonth()+1,_from.getFullYear())){
     if(_from.getMonth() == 11){
     _ftmp.setFullYear(_from.getFullYear()+1,1,1);
     }else{
     _ftmp.setFullYear(_from.getFullYear(),_from.getMonth()+1,1);
     }
     }else{
     _ftmp.setFullYear(_from.getFullYear(),_from.getMonth(),_from.getDate()+1);
     }
     if(_to.getDate() == 1){
     if(_to.getMonth() == 0){    //1月份
     _ttmp.setFullYear(_to.getFullYear()-1,11,31);
     }else{
     _ttmp.setFullYear(_to.getFullYear(),_to.getMonth()-1,getDaysInMonth(_to.getMonth(),_to.getFullYear()));
     }
     }else{
     _ttmp.setFullYear(_to.getFullYear(),_to.getMonth(),_to.getDate()-1);
     }

     if((_from.getHours()>=8)&&(_from.getHours()<=11)){       //计算第一天的工作量
     _workload = wordloadCount(_from,_fmonend)+4.5;
     }else if((_from.getHours()>=13)&&(_from.getHours()<=18)){
     _workload = wordloadCount(_from,_fafterend);
     }
     while(Date.parse(_ftmp)<=Date.parse(_ttmp)){
     if(_ftmp.getDay()%6!=0){        //如果不是周末，就加上每天的工作量
     _workload = _workload + 7.5;
     }
     if(_ftmp.getDate() < getDaysInMonth(_ftmp.getMonth() + 1,_ftmp.getFullYear()))
     {
     _ftmp.setDate(_ftmp.getDate() + 1);
     }
     else
     {
     if(_ftmp.getMonth() == 11) //December
     {
     _ftmp.setFullYear(_ftmp.getFullYear() + 1, 0, 1);
     }
     else
     {
     _ftmp.setFullYear(_ftmp.getFullYear(),
     _ftmp.getMonth() + 1, 1);
     }
     }
     }
     if((_to.getHours()>=8)&&(_to.getHours()<=11)){       //计算最后一天的工作量
     _workload = _workload + wordloadCount(_tmonstart,_to);
     }else if((_to.getHours()>=13)&&(_to.getHours()<=18)){
     _workload = _workload + wordloadCount(_tafterstart,_to)+3;
     }*/

    this.getFrom = function(){ return _from};
    this.getTo = function(){ return _to};
    this.getTask = function(){ return _task};
    this.getWorkload = function(){ return _workload};
    this.getAlltime = function(){ return _alltime};

    this.setFrom = function(from){_from = from};
    this.setTo = function(to){_to = to};
    this.setWordload = function (workload) {_workload = workload;}
}

function Tasks(num) {
    var task;
    var from;
    var to;
    var workload;
    var _task = new Task(task,from,to,workload);
    var _num = num;

    this.getTask = function () {
        return _task;
    };
    this.getNum = function () {
        return _num;
    }
}

$(function () {     //控制左右的滚轮上下同时
    $('#itemName').scroll( function() {
        $('#ganttChart').scrollTop($(this).scrollTop());
    });
    $('#ganttChart').scroll( function() {
        $('#itemName').scrollTop($(this).scrollTop());
    });
});

var item;
var workLoad;
var from;
var to;
var ganttArea;
var num = 1;
var checknum = 1;
var zuNum = 1;
var zuItemNameNum = 1;
var bottomShow;
var bottomItem;
var bottomWork;
var zuItemName;     //当生成组时在这个区域内生成事项名
var barType;        //生成的每一行的长条
var ganttBulk;      //按照工作量生成的块区域
var deleteGantt;    //删除区域
var dragGantt;      //可以点击拉伸的区域
var itemNameBar;    //组中生成的单个的事项名
var itemName;       //左边的事项名区域
var itemsDiv;       //组区域
var zuDiv;          //组名区域
var zuDivItem;
var zutextDiv;        //显示组名
var _taskList = new Array();
var _leList = new Array();      //用来记录当前有多少事项，数组本身没有意义，数组的长度有意义
var todayRemindDiv;     //用于当前时间提示

function setUpGantt(){
    item = document.getElementById('item').value;
    from = document.getElementById('from').value;
    to = document.getElementById('to').value;
    zuCheck = document.getElementById('zu').checked

    bottomShow = document.getElementById('bottomShow');
    bottomItem = document.getElementById('bottomItem');
    bottomWork = document.getElementById('bottomWork');
    ganttArea = document.getElementById('ganttArea');
    itemName = document.getElementById('itemName');

    if((item=="")||(from=="")||(to=="")){
        alert("请确认输入不为空！！！");
    }else{
        var task = new Task(from,to,item);
        if((Date.parse(task.getFrom()))>=(Date.parse(task.getTo()))){
            alert("请确认开始时间在结束时间之前！！！");
        }else{
            if((task.getFrom().getMinutes() != 0)&&(task.getFrom().getMinutes() != 30)){
                alert("请确认开始时间是半小时制的！！！");
            }else{
                if((task.getTo().getMinutes() != 0)&&(task.getTo().getMinutes() != 30)){
                    alert("请确认结束时间是半小时制！！！");
                }else{
                    _taskList.push(task);
                    _leList.push(task);
                    workLoad = task.getWorkload();

                    var _maxDate = new Date();
                    var _minDate = new Date();
                    if(_taskList.length > 0) {
                        /*_maxDate.setFullYear(_taskList[0].getTo().getFullYear(),
                         _taskList[0].getTo().getMonth(), _taskList[0].getTo().getDate());
                         _minDate.setFullYear(_taskList[0].getFrom().getFullYear(),
                         _taskList[0].getFrom().getMonth(), _taskList[0].getFrom().getDate());*/
                        for (var i = 0; i < _taskList.length; i++) {
                            if (_taskList[i] != undefined) {
                                if (Date.parse(_taskList[i].getFrom()) < Date.parse(_minDate))
                                    _minDate.setFullYear(_taskList[i].getFrom().getFullYear(),
                                        _taskList[i].getFrom().getMonth(), _taskList[i].getFrom().getDate());
                                if (Date.parse(_taskList[i].getTo()) > Date.parse(_maxDate))
                                    _maxDate.setFullYear(_taskList[i].getTo().getFullYear(),
                                        _taskList[i].getTo().getMonth(), _taskList[i].getTo().getDate());
                            }
                        }
                    }   //找到最大和最小的时间

                    timePoint();
                    if(zuCheck){
                        var zuDivId = "item&"+num;
                        if(checknum == 1){
                            zuItemNameNum = 1;
                            var zuText;
                            itemsDiv = document.createElement("div");
                            addClass(itemsDiv,"items_div");
                            itemsDiv.style.height = 30 + "px";
                            itemsDiv.id = "zu&"+num;
                            itemsDiv.style.width = (workLoad*28) + "px";
                            ganttArea.appendChild(itemsDiv);

                            zuDiv = document.createElement("div");
                            addClass(zuDiv,"zu_div");
                            /*zuDiv.innerHTML = item;
                             zuDivItem = zuDiv.innerHTML;*/
                            zuDiv.id = item+"&"+workLoad+"&"+num;
                            zuDiv.title = "事项："+item+" "+"工作量："+workLoad;
                            zuDiv.style.width = (workLoad*28) + "px";
                            itemsDiv.appendChild(zuDiv);

                            zutextDiv = document.createElement("div");
                            zutextDiv.innerHTML = item;
                            zutextDiv.style.float = "left";
                            zutextDiv.style.overflow = "hidden";
                            zutextDiv.style.whiteSpace = "nowrap";
                            zutextDiv.style.textOverflow = "ellipsis";
                            zutextDiv.style.width = (workLoad*28-25) + "px";
                            zutextDiv.style.height = 30 + "px";
                            zuDiv.appendChild(zutextDiv);

                            deleteGantt = document.createElement("button");
                            addClass(deleteGantt,"delete_gantt");
                            deleteGantt.innerHTML = "×";
                            deleteGantt.style.float = "right";
                            deleteGantt.id="deleteAllZu"+"&"+num;
                            deleteGantt.style.float = "right";
                            zuDiv.appendChild(deleteGantt);

                            zuItemName = document.createElement("div");
                            addClass(zuItemName,"zu_item_name");
                            zuItemName.title = item;
                            zuItemName.id = "zuItemName" + num;
                            itemName.appendChild(zuItemName);

                            var zuName = document.createElement("div");
                            addClass(zuName,"zu_name");
                            zuName.id = "zuName&" + num;
                            zuName.innerHTML = item;
                            zuItemName.appendChild(zuName);

                            deleteAllZu(deleteGantt,itemsDiv);
                            dragAllZu(zuDiv,itemsDiv);
                            Show();

                            checknum ++;
                            num++;
                            zuNum++;
                        }else{
                            barType = document.createElement("div");
                            barType.id = "barType&"+num+"&"+"zu";
                            addClass(barType,"bar_type");
                            barType.style.left = 0 + "px";
                            barType.style.width = (workLoad*28) + "px";
                            /*if(parseInt(barType.style.width)>parseInt(itemsDiv.style.width)){
                             alert("组中的事项工作量不能超过组的工作量，请重新输入正确的工作量！");
                             }else*/{
                                itemsDiv.appendChild(barType);
                                itemsDiv.style.height = (parseInt(itemsDiv.style.height)+31) + "px";

                                ganttBulk = document.createElement("div");
                                ganttBulk.id = item+"&"+workLoad+"&"+num;
                                ganttBulk.title = "事项："+item+" "+"工作量："+workLoad;
                                /*ganttBulk.innerHTML = item;*/
                                ganttBulk.style.backgroundColor = "";
                                addClass(ganttBulk,"zu_gantt_bulk");
                                ganttBulk.style.width = (workLoad*28) + "px";
                                barType.appendChild(ganttBulk);

                                var textDiv = document.createElement("div");
                                textDiv.innerHTML = item;
                                textDiv.style.float = "left";
                                textDiv.style.overflow = "hidden";
                                textDiv.style.whiteSpace = "nowrap";
                                textDiv.style.textOverflow = "ellipsis";
                                textDiv.style.width = (workLoad*28-25) + "px";
                                ganttBulk.appendChild(textDiv);

                                deleteGantt = document.createElement("button");
                                addClass(deleteGantt,"delete_gantt");
                                deleteGantt.style.float = "right";
                                deleteGantt.innerHTML = "×";
                                deleteGantt.id="delete"+"&"+num+"&"+zuNum;
                                ganttBulk.appendChild(deleteGantt);

                                dragGantt = document.createElement("div");
                                dragGantt.style.float = "right";
                                addClass(dragGantt,"drag_gantt");
                                ganttBulk.appendChild(dragGantt);

                                itemNameBar = document.createElement("div");
                                addClass(itemNameBar,"item_name_bar");
                                itemNameBar.title = item;
                                itemNameBar.id = "itemNameBar" + num;
                                itemNameBar.style.fontSize = "15px";
                                itemNameBar.style.backgroundColor = "green";
                                itemNameBar.innerHTML = item;
                                zuItemName.appendChild(itemNameBar);

                                num++;
                                zuItemNameNum++;

                                var huanhang = document.createElement("div");
                                huanhang.style.height = "1px";
                                huanhang.style.width = "1000px";
                                huanhang.style.clear = "both";
                                itemsDiv.appendChild(huanhang);

                                deleteZuSingle(itemsDiv,zuItemName,deleteGantt);
                                dragZuSingle(ganttBulk,barType,zuDiv,zutextDiv,dragGantt,itemsDiv,zuItemName,textDiv);
                                Show();
                            }
                        }
                    }else{
                        var huanhang = document.createElement("div");
                        huanhang.style.clear = "both";
                        ganttArea.appendChild(huanhang);

                        checknum = 1;
                        barType = document.createElement("div");
                        barType.id = "barType&"+num;
                        barType.style.width = (workLoad*28) + 28 + "px";
                        addClass(barType,"bar_type");
                        ganttArea.appendChild(barType);

                        ganttBulk = document.createElement("div");
                        ganttBulk.id = item+"&"+workLoad;
                        ganttBulk.title = "事项："+item+" "+"工作量："+workLoad;
                        ganttBulk.innerHTML = item;
                        addClass(ganttBulk,"gantt_bulk");
                        ganttBulk.style.width = (workLoad*28) + "px";
                        //设置文字不可选取,方便拖拽
                        // IE
                        ganttBulk.unselectable = "on";
                        ganttBulk.onselectstart="javascript:return false;";
                        barType.appendChild(ganttBulk);

                        dragGantt = document.createElement("div");
                        addClass(dragGantt,"drag_gantt");
                        dragGantt.id = "drag&"+num;
                        barType.appendChild(dragGantt);

                        deleteGantt = document.createElement("button");
                        addClass(deleteGantt,"delete_gantt");
                        deleteGantt.innerHTML = "×";
                        deleteGantt.id="delete"+"&"+num;
                        barType.appendChild(deleteGantt);

                        itemNameBar = document.createElement("div");
                        addClass(itemNameBar,"item_name_bar");
                        itemNameBar.title = item;
                        itemNameBar.id = "itemNameBar" + num;
                        itemNameBar.innerHTML = item;
                        itemName.appendChild(itemNameBar);

                        /*alertRight(dragGantt);*/
                        dragBlock(ganttBulk,barType,deleteGantt,dragGantt); //控制左右拖动和改变工作量
                        /*changeWorkload(ganttBulk);*/
                        deleteF(ganttArea,itemName,deleteGantt);       //删除
                        num++;

                        var huanhang = document.createElement("div");
                        huanhang.style.clear = "both";
                        ganttArea.appendChild(huanhang);
                    }

                    //添加一块红色区域用于今日的提醒
                    var nowHour = new Date().getHours();
                    var todayLeft = document.getElementById('GC_Today'+nowHour).offsetLeft;
                    todayRemindDiv = document.createElement("div");
                    todayRemindDiv.style.position = "absolute";
                    todayRemindDiv.style.top = 0 + "px";
                    todayRemindDiv.style.left = todayLeft + "px";
                    todayRemindDiv.style.width = "28px";
                    todayRemindDiv.style.height = 30 * _leList.length + "px";
                    todayRemindDiv.style.backgroundColor = "red";
                    todayRemindDiv.style.zIndex = "0";
                    document.getElementById('colArea').appendChild(todayRemindDiv);

                    _minDate.setHours(0);
                    _minDate.setMinutes(0);
                    _minDate.setSeconds(0);
                    //对齐
                    for(var i=0;i<_taskList.length;i++){
                        if(_taskList[i]!=undefined){
                            _offSet = (Date.parse(_taskList[i].getFrom()) - Date.parse(_minDate)) /
                                (60 * 60 * 1000);
                            if(document.getElementById('barType&'+(i+1)))
                                document.getElementById('barType&'+(i+1)).style.left = _offSet * 28 +"px";
                            if(document.getElementById('zu&'+(i+1))) {
                                document.getElementById('zu&' + (i + 1)).style.left = _offSet * 28 + "px";
                            }
                            if(document.getElementById('barType&'+(i+1)+"&zu")) {
                                document.getElementById('barType&' + (i + 1) + "&zu").style.left = _offSet * 28 -
                                    parseInt(document.getElementById('barType&' + (i + 1) + "&zu").parentNode.style.left) + "px";
                            }
                        }
                    }
                    var colLine = document.getElementsByClassName("ColLine");
                    for (var i=0;i<colLine.length;i++){
                        colLine[i].style.height = 30 * (_leList.length) + "px";
                    }
                    Show();
                    /*ColorChange();*/
                }
            }
        }
    }
}
//颜色变化
var ColorChange = function () {
    var now = new Date();
    for (var i = 0;i<_taskList.length;i++){
        if(Date.parse(_taskList[i].getTo()) < Date.parse(now)){
            document.getElementById(_taskList[i].getTask() + '&' + _taskList[i].getWorkload()).style.backgroundColor = "chocolate";
        }
        if(Date.parse(_taskList[i].getFrom()) > Date.parse(now)){
            document.getElementById(_taskList[i].getTask() + '&' + _taskList[i].getWorkload()).style.backgroundColor = "orange";
        }
        if((Date.parse(_taskList[i].getFrom())<=Date.parse(now))&&(Date.parse(_taskList[i].getTo())>=Date.parse(now))){
            document.getElementById(_taskList[i].getTask() + '&' + _taskList[i].getWorkload()).style.backgroundColor = "green";
        }
    }
};

//画时间轴的函数
function timePoint() {
    var _currentDate = new Date();
    var _maxDate = new Date();
    var _minDate = new Date();
    var _dTemp = new Date();
    var _firstRowStr = "<table id='timeShow' border=1 style='border-collapse:collapse'><tr>";
    var _secondRow = "";
    var _thirdRow = "";
    var _forthRow = "";
    var _fiveRow = "";
    var _gStr = "";
    var _colSpan = 0;
    var counter = 0;
    var _cStr = "";

    _currentDate.setFullYear(_currentDate.getFullYear(), _currentDate.getMonth(),
        _currentDate.getDate());
    if(_taskList.length > 0) {
        /*_maxDate.setFullYear(_taskList[0].getTo().getFullYear(),
         _taskList[0].getTo().getMonth(), _taskList[0].getTo().getDate());
         _minDate.setFullYear(_taskList[0].getFrom().getFullYear(),
         _taskList[0].getFrom().getMonth(), _taskList[0].getFrom().getDate());*/
        for (var i = 0; i < _taskList.length; i++) {
            if (_taskList[i] != undefined) {
                if (Date.parse(_taskList[i].getFrom()) < Date.parse(_minDate))
                    _minDate.setFullYear(_taskList[i].getFrom().getFullYear(),
                        _taskList[i].getFrom().getMonth(), _taskList[i].getFrom().getDate());
                if (Date.parse(_taskList[i].getTo()) > Date.parse(_maxDate))
                    _maxDate.setFullYear(_taskList[i].getTo().getFullYear(),
                        _taskList[i].getTo().getMonth(), _taskList[i].getTo().getDate());
            }
        }

        //---- Fix _maxDate value for better displaying-----
        // Add at least 5 days

        /*if (_maxDate.getMonth() == 11) //December
        {
            if (_maxDate.getDate() + 5 > getDaysInMonth(_maxDate.getMonth() + 1,
                    _maxDate.getFullYear()))
            //The fifth day of next month will be used
                _maxDate.setFullYear(_maxDate.getFullYear() + 1, 1, 5);
            else
            //The fifth day of next month will be used
                _maxDate.setFullYear(_maxDate.getFullYear(), _maxDate.getMonth(),
                    _maxDate.getDate() + 5);
        } else {
            if (_maxDate.getDate() + 5 > getDaysInMonth(_maxDate.getMonth() + 1,
                    _maxDate.getFullYear()))
            //The fifth day of next month will be used
                _maxDate.setFullYear(_maxDate.getFullYear(), _maxDate.getMonth() + 1,
                    5);
            else
            //The fifth day of next month will be used
                _maxDate.setFullYear(_maxDate.getFullYear(), _maxDate.getMonth(),
                    _maxDate.getDate() + 5);
        }*/
        _maxDate.setFullYear(_maxDate.getFullYear(), _maxDate.getMonth(),
            _maxDate.getDate() + 5);

        //--------------------------------------------------

        _gStr = "";
        _secondRow += "</tr><tr>";
        _thirdRow += "</tr><tr>";
        _forthRow = "<tr>";
        _fiveRow = "<tr>";
        _dTemp.setFullYear(_minDate.getFullYear(), _minDate.getMonth(),
            _minDate.getDate());
        var tNum = 0;
        while (Date.parse(_dTemp) <= Date.parse(_maxDate)) {
            if (_dTemp.getDay() % 6 == 0) //Weekend
            {

                if (Date.parse(_dTemp) == Date.parse(_currentDate)) {
                    _secondRow += "<td colspan='24' style='background-color: red'><div style='width: 600px;'>" +
                        _dTemp.getDate() + "/" + weekChange(_dTemp.getDay()) + "</div></td>";
                    for (var i = 0; i < 24; i++) {
                        _cStr += "<div class='ColLine' style='position: absolute;width: 1px;height: 100px;top:0;left: "+(tNum*28)+"px;background-color: #D3D3D3'></div>";
                        _forthRow += "<td id='GC_Today" + i + "' style='background-color:red;height:" + (_taskList.length * 21) +
                            "'></td>";
                        _thirdRow += "<td style='background-color: red;width: 28px'><div style='width: 25px;text-align: center'>" + i + "</div></td>";
                        _fiveRow += "<td style='height: 10000px'></td>";
                        tNum++;
                    }
                }
                else {
                    _secondRow += "<td colspan='24' style='background-color: #5E5E5E'><div style='width: 600px;'>" +
                        _dTemp.getDate() + "/" + weekChange(_dTemp.getDay()) + "</div></td>";
                    for (var i = 0; i < 24; i++) {
                        _cStr += "<div class='ColLine' style='position: absolute;width: 1px;height: 100px;top:0;left: "+(tNum*28)+"px;background-color: #D3D3D3'></div>";
                        _thirdRow += "<td style='width: 28px;background-color: #5E5E5E'><div style='width: 25px;text-align: center'>" + i + "</div></td>";
                        _forthRow += "<td id='GC_" + (counter++) +
                            "' style='background-color: #5E5E5E;height:" + (_taskList.length * 21) +
                            "'></td>";
                        _fiveRow += "<td style='height: 10000px'></td>";
                        tNum++;
                    }
                }
            }
            else {
                if (Date.parse(_dTemp) == Date.parse(_currentDate)) {
                    _secondRow += "<td colspan='24' style='background-color: red'><div style='width: 600px;'>" +
                        _dTemp.getDate() + "/" + weekChange(_dTemp.getDay()) + "</div></td>";
                    for (var i = 0; i < 24; i++) {
                        _cStr += "<div class='ColLine' style='position: absolute;width: 1px;height: 100px;top:0;left: "+(tNum*28)+"px;background-color: #D3D3D3'></div>";
                        _forthRow += "<td id='GC_Today" + i + "' style='background-color:red;height:" + (_taskList.length * 21) +
                            "'></td>";
                        _thirdRow += "<td style='background-color: red;width: 28px'><div style='width: 25px;text-align: center'>" + i + "</div></td>";
                        _fiveRow += "<td style='height: 10000px'></td>";
                        tNum++;
                    }
                }
                else {
                    _secondRow += "<td colspan='24'><div style='width: 600px;'>" +
                        _dTemp.getDate() + "/" + weekChange(_dTemp.getDay()) + "</div></td>";
                    for (var i = 0; i < 24; i++) {
                        _cStr += "<div class='ColLine' style='position: absolute;width: 1px;height: 100px;top:0;left: "+(tNum*28)+"px;background-color: #D3D3D3'></div>";
                        _thirdRow += "<td style='width: 28px'><div style='width: 25px;text-align: center'>" + i + "</div></td>";
                        _forthRow += "<td id='GC_" + (counter++) +
                            "' style='height:" + (_taskList.length * 21) +
                            "'></td>";
                        _fiveRow += "<td style='height: 10000px'></td>";
                        tNum++;
                    }
                }

            }
            if (_dTemp.getDate() < getDaysInMonth(_dTemp.getMonth() + 1, _dTemp.getFullYear())) {
                if (Date.parse(_dTemp) == Date.parse(_maxDate)) {
                    _firstRowStr += "<td class='GMonth' colspan='" +
                        ((_colSpan + 1) * 24) + "'>M" + (_dTemp.getMonth() + 1) + "/" +
                        _dTemp.getFullYear() + "</td>";
                }
                _dTemp.setDate(_dTemp.getDate() + 1);
                _colSpan++;
            }
            else {
                _firstRowStr += "<td class='GMonth' colspan='" +
                    ((_colSpan + 1) * 24) + "'>M" + (_dTemp.getMonth() + 1) +
                    "/" + _dTemp.getFullYear() + "</td>";
                _colSpan = 0;
                if (_dTemp.getMonth() == 11) //December
                {
                    _dTemp.setFullYear(_dTemp.getFullYear() + 1, 0, 1);
                }
                else {
                    _dTemp.setFullYear(_dTemp.getFullYear(),
                        _dTemp.getMonth() + 1, 1);
                }
            }
        }
        _secondRow += "</tr>";
        _thirdRow += "</tr>";
        _forthRow += "</tr>";
        _gStr += _secondRow + _thirdRow + _forthRow;
        _gStr += "</table>";
        _gStr = _firstRowStr + _gStr;
    }
    document.getElementById('timePoint').innerHTML = _gStr;
    document.getElementById('colArea').innerHTML = _cStr;
}

//将时间转变成yyyy-mm-dd hh:mm:ss的形式
function timeChange(date) {
    var dateYear = date.getFullYear();
    var dateMonth = date.getMonth()+1;
    var dateDay = date.getDate();
    var dateHour = date.getHours();
    var dateMinute = date.getMinutes();
    var dateSecond = date.getSeconds();
    var changeTime = dateYear + "-" + dateMonth + "-" +dateDay + " " + dateHour + ":" + dateMinute + ":" + dateSecond;
    return changeTime;
}
//以表格形式展示
var Show = function () {
    var _tStr = "";
    if(_taskList == ""){
        alert("当前并未创建事项！！！");
    }else{
        _tStr+="<table id='tableShow' border='1' style='border-collapse:collapse;position:relative;text-align: center'><tr><th width='100px'>事项</th>" +
            "<th width='100px'>开始时间</th><th width='100px'>结束时间</th><th width='150px'>工作量(小时)</th></tr>";
        for(var i = 0;i<_taskList.length;i++){
            if(_taskList[i]!=undefined){
                if (_taskList[i].getTask() != ""){
                    var fromTime = timeChange(_taskList[i].getFrom());
                    var toTime = timeChange(_taskList[i].getTo());
                    _tStr+="<tr><td><div title='"+_taskList[i].getTask()+"' " +
                        "style='width: 95px;height:50px;line-height:50px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;cursor: default'>"
                        +_taskList[i].getTask()+"</div></td><td>"+fromTime+"</td><td>"+toTime+"</td><td>"+
                        _taskList[i].getWorkload()+"</td></tr>"
                }
            }
        }
        _tStr+="</table>";
        document.getElementById('itemTable').innerHTML = _tStr;
    }
};

function addClass(node,newclass){
    if(node.className.indexOf(newclass)>0){
        return;
    }
    node.className = node.className?node.className+" "+newclass:newclass;
}
//移除样式
function removeClass(node,className){
    if(typeof node.classList !='undefined'){
        node.classList.remove(className);
    }else{
        var classarr = node.className.split(/\s+/);
        var arr = [];
        for( var i=0;i<classarr.length;i++ ){
            if(classarr[i] == className)continue;
            arr.push(classarr[i]);
        }
        node.className = arr.join(" ");
    }
}

function alertRight(obj) {
    var alertDrag = document.createElement("div");
    addClass(alertDrag,"alert_drag");
    /*alertDrag.style.left = window.event.clientX + "px";
     alertDrag.style.top = window.event.clientY + "px";*/
    alertDrag.innerHTML = "请点击此处拖动改变工作量";
    document.body.appendChild(alertDrag);
    obj.onmouseover = function () {
        alertDrag.style.display = "block";
    };
    obj.onmouseout = function () {
        alertDrag.style.display = "none";
    };
    obj.onmousedown = function () {
        alertDrag.style.display = "none";
    };
    obj.onmousemove = function () {
        alertDrag.style.left = window.event.clientX +10 + "px";
        alertDrag.style.top = window.event.clientY +10 + "px";
    };
}

//单个事项鼠标拖动(1)
function dragBlock(obj,barObj,deteleObj,dragObj) {
    var disX = 0;
    var disY = 0;
    var x = 0;
    var changeWidth = 0;
    var workloadChange;
    var priWidth = obj.style.width;
    var leftChange = 0;
    var nowLeft = 0;
    var formerLeft = 0;
    var barWidth = 0;

    obj.onmousedown = function (event) {
        /*barObj.style.zIndex = "1";*/
        event.preventDefault();     //阻止事件冒泡
        disX = event.clientX - barObj.offsetLeft;
        disY = event.clientY - barObj.offsetTop;
        formerLeft = parseInt(barObj.style.left);

        var barObjText = barObj.id.split("&");
        var text = obj.id.split("&");
        /*bottomShow.innerHTML = "事项：" + text[0] + " " + "工作量：" + text[1];*/
        bottomItem.innerHTML = "事项：" + text[0];
        bottomWork.innerHTML = "工作量：" + text[1];

        //鼠标移开事件
        document.onmousemove = function (ev) {
            barObj.style.left = ev.clientX - disX + "px";
            nowLeft = parseInt(barObj.style.left);

            /*console.log(barObj.style.left);*/
            if (parseInt(barObj.style.left) < 0) {
                barObj.style.left = 0 + "px";
                nowLeft = 1;
                document.onmousemove = null;

            }
        };
        //鼠标松开事件
        document.onmouseup = function (event) {
            document.onmousemove = null;
            document.onmouseup = null;
            /*barObj.style.zIndex = "0";*/

            var dragDayNum1 = 0;                 //左右拖动超过的块数
            var nowTaskNum = parseInt(barObjText[1])-1;
            if(nowLeft > 0){
                leftChange = nowLeft - formerLeft;
                if(leftChange>=0){
                    dragDayNum1 = parseInt(leftChange / 14);         //保留整数部分
                    barObj.style.left = formerLeft + (dragDayNum1 * 14) + "px";

                    //改变开始时间和结束时间
                    var nowTaskFrom = new Date(((_taskList[nowTaskNum].getFrom())/1000+(1800*dragDayNum1))*1000);
                    var nowTaskTo = new Date(((_taskList[nowTaskNum].getTo())/1000+(1800*dragDayNum1))*1000);
                    _taskList[nowTaskNum].setFrom(nowTaskFrom);
                    _taskList[nowTaskNum].setTo(nowTaskTo);
                }else{
                    dragDayNum1 = parseInt(Math.abs(leftChange) / 14) + 1;
                    barObj.style.left = formerLeft - (dragDayNum1 * 14) + "px";

                    //改变开始时间和结束时间
                    var nowTaskFrom = new Date(((_taskList[nowTaskNum].getFrom())/1000-(1800*dragDayNum1))*1000);
                    var nowTaskTo = new Date(((_taskList[nowTaskNum].getTo())/1000-(1800*dragDayNum1))*1000);
                    _taskList[nowTaskNum].setFrom(nowTaskFrom);
                    _taskList[nowTaskNum].setTo(nowTaskTo);
                }
            }
            Show();
        };
    };
    dragObj.onmousedown = function (event) {
        event.preventDefault();     //阻止事件冒泡
        priWidth = obj.style.width;
        barWidth = barObj.style.width;
        var dragObjText = (dragObj.id).split("&");
        x = event.clientX;

        //鼠标移开事件
        document.onmousemove = function (ev) {
            changeWidth = (ev.clientX - x);
            obj.style.width = parseInt(priWidth) + changeWidth + "px";
            barObj.style.width = parseInt(barWidth) + changeWidth + "px";
        };
        //鼠标松开事件
        document.onmouseup = function (event) {
            document.onmousemove = null;
            document.onmouseup = null;

            var nowTaskNum = parseInt(dragObjText[1] - 1);
            if (changeWidth >= 0) {
                var dragDayNum2 = parseInt(changeWidth / 14) + 1;
                obj.style.width = parseInt(priWidth) + (14 * dragDayNum2) + "px";
                barObj.style.width = parseInt(barWidth) + (14 * dragDayNum2) + "px";

                //改变结束时间和工作量
                var nowTaskTo = new Date(((_taskList[nowTaskNum].getTo()) / 1000 + (1800 * (dragDayNum2))) * 1000);
                _taskList[nowTaskNum].setTo(nowTaskTo);
                _taskList[nowTaskNum].setWordload(wordloadCount(_taskList[nowTaskNum].getFrom(), _taskList[nowTaskNum].getTo()));
            } else {
                var dragDayNum2 = parseInt(Math.abs(changeWidth) / 14);
                obj.style.width = parseInt(priWidth) - (dragDayNum2 * 14) + "px";
                barObj.style.width = parseInt(barWidth) - (dragDayNum2 * 14) + "px";

                //改变结束时间和工作量
                var nowTaskTo = new Date(((_taskList[nowTaskNum].getTo()) / 1000 - (1800 * (dragDayNum2))) * 1000);
                _taskList[nowTaskNum].setTo(nowTaskTo);
                _taskList[nowTaskNum].setWordload(wordloadCount(_taskList[nowTaskNum].getFrom(), _taskList[nowTaskNum].getTo()));
            }
            obj.id = _taskList[nowTaskNum].getTask() + "&" + _taskList[nowTaskNum].getWorkload();
            Show();
        };
    }
}

//删除单个事项(1)
function deleteF(outerObj,outItemNameObj,obj) {
    obj.onmousedown=function (event){
        event.preventDefault();     //阻止事件冒泡
        var deleteId = obj.id;
        var t = deleteId.split("&");

        outerObj.removeChild(document.getElementById("barType&"+t[1]));
        delete _taskList[parseInt(t[1]-1)];
        _leList.splice(0,1);
        outItemNameObj.removeChild(document.getElementById("itemNameBar"+t[1]));

        var colLine = document.getElementsByClassName("ColLine");
        for (var i=0;i<colLine.length;i++){
            colLine[i].style.height = 30 * (_leList.length) + "px";
        }
        todayRemindDiv.style.height = 30 * _leList.length + "px";

        document.onmouseup = function () {
            Show();
        };
    };
}

//删除组(1)
function deleteAllZu(obj,outObj) {
    obj.onmousedown = function (event) {
        event.preventDefault();     //阻止事件冒泡
        var deleteId = obj.id;
        var t = deleteId.split("&");

        ganttArea.removeChild(document.getElementById("zu&"+t[1]));
        itemName.removeChild(document.getElementById("zuItemName"+t[1]));
        checknum = 1;
        delete _taskList[parseInt(t[1])-1];
        _leList.splice(0,1);

        //计算组内有几个元素
        var childs= outObj.childNodes;
        for(var i = 1;i<childs.length;i++) {
            if (childs[i].hasChildNodes()) {
                var cID = childs[i].id;
                var cText = cID.split("&");
                delete _taskList[parseInt(cText[1])-1];
                _leList.splice(0,1);
            }
        }

        var colLine = document.getElementsByClassName("ColLine");
        for (var i=0;i<colLine.length;i++){
            colLine[i].style.height = 30 * (_leList.length) + "px";
        }
        todayRemindDiv.style.height = 30 * _leList.length + "px";
        Show();
    };
}

//删除组中的单个事项(1)
function deleteZuSingle(outerObj,outItemNameObj,obj) {
    obj.onmousedown=function (event){
        event.preventDefault();     //阻止事件冒泡
        var deleteId = obj.id;
        var t = deleteId.split("&");

        outerObj.removeChild(document.getElementById("barType&"+t[1]+"&zu"));
        outItemNameObj.removeChild(document.getElementById("itemNameBar"+t[1]));

        outerObj.style.height = (parseInt(outerObj.style.height)-30) + "px";
        delete _taskList[parseInt(t[1])-1];
        _leList.splice(0,1);

        var colLine = document.getElementsByClassName("ColLine");
        for (var i=0;i<colLine.length;i++){
            colLine[i].style.height = 30 * (_leList.length) + "px";
        }
        todayRemindDiv.style.height = 30 * _leList.length + "px";

        //想着在删除组中最后一个事项时将组名和这个组区域都删除
/*        var zuText = outerObj.id.split("&");
        var childs_ = outerObj.childNodes;
        var check_Num = 0;
        for(var i=0;i<childs_.length;i++){
            if(childs_[i].hasChildNodes()){
                check_Num++;
            }
        }
        if(check_Num == 2){
            var now_left = document.getElementById(_taskList[parseInt(t[1])-1].getTask() + '&' + _taskList[parseInt(t[1])-1].getWorkload() + '&' + t[1]).style.left;
            if(confirm("你确定要删除组内的最后一个事项吗？这会导致整个组也会删除，你确定这样做吗？") == true){
                outerObj.removeChild(document.getElementById("barType&"+t[1]+"&zu"));
                outItemNameObj.removeChild(document.getElementById("itemNameBar"+t[1]));
                outerObj.style.height = (parseInt(outerObj.style.height)-30) + "px";
                delete _taskList[parseInt(t[1])-1];

                var outText = outerObj.id.split("&");
                ganttArea.removeChild(document.getElementById('zu&'+outText[1]));
                itemName.removeChild(document.getElementById("zuItemName"+outText[1]));
                checknum = 1;
                delete _taskList[parseInt(outText[1])-1];
            }else {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }else{
            outerObj.removeChild(document.getElementById("barType&"+t[1]+"&zu"));
            outItemNameObj.removeChild(document.getElementById("itemNameBar"+t[1]));

            outerObj.style.height = (parseInt(outerObj.style.height)-30) + "px";
            delete _taskList[parseInt(t[1])-1];
        }*/
        Show();
    };
}

//拖动整组(1)
function dragAllZu(obj,zuAllAreaObj) {
    var disX = 0;
    var formerLeft = 0;
    var nowLeft = 0;
    var leftChange = 0;
    obj.onmousedown = function (event) {
        event.preventDefault();     //阻止事件冒泡
        var text = obj.id.split("&");
        /*bottomShow.innerHTML = "事项：" + text[0] + " " + "工作量：" + text[1];*/
        bottomItem.innerHTML = "事项：" + text[0];
        bottomWork.innerHTML = "工作量：" + text[1];

        disX = event.clientX - zuAllAreaObj.offsetLeft;
        formerLeft = parseInt(zuAllAreaObj.style.left);

        //鼠标移开事件
        document.onmousemove = function (ev) {
            zuAllAreaObj.style.left = ev.clientX - disX + "px";
            nowLeft = parseInt(zuAllAreaObj.style.left);

            if (parseInt(zuAllAreaObj.style.left) <= 0) {
                zuAllAreaObj.style.left = 0 + "px";
                document.onmousemove = null;
                nowLeft = 1;
            }
        };
        //鼠标松开事件
        document.onmouseup = function (event) {
            document.onmousemove = null;
            document.onmouseup = null;

            var dragDayNum1 = 0;                 //左右拖动超过的块数
            var nowTaskNum = parseInt(text[2])-1;
            if(nowLeft > 0){
                leftChange = nowLeft - formerLeft;
                if(leftChange>=0){
                    dragDayNum1 = parseInt(leftChange / 14);         //保留整数部分
                    zuAllAreaObj.style.left = formerLeft + (dragDayNum1 * 14) + "px";
                    //改变整个组的开始时间和结束时间
                    if(_taskList[nowTaskNum]!=undefined){
                        var nowTaskFrom = new Date(((_taskList[nowTaskNum].getFrom())/1000+(1800*dragDayNum1))*1000);
                        var nowTaskTo = new Date(((_taskList[nowTaskNum].getTo())/1000+(1800*dragDayNum1))*1000);
                        _taskList[nowTaskNum].setFrom(nowTaskFrom);
                        _taskList[nowTaskNum].setTo(nowTaskTo);

                        //对组内每个元素的开始时间和结束时间进行变化
                        var childs= zuAllAreaObj.childNodes;
                        for(var i = 1;i<childs.length;i++) {
                            if (childs[i].hasChildNodes()) {
                                var cID = childs[i].id;
                                var cText = cID.split("&");

                                var nowTFrom = new Date(((_taskList[parseInt(cText[1])-1].getFrom())/1000+(1800*dragDayNum1))*1000);
                                var nowTTo = new Date(((_taskList[parseInt(cText[1])-1].getTo())/1000+(1800*dragDayNum1))*1000);
                                _taskList[parseInt(cText[1])-1].setFrom(nowTFrom);
                                _taskList[parseInt(cText[1])-1].setTo(nowTTo);
                            }
                        }
                    }
                }else{
                    dragDayNum1 = parseInt(Math.abs(leftChange) / 14) + 1;
                    zuAllAreaObj.style.left = formerLeft - (dragDayNum1 * 14) + "px";
                    if(_taskList[nowTaskNum]!=undefined){
                        //改变整个开始时间和结束时间
                        var nowTaskFrom = new Date(((_taskList[nowTaskNum].getFrom())/1000-(1800*dragDayNum1))*1000);
                        var nowTaskTo = new Date(((_taskList[nowTaskNum].getTo())/1000-(1800*dragDayNum1))*1000);
                        _taskList[nowTaskNum].setFrom(nowTaskFrom);
                        _taskList[nowTaskNum].setTo(nowTaskTo);

                        //对组内每个元素的开始时间和结束时间进行变化
                        var childs= zuAllAreaObj.childNodes;
                        for(var i = 1;i<childs.length;i++) {
                            if (childs[i].hasChildNodes()) {
                                var cID = childs[i].id;
                                var cText = cID.split("&");

                                var nowTFrom = new Date(((_taskList[parseInt(cText[1])-1].getFrom())/1000-(1800*dragDayNum1))*1000);
                                var nowTTo = new Date(((_taskList[parseInt(cText[1])-1].getTo())/1000-(1800*dragDayNum1))*1000);
                                _taskList[parseInt(cText[1])-1].setFrom(nowTFrom);
                                _taskList[parseInt(cText[1])-1].setTo(nowTTo);
                            }
                        }
                    }

                }
            }
            Show();
        };
    }
}

//拖动组中的单项
var outWidth = 0;       //记录每次运算后的组的宽度，在删除最后一个事项时组不跳跃
function dragZuSingle(obj,barObj,zuNameObj,zutextObj,dragObj,outObj,outItemNameObj,textObj) {
    var disX = 0;
    var disY = 0;
    var x = 0;
    var changeWidth = 0;
    var workloadChange;
    var objRight;
    var zuNameObjRight;
    var childs;
    var nowEv;
    var formerLeft = 0;
    var nowLeft = 0;
    var leftChange = 0;
    var objWidth;
    var barWidth;
    var textWidth;

    obj.onmousedown = function (event) {
        event.stopPropagation();
        event.preventDefault();     //阻止事件冒泡
        nowEv = event.clientX;
        disX = event.clientX - barObj.offsetLeft;
        formerLeft = parseInt(barObj.style.left);

        var zuText = zuNameObj.id.split("&");
        var text = obj.id.split("&");
        /*bottomShow.innerHTML = "事项："+ zuText[0] + ">" + text[0] + " " + "工作量：" + text[1];*/
        bottomItem.innerHTML = "事项：" + zuText[0] + ">" + text[0];
        bottomWork.innerHTML = "工作量：" + text[1];

        //鼠标移开事件
        document.onmousemove = function (ev) {
            barObj.style.left = ev.clientX - disX + "px";
            nowLeft = parseInt(barObj.style.left);

            if (parseInt(barObj.style.left) <= 0) {
                document.onmousemove = null;
                barObj.style.left = 0 + "px";
                nowLeft = 1;
            }
            //当拖动超出右边界时，父div的宽度随之变化
            objRight = barObj.offsetLeft + parseInt(barObj.style.width);

            zuNameObjRight = zuNameObj.offsetLeft + parseInt(zuNameObj.style.width);
            if(objRight>zuNameObjRight){
                zutextObj.style.width = objRight - 25 + "px";
                zuNameObj.style.width = objRight+"px";
                outObj.style.width = zuNameObj.style.width;
            }
        };
        //鼠标松开事件
        document.onmouseup = function (event) {
            document.onmousemove = null;
            document.onmouseup = null;

            var maxRight = 0;
            var mixLeft = 0;

            var dragDayNum1 = 0;                 //左右拖动超过的块数
            var nowTaskNum = parseInt(text[2])-1;
            if(nowLeft >   0){
                leftChange = nowLeft - formerLeft;
                if(leftChange>=0){
                    dragDayNum1 = parseInt(leftChange / 14);         //保留整数部分
                    barObj.style.left = formerLeft + (dragDayNum1 * 14) + "px";

                    if(_taskList[nowTaskNum]!=undefined){
                        //改变开始时间和结束时间
                        var nowTaskFrom = new Date(((_taskList[nowTaskNum].getFrom())/1000+(1800*dragDayNum1))*1000);
                        var nowTaskTo = new Date(((_taskList[nowTaskNum].getTo())/1000+(1800*dragDayNum1))*1000);
                        _taskList[nowTaskNum].setFrom(nowTaskFrom);
                        _taskList[nowTaskNum].setTo(nowTaskTo);
                    }
                }else{
                    dragDayNum1 = parseInt(Math.abs(leftChange) / 14) + 1;
                    barObj.style.left = formerLeft - (dragDayNum1 * 14) + "px";

                    if(_taskList[nowTaskNum]!=undefined){
                        //改变开始时间和结束时间
                        var nowTaskFrom = new Date(((_taskList[nowTaskNum].getFrom())/1000-(1800*dragDayNum1))*1000);
                        var nowTaskTo = new Date(((_taskList[nowTaskNum].getTo())/1000-(1800*dragDayNum1))*1000);
                        _taskList[nowTaskNum].setFrom(nowTaskFrom);
                        _taskList[nowTaskNum].setTo(nowTaskTo);
                    }
                }
            }

            //找到最左和最右
            childs= outObj.childNodes;
            for(var i = 1;i<childs.length;i++) {
                if(childs[i].hasChildNodes()){
                    maxRight = parseInt(childs[i].style.left) + parseInt(childs[i].style.width);
                    mixLeft = parseInt(childs[i].style.left);
                    var checkObj=childs[i];
                    break;
                }
            }
            for(var i = 1;i<childs.length;i++) {
                if(childs[i].hasChildNodes()){
                    if (maxRight < parseInt(childs[i].style.left) + parseInt(childs[i].style.width)) {
                        maxRight = parseInt(childs[i].style.left) + parseInt(childs[i].style.width);
                    }
                    if (mixLeft > parseInt(childs[i].style.left)) {
                        mixLeft = parseInt(childs[i].style.left);
                        checkObj = childs[i];
                    }
                }
            }

            if(mixLeft == 0 && maxRight ==0){
                mixLeft = 0;
                maxRight = outWidth;
            }

            zuNameObj.style.width = (maxRight-mixLeft)+"px";
            zutextObj.style.width = maxRight-mixLeft - 25 + "px";
            outObj.style.width = zuNameObj.style.width;
            outObj.style.left = parseInt(outObj.style.left) + mixLeft + "px";
            for(var i = 1;i<childs.length;i++) {
                if(childs[i].hasChildNodes()){
                    childs[i].style.left = parseInt(childs[i].style.left) - mixLeft + "px";
                }
            }
            zuNameObj.style.left = 0;

            outWidth = parseInt(outObj.style.width);

            if(checkObj!=undefined){
                checkObj.style.left = 0;

                var chId = checkObj.id;
                var chText = chId.split("&");
                /*            var chTo = new Date(((_taskList[parseInt(chText[1])-1].getFrom())/1000+(3600*_taskList[parseInt(chText[1])-1].getWorkload()))*1000);
                 _taskList[parseInt(chText[1])-1].setTo(chTo);*/

                zuNameObj.id =zuText[0]+"&" + (parseFloat(parseFloat(zuNameObj.style.width)/28)) +"&"+ zuText[2];
                _taskList[parseInt(zuText[2])-1].setFrom(_taskList[parseInt(chText[1])-1].getFrom());
                _taskList[parseInt(zuText[2])-1].setWordload(parseFloat(parseInt(zuNameObj.style.width)/28));
                _taskList[parseInt(zuText[2])-1].setTo(new Date(((_taskList[parseInt(zuText[2])-1].getFrom())/1000+(3600*_taskList[parseInt(zuText[2])-1].getWorkload()))*1000));
            }else{

            }
            Show();
        };
    };
    dragObj.onmousedown = function (event) {
        obj.onmousedown = null;
        event.preventDefault();     //阻止事件冒泡
        x = event.clientX;
        objWidth = obj.style.width;
        barWidth = barObj.style.width;
        textWidth = textObj.style.width;

        var zuText = zuNameObj.id.split("&");
        var text = obj.id.split("&");
        //用于显示
        /*bottomShow.innerHTML = "事项："+ zuText[0] + ">" + text[0] + " " + "工作量：" + text[1];*/
        bottomItem.innerHTML = "事项：" + zuText[0] + ">" + text[0];
        bottomWork.innerHTML = "工作量：" + text[1];

        //鼠标移开事件
        document.onmousemove = function (ev) {
            changeWidth = (ev.clientX - x);

            obj.style.width = parseInt(objWidth) + changeWidth + "px";
            barObj.style.width = parseInt(barWidth) + changeWidth +"px";
            textObj.style.width = parseInt(textWidth) + changeWidth + "px";

            //当拖动超出右边界时，父div的宽度随之变化
            objRight = barObj.offsetLeft + parseInt(barObj.style.width);

            zuNameObjRight = zuNameObj.offsetLeft + parseInt(zuNameObj.style.width);
            if(objRight>zuNameObjRight){
                zutextObj.style.width = objRight - 25 + "px";
                zuNameObj.style.width = objRight+"px";
                outObj.style.width = zuNameObj.style.width;
            }
        };
        //鼠标松开事件
        document.onmouseup = function (event) {
            document.onmousemove = null;
            document.onmouseup = null;

            var text = obj.id.split("&");
            var nowTaskNum = parseInt(text[2] - 1);
            if (changeWidth >= 0) {
                var dragDayNum2 = parseInt(changeWidth / 14) + 1;
                obj.style.width = parseInt(objWidth) + (14 * dragDayNum2) + "px";
                barObj.style.width = parseInt(barWidth) + (14 * dragDayNum2) + "px";

                //改变结束时间和工作量
                var nowTaskTo = new Date(((_taskList[nowTaskNum].getTo()) / 1000 + (1800 * (dragDayNum2))) * 1000);
                _taskList[nowTaskNum].setTo(nowTaskTo);
                _taskList[nowTaskNum].setWordload(wordloadCount(_taskList[nowTaskNum].getFrom(), _taskList[nowTaskNum].getTo()));
            } else {
                var dragDayNum2 = parseInt(Math.abs(changeWidth) / 14);
                obj.style.width = parseInt(objWidth) - (dragDayNum2 * 14) + "px";
                barObj.style.width = parseInt(barWidth) - (dragDayNum2 * 14) + "px";

                //改变结束时间和工作量
                var nowTaskTo = new Date(((_taskList[nowTaskNum].getTo()) / 1000 - (1800 * (dragDayNum2))) * 1000);
                _taskList[nowTaskNum].setTo(nowTaskTo);
                _taskList[nowTaskNum].setWordload(wordloadCount(_taskList[nowTaskNum].getFrom(), _taskList[nowTaskNum].getTo()));
            }
            textObj.style.width = _taskList[nowTaskNum].getWorkload()*28-25+"px";

            if(_taskList[nowTaskNum].getWorkload()<=0){
                delete _taskList[nowTaskNum];

                outObj.removeChild(document.getElementById("barType&"+(nowTaskNum+1)+"&zu"));
                outItemNameObj.removeChild(document.getElementById("itemNameBar"+(nowTaskNum+1)));

                outObj.style.height = (parseInt(outObj.style.height)-30) + "px";
                Show();
            }

            //重新将工作量存在id中
            var zuText = zuNameObj.id.split("&");
            var text = obj.id.split("&");
            workloadChange = parseFloat((parseInt(obj.style.width)) / 28);
            if(workloadChange == undefined){
                obj.id = item + "&" + workLoad + "&" + text[2];
            }else{
                obj.id = item + "&" + workloadChange + "&" +text[2];
            }
            /*bottomShow.innerHTML = "事项："+ zuText[0] + ">" + text[0] + " " + "工作量：" + text[1];*/
            bottomItem.innerHTML = "事项：" + zuText[0] + ">" + text[0];
            bottomWork.innerHTML = "工作量：" + text[1];

            //让外面的也自适应宽度
            //找到最左和最右
            childs= outObj.childNodes;
            for(var i = 1;i<childs.length;i++) {
                if(childs[i].hasChildNodes()){
                    maxRight = childs[i].offsetLeft + parseInt(childs[i].style.width);
                    mixLeft = childs[i].offsetLeft;
                    var checkObj=childs[i];
                    break;
                }
            }
            for(var i = 1;i<childs.length;i++) {
                if(childs[i].hasChildNodes()){
                    if (maxRight < childs[i].offsetLeft + parseInt(childs[i].style.width)) {
                        maxRight = childs[i].offsetLeft + parseInt(childs[i].style.width);
                    }
                    if (mixLeft > childs[i].offsetLeft) {
                        mixLeft = childs[i].offsetLeft;
                        checkObj = childs[i];
                    }
                }
            }
            zuNameObj.style.width = (maxRight)+"px";
            outObj.style.width = zuNameObj.style.width;
            //计算最外组的工作量
            zuNameObj.id =zuText[0]+"&" + (parseFloat(parseFloat(zuNameObj.style.width)/28)) +"&"+ zuText[2];
            _taskList[parseInt(zuText[2])-1].setWordload(parseFloat(parseInt(zuNameObj.style.width)/28).toFixed(1));
            _taskList[parseInt(zuText[2])-1].setTo(new Date(((_taskList[parseInt(zuText[2])-1].getFrom())/1000+(3600*_taskList[parseInt(zuText[2])-1].getWorkload()))*1000));

            obj.onmousedown = function (event) {
                event.stopPropagation();
                event.preventDefault();     //阻止事件冒泡
                nowEv = event.clientX;
                disX = event.clientX - barObj.offsetLeft;
                formerLeft = parseInt(barObj.style.left);

                var zuText = zuNameObj.id.split("&");
                var text = obj.id.split("&");
                /*bottomShow.innerHTML = "事项："+ zuText[0] + ">" + text[0] + " " + "工作量：" + text[1];*/
                bottomItem.innerHTML = "事项：" + zuText[0] + ">" + text[0];
                bottomWork.innerHTML = "工作量：" + text[1];

                //鼠标移开事件
                document.onmousemove = function (ev) {
                    barObj.style.left = ev.clientX - disX + "px";
                    nowLeft = parseInt(barObj.style.left);

                    if (parseInt(barObj.style.left) <= 0) {
                        document.onmousemove = null;
                        barObj.style.left = 0 + "px";
                        nowLeft = 1;
                    }
                    //当拖动超出右边界时，父div的宽度随之变化
                    objRight = barObj.offsetLeft + parseInt(barObj.style.width);

                    zuNameObjRight = zuNameObj.offsetLeft + parseInt(zuNameObj.style.width);
                    if(objRight>zuNameObjRight){
                        zutextObj.style.width = objRight - 25 + "px";
                        zuNameObj.style.width = objRight+"px";
                        outObj.style.width = zuNameObj.style.width;
                    }
                };
                //鼠标松开事件
                document.onmouseup = function (event) {
                    document.onmousemove = null;
                    document.onmouseup = null;

                    var maxRight = 0;
                    var mixLeft = 0;

                    var dragDayNum1 = 0;                 //左右拖动超过的块数
                    var nowTaskNum = parseInt(text[2])-1;
                    if(nowLeft >   0){
                        leftChange = nowLeft - formerLeft;
                        if(leftChange>=0){
                            dragDayNum1 = parseInt(leftChange / 14);         //保留整数部分
                            barObj.style.left = formerLeft + (dragDayNum1 * 14) + "px";

                            if(_taskList[nowTaskNum]!=undefined){
                                //改变开始时间和结束时间
                                var nowTaskFrom = new Date(((_taskList[nowTaskNum].getFrom())/1000+(1800*dragDayNum1))*1000);
                                var nowTaskTo = new Date(((_taskList[nowTaskNum].getTo())/1000+(1800*dragDayNum1))*1000);
                                _taskList[nowTaskNum].setFrom(nowTaskFrom);
                                _taskList[nowTaskNum].setTo(nowTaskTo);
                            }
                        }else{
                            dragDayNum1 = parseInt(Math.abs(leftChange) / 14) + 1;
                            barObj.style.left = formerLeft - (dragDayNum1 * 14) + "px";

                            if(_taskList[nowTaskNum]!=undefined){
                                //改变开始时间和结束时间
                                var nowTaskFrom = new Date(((_taskList[nowTaskNum].getFrom())/1000-(1800*dragDayNum1))*1000);
                                var nowTaskTo = new Date(((_taskList[nowTaskNum].getTo())/1000-(1800*dragDayNum1))*1000);
                                _taskList[nowTaskNum].setFrom(nowTaskFrom);
                                _taskList[nowTaskNum].setTo(nowTaskTo);
                            }
                        }
                    }

                    //找到最左和最右
                    childs= outObj.childNodes;
                    for(var i = 1;i<childs.length;i++) {
                        if(childs[i].hasChildNodes()){
                            maxRight = parseInt(childs[i].style.left) + parseInt(childs[i].style.width);
                            mixLeft = parseInt(childs[i].style.left);
                            var checkObj=childs[i];
                            break;
                        }
                    }
                    for(var i = 1;i<childs.length;i++) {
                        if(childs[i].hasChildNodes()){
                            if (maxRight < parseInt(childs[i].style.left) + parseInt(childs[i].style.width)) {
                                maxRight = parseInt(childs[i].style.left) + parseInt(childs[i].style.width);
                            }
                            if (mixLeft > parseInt(childs[i].style.left)) {
                                mixLeft = parseInt(childs[i].style.left);
                                checkObj = childs[i];
                            }
                        }
                    }

                    if(mixLeft == 0 && maxRight ==0){
                        mixLeft = 0;
                        maxRight = outWidth;
                    }

                    zuNameObj.style.width = (maxRight-mixLeft)+"px";
                    zutextObj.style.width = maxRight-mixLeft - 25 + "px";
                    outObj.style.width = zuNameObj.style.width;
                    outObj.style.left = parseInt(outObj.style.left) + mixLeft + "px";
                    for(var i = 1;i<childs.length;i++) {
                        if(childs[i].hasChildNodes()){
                            childs[i].style.left = parseInt(childs[i].style.left) - mixLeft + "px";
                        }
                    }
                    zuNameObj.style.left = 0;

                    outWidth = parseInt(outObj.style.width);

                    if(checkObj!=undefined){
                        checkObj.style.left = 0;

                        var chId = checkObj.id;
                        var chText = chId.split("&");
                        /*            var chTo = new Date(((_taskList[parseInt(chText[1])-1].getFrom())/1000+(3600*_taskList[parseInt(chText[1])-1].getWorkload()))*1000);
                         _taskList[parseInt(chText[1])-1].setTo(chTo);*/

                        zuNameObj.id =zuText[0]+"&" + (parseFloat(parseFloat(zuNameObj.style.width)/28)) +"&"+ zuText[2];
                        _taskList[parseInt(zuText[2])-1].setFrom(_taskList[parseInt(chText[1])-1].getFrom());
                        _taskList[parseInt(zuText[2])-1].setWordload(parseFloat(parseInt(zuNameObj.style.width)/28));
                        _taskList[parseInt(zuText[2])-1].setTo(new Date(((_taskList[parseInt(zuText[2])-1].getFrom())/1000+(3600*_taskList[parseInt(zuText[2])-1].getWorkload()))*1000));
                    }else{

                    }
                    Show();
                };
            };
            Show();
        };
    };
}

//获取每个月的天数
function getDaysInMonth(month, year) {
    var days;
    switch(month)
    {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            days = 31;
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            days = 30;
            break;
        case 2:
            if (((year% 4)==0) && ((year% 100)!=0) || ((year% 400)==0))
                days = 29;
            else
                days = 28;
            break;
    }
    return (days);
}