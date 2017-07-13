/**
 * Created by developer on 2017/7/10.
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
    var nowTime = "<h4>当前时间："+nowYear+"-"+nowMonth+"-"+nowDay+" "+nowHour+":"+nowMinute+":"+nowSecond+"</h4>";
    $('#todayTime').html(nowTime);
}, 1000);


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

//创建事项对象
function Task(from, to, task) {
    var _from = new Date();
    var _to = new Date();
    var _task = task;
    var _workload = DateDiff(from,to);
    var dvArrFrom = from.split('-');
    var dvArrTo = to.split('-');

    _from.setFullYear(parseInt(dvArrFrom[0], 10), parseInt(dvArrFrom[1], 10) - 1,
        parseInt(dvArrFrom[2], 10));
    _to.setFullYear(parseInt(dvArrTo[0], 10), parseInt(dvArrTo[1], 10) - 1,
        parseInt(dvArrTo[2], 10));

    this.getFrom = function(){ return _from};
    this.getTo = function(){ return _to};
    this.getTask = function(){ return _task};
    this.getWorkload = function(){ return _workload};

    this.setFrom = function(from){_from = from};
    this.setTo = function(to){_to = to};
    this.setWordload = function (workload) {_workload = workload;}
}

/*var _taskList = new Array();            //用来存产生的事项对象*/
var _num = 0;                           //用于记数产生提示竖线

//主要对象，用于控制在页面中生成图
function Gantt(gDiv,tDiv) {
    var _GanttDiv = gDiv;
    var _TaskShowDiv = tDiv;

    //添加事项到数组中
    this.AddTaskDetail = function(value) {
        _taskList.push(value);

    };
    this.Draw = function() {
        var _offSet = 0;
        var _dateDiff = 0;
        var _currentDate = new Date();
        var _maxDate = new Date();
        var _minDate = new Date();
        var _dTemp = new Date();
        var _firstRowStr = "<table border=1 style='border-collapse:collapse'><tr><td rowspan='2' width='200px' style='width:200px;'><div class='GTaskTitle' style='width:200px;'>Task</div></td>";
        var _thirdRow = "";
        var _gStr = "";
        var _colSpan = 0;
        var counter = 0;

        _currentDate.setFullYear(_currentDate.getFullYear(), _currentDate.getMonth(),
            _currentDate.getDate());
        if(_taskList.length > 0)
        {
            /*_maxDate.setFullYear(_taskList[0].getTo().getFullYear(),
             _taskList[0].getTo().getMonth(), _taskList[0].getTo().getDate());
             _minDate.setFullYear(_taskList[0].getFrom().getFullYear(),
             _taskList[0].getFrom().getMonth(), _taskList[0].getFrom().getDate());*/
            for(var i = 0; i < _taskList.length; i++)
            {
                if(_taskList[i]!=undefined){
                    if(Date.parse(_taskList[i].getFrom()) < Date.parse(_minDate))
                        _minDate.setFullYear(_taskList[i].getFrom().getFullYear(),
                            _taskList[i].getFrom().getMonth(), _taskList[i].getFrom().getDate());
                    if(Date.parse(_taskList[i].getTo()) > Date.parse(_maxDate))
                        _maxDate.setFullYear(_taskList[i].getTo().getFullYear(),
                            _taskList[i].getTo().getMonth(), _taskList[i].getTo().getDate());
                }
            }

            //---- Fix _maxDate value for better displaying-----
            // Add at least 5 days

            if(_maxDate.getMonth() == 11) //December
            {

                if(_maxDate.getDay() + 5 > getDaysInMonth(_maxDate.getMonth() + 1,
                        _maxDate.getFullYear()))
                //The fifth day of next month will be used
                    _maxDate.setFullYear(_maxDate.getFullYear() + 1, 1, 5);
                else
                //The fifth day of next month will be used
                    _maxDate.setFullYear(_maxDate.getFullYear(), _maxDate.getMonth(),
                        _maxDate.getDate() + 5);            }
            else
            {
                if(_maxDate.getDay() + 5 > getDaysInMonth(_maxDate.getMonth() + 1,
                        _maxDate.getFullYear()))
                //The fifth day of next month will be used
                    _maxDate.setFullYear(_maxDate.getFullYear(), _maxDate.getMonth() + 1,
                        5);
                else
                //The fifth day of next month will be used
                    _maxDate.setFullYear(_maxDate.getFullYear(), _maxDate.getMonth(),
                        _maxDate.getDate() + 5);
            }

            //--------------------------------------------------

            _gStr = "";
            _gStr += "</tr><tr>";
            _thirdRow = "<tr><td></td>";
            _dTemp.setFullYear(_minDate.getFullYear(), _minDate.getMonth(),
                _minDate.getDate());
            var tNum = 0;
            while(Date.parse(_dTemp) <= Date.parse(_maxDate))
            {
                _gStr+="<div style='position:absolute;top: 38px;left:"+(203+27*tNum)+"px;background-color:#D3D3D3;width: 1px;height: 1000px;'></div>";  //画几条竖线用来提示
                if(_dTemp.getDay() % 6 == 0) //Weekend
                {
                    if(Date.parse(_dTemp) == Date.parse(_currentDate))
                    {
                        _gStr += "<td class='GWeekend' style='background-color:red'><div style='width:24px;'>" +
                            _dTemp.getDate() + "</div></td>";
                        _thirdRow += "<td id='GC_Today' class='GToDay' style='background-color:red;height:" +
                            (_taskList.length * 21) + "'> </td>";
                    }
                    else
                    {
                        _gStr += "<td class='GWeekend'><div style='width:24px;'>" +
                            _dTemp.getDate() + "</div></td>";
                        _thirdRow += "<td id='GC_" + (counter++) +
                            "' class='GWeekend' style='height:" + (_taskList.length * 21) +
                            "'></td>";
                    }

                }
                else
                {
                    if(Date.parse(_dTemp) == Date.parse(_currentDate)){
                        _gStr += "<td class='GDay' style='background-color: red'><div style='width:24px;'>" +
                            _dTemp.getDate() + "</div></td>";
                        _thirdRow += "<td id='GC_Today' class='GToDay' style='background-color:red;height:" + (_taskList.length * 21) +
                            "'></td>";
                    }
                    else
                    {
                        _gStr += "<td class='GDay'><div style='width:24px;'>" +
                            _dTemp.getDate() + "</div></td>";
                        _thirdRow += "<td id='GC_" + (counter++) +
                            "' class='GDay'></td>";
                    }

                }
                if(_dTemp.getDate() < getDaysInMonth(_dTemp.getMonth() + 1,
                        _dTemp.getFullYear()))
                {
                    if(Date.parse(_dTemp) == Date.parse(_maxDate))
                    {
                        _firstRowStr += "<td class='GMonth' colspan='" +
                            (_colSpan + 1) + "'>M" + (_dTemp.getMonth() + 1) + "/" +
                            _dTemp.getFullYear() + "</td>";
                    }
                    _dTemp.setDate(_dTemp.getDate() + 1);
                    _colSpan++;
                }
                else
                {
                    _firstRowStr += "<td class='GMonth' colspan='" +
                        (_colSpan + 1) + "'>M" + (_dTemp.getMonth() + 1) +
                        "/" + _dTemp.getFullYear() + "</td>";
                    _colSpan = 0;
                    if(_dTemp.getMonth() == 11) //December
                    {
                        _dTemp.setFullYear(_dTemp.getFullYear() + 1, 0, 1);
                    }
                    else
                    {
                        _dTemp.setFullYear(_dTemp.getFullYear(),
                            _dTemp.getMonth() + 1, 1);
                    }
                }
                tNum++;
            }
            _thirdRow += "</tr>";
            _gStr += "</tr>" + _thirdRow;
            _gStr += "</table>";
            _gStr = _firstRowStr + _gStr;
            _gStr += "<div id='ganttArea' style='position: absolute;left: 204px;width: auto;height: 800px'>";
            for(i = 0; i < _taskList.length; i++)
            {
                if(_taskList[i]!=undefined) {
                    _offSet = (Date.parse(_taskList[i].getFrom()) - Date.parse(_minDate)) /
                        (24 * 60 * 60 * 1000);
                    _dateDiff = (Date.parse(_taskList[i].getTo()) -
                        Date.parse(_taskList[i].getFrom())) / (24 * 60 * 60 * 1000);
                    _gStr += "<div id='bartype&" + i + "' style='position:relative;left:" + (_offSet * 27) + "px;width:" +
                        (27 * _dateDiff - 1 + 100) + "px;height: 18px'><div title='" +
                        _taskList[i].getTask() + "'id='"+i+"&"+_taskList[i].getTask()+"' class='GTask' style='float:left;width:" +
                        (27 * _dateDiff - 1) + "px;'>" +
                        "</div><div id='drag&"+i+"&"+_taskList[i].getTask() +"' class='GDrag'></div><button id='delete&" + i + "&" + _taskList[i].getTask() + "' class='GDelete'>×</button></div>";
                }
            }
            _gStr+="</div><div id='taskNameArea' style='position: absolute;left: 0;width: auto;height: auto'>";
            for(var i=0;i<_taskList.length;i++){
                if (_taskList[i]!=undefined){
                    _gStr += "<div id='taskName&"+i+"' style='position:relative;height: 17px; left:5px;border-bottom: 1px solid black'>" + _taskList[i].getTask() +
                        "</div>";
                    _gStr+="<div style='position:absolute;background-color:#D3D3D3;width: 2000px;height: 1px;'></div>";  //画几条横线用来提示
                }
            }
            _gStr+="</div>";

            /*showTask(_tStr);*/

            _GanttDiv.innerHTML = _gStr;

            //添加一块红色区域用于今日的提醒
            var todayLeft = document.getElementById('GC_Today').offsetLeft;
            var todayRemindDiv = document.createElement("div");
            todayRemindDiv.style.position = "absolute";
            todayRemindDiv.style.left = todayLeft + "px";
            todayRemindDiv.style.width = "27px";
            todayRemindDiv.style.height = "1000px";
            todayRemindDiv.style.backgroundColor = "red";
            todayRemindDiv.style.zIndex = "-1";
            document.getElementById('GanttChart').appendChild(todayRemindDiv);
        }
    };
    this.drag = function () {
        //将删除和拖拽函数应用于每一个块
        for (var i=0;i<_taskList.length;i++){
            if(_taskList[i]!=undefined){
                var ganttObj = document.getElementById(i+'&'+_taskList[i].getTask());
                var deleteObj = document.getElementById('delete&'+i+"&"+_taskList[i].getTask());
                var dragObj = document.getElementById('drag&'+i+"&"+_taskList[i].getTask());
                var barObj = document.getElementById('bartype&'+i);
                var ganttAreaObj = document.getElementById('ganttArea');
                var nameObj = document.getElementById('taskNameArea');
                deleteGantt(deleteObj,ganttAreaObj,nameObj);
                dragBlock(ganttObj,dragObj,barObj);
                /*dragChange(dragObj,ganttObj,barObj);*/
            }
        }
    };
    this.Show = function () {
        var _tStr = "";
        //将事项表格添加到页面当中
        _tStr+="<table id='tableShow' border='1' style='border-collapse:collapse;position:relative;text-align: center'><tr><th width='100px'>事项</th>" +
            "<th width='100px'>开始时间</th><th width='100px'>结束时间</th><th width='100px'>工作量(天)</th></tr>";
        for(var i = 0;i<_taskList.length;i++){
            if(_taskList[i]!=undefined){
                if (_taskList[i].getTask() != ""){
                    var fromTime = timeChange(_taskList[i].getFrom());
                    var toTime = timeChange(_taskList[i].getTo());
                    _tStr+="<tr><td>"+_taskList[i].getTask()+"</td><td>"+fromTime+"</td><td>"+toTime+"</td><td>"+
                        _taskList[i].getWorkload()+"</td></tr>"
                }
            }
        }
        _tStr+="</table>";
        _TaskShowDiv.innerHTML = _tStr;
    }
}

//将时间转变成yyyy-mm-dd的形式
function timeChange(date) {
    var dateYear = date.getFullYear();
    var dateMonth = date.getMonth()+1;
    var dateDay = date.getDate();
    var changeTime = dateYear + "-" + dateMonth + "-" +dateDay;
    return changeTime;
}

/*//以表格的形式展示事项
 function showTask() {
 for (var i = 0;i<_taskList.length;i++){
 if(_taskList[i] != undefined){
 var fromTime = timeChange(_taskList[i].getFrom());
 var toTime = timeChange(_taskList[i].getTo());
 }
 }
 }*/

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

function deleteGantt(obj,ganttObj,taskNameObj) {
    obj.onmousedown=function (event){
        var deleteId = obj.id;
        var t = deleteId.split("&");

        ganttObj.removeChild(document.getElementById("bartype&"+t[1]));
        taskNameObj.removeChild(document.getElementById("taskName&"+t[1]));

        var deleteNum = parseInt(t[1]);     //当前删除的序号

        delete _taskList[deleteNum];        //删除数组中的当前元素，但数组长度不变
        /*for(var i = deleteNum+1;i<_taskList.length;i++){      //因为是绝对定位，将删除事项后的空白行也删除
         if (document.getElementById("bartype&"+i)!=null){
         document.getElementById("bartype&"+i).style.top = parseInt(document.getElementById("bartype&"+i).style.top) - 20 + "px";
         document.getElementById("taskName&"+i).style.top = document.getElementById("bartype&"+i).style.top;
         }
         }*/
    };
    _num++;
}

//拖动事项块
function dragBlock(obj,dragObj,barObj) {
    var disX = 0;
    var leftChange = 0;                 //左右移动变化量
    var formerEv = 0;                   //鼠标落下时的鼠标位置
    var nowEv = 0;                      //鼠标松开时的鼠标位置
    var formerOffLeft = 0;              //鼠标落下时的offsetLeft
    var objText;
    var dragObjText;
    var priWidth;
    var barWidth;
    var x = 0;
    var changeWidth = 0;
    var dragDayNum2 = 0;

    obj.onmousedown = function (event) {
        objText = (obj.id).split("&");
        formerOffLeft = barObj.offsetLeft;
        disX = event.clientX - barObj.offsetLeft;
        formerEv = parseInt(barObj.style.left);

        //鼠标移开事件
        document.onmousemove = function (ev) {
            /*obj.style.left = ev.clientX - disX + "px";
             deteleObj.style.left = ev.clientX - disX + "px";
             dragObj.style.left = ev.clientX-disX+"px";*/
            barObj.style.left = ev.clientX-disX+"px";
            nowEv = parseInt(barObj.style.left);

            if(parseInt(barObj.style.left)<=0){
                document.onmousemove = null;
            }
        };
        //鼠标松开事件
        document.onmouseup = function (event) {
            document.onmousemove = null;
            document.onmouseup = null;

            /*console.log(formerEv);
             console.log(nowEv);*/
            var dragDayNum1 = 0;                 //左右拖动超过的天数
            leftChange = nowEv - formerEv;
            if(leftChange>=0){
                dragDayNum1 = parseInt(leftChange / 27);         //保留整数部分
                barObj.style.left = formerOffLeft + (dragDayNum1 * 27) + "px";

                //改变开始时间和结束时间
                var nowTaskNum = parseInt(objText[0]);
                var nowTaskFrom = new Date(((_taskList[nowTaskNum].getFrom())/1000+(86400*dragDayNum1))*1000);
                var nowTaskTo = new Date(((nowTaskFrom)/1000+(86400*(_taskList[nowTaskNum].getWorkload())))*1000);
                _taskList[nowTaskNum].setFrom(nowTaskFrom);
                _taskList[nowTaskNum].setTo(nowTaskTo);
            }else{
                dragDayNum1 = parseInt(Math.abs(leftChange) / 27) + 1;
                barObj.style.left = formerOffLeft - (dragDayNum1 * 27) + "px";

                //改变开始时间和结束时间
                var nowTaskNum = parseInt(objText[0]);
                var nowTaskFrom = new Date(((_taskList[nowTaskNum].getFrom())/1000-(86400*dragDayNum1))*1000);
                var nowTaskTo = new Date(((nowTaskFrom)/1000+(86400*(_taskList[nowTaskNum].getWorkload())))*1000);
                _taskList[nowTaskNum].setFrom(nowTaskFrom);
                _taskList[nowTaskNum].setTo(nowTaskTo);
            }
        };
    };
    dragObj.onmousedown = function (event) {
        priWidth = obj.style.width;
        barWidth = barObj.style.width;
        dragObjText = (dragObj.id).split("&");
        x = event.clientX;

        //鼠标移开事件
        document.onmousemove = function (ev) {
            changeWidth = (ev.clientX - x);
            obj.style.width =parseInt(priWidth) +  changeWidth + "px";
            barObj.style.width = parseInt(barWidth) + changeWidth + "px";
        };
        //鼠标松开事件
        document.onmouseup = function (event) {
            document.onmousemove = null;
            document.onmouseup = null;

            if(changeWidth>=0){
                dragDayNum2 = parseInt(changeWidth / 27) + 1;
                obj.style.width =parseInt(priWidth) +  (27 * dragDayNum2) + "px";
                barObj.style.width = parseInt(barWidth) + (27 * dragDayNum2) + "px";

                //改变结束时间和工作量
                var nowTaskNum = parseInt(dragObjText[1]);
                var nowTaskTo = new Date(((_taskList[nowTaskNum].getTo())/1000+(86400*(dragDayNum2)))*1000);
                _taskList[nowTaskNum].setTo(nowTaskTo);
                _taskList[nowTaskNum].setWordload(_taskList[nowTaskNum].getWorkload()+dragDayNum2);
            }else{
                dragDayNum2 = parseInt(Math.abs(changeWidth) / 27);
                obj.style.width =parseInt(priWidth) -  (dragDayNum2 * 27) + "px";
                barObj.style.width = parseInt(barWidth) - (dragDayNum2 * 27) + "px";

                //改变结束时间和工作量
                var nowTaskNum = parseInt(dragObjText[1]);
                var nowTaskTo = new Date(((_taskList[nowTaskNum].getTo())/1000-(86400*(dragDayNum2)))*1000);
                _taskList[nowTaskNum].setTo(nowTaskTo);
                _taskList[nowTaskNum].setWordload(_taskList[nowTaskNum].getWorkload()-dragDayNum2);
            }
        };
    };
}

//拖动改变工作量
function dragChange(dragObj,ganttObj,barObj) {
    var priWidth = ganttObj.style.width;
    var barWidth = barObj.style.width;
    var x = 0;
    var changeWidth = 0;
    dragObj.onmousedown = function (event) {
        x = event.clientX;

        //鼠标移开事件
        document.onmousemove = function (ev) {
            changeWidth = (ev.clientX - x);
            ganttObj.style.width =parseInt(priWidth) +  changeWidth + "px";
            barObj.style.width = parseInt(barWidth) + changeWidth + "px";

            if(changeWidth <=0 ){
                document.onmousemove = null;
                document.onmouseup = null;
            }
        };
        //鼠标松开事件
        document.onmouseup = function (event) {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}

//进度条
function getProgressDiv(progress) {
    return "<div class='GProgress' style='width:" + progress +
        "%; overflow:hidden'></div>"
}

//计算天数差的函数，通用
function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2017-7-13格式
    var  aDate,  oDate1,  oDate2,  iDays;
    aDate  =  sDate1.split("-");
    oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]) ;   //转换为7-13-2017格式
    aDate  =  sDate2.split("-");
    oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);
    iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)  ;  //把相差的毫秒数转换为天数
    return  iDays
}

//点击创建按钮创建事项
function addTask() {
    var taskName = document.getElementById('taskName').value;
    var from = document.getElementById('from').value;
    var to = document.getElementById('to').value;
    if(taskName == ""||from == ""||to == ""){
        alert("事项名或开始时间或结束时间为空，请检查！！！");
        var g = new Gantt(document.all.GanttChart,document.all.taskShow);
        g.AddTaskDetail(new Task('2017-7-05', '2017-7-12','task0'));
        g.AddTaskDetail(new Task('2017-7-11', '2017-7-12', 'task1'));
        g.AddTaskDetail(new Task('2017-7-13', '2017-7-19','2'));
        g.AddTaskDetail(new Task('2017-7-14', '2017-8-15','3'));
        g.AddTaskDetail(new Task('2017-7-15', '2017-7-30','task4'));
        g.AddTaskDetail(new Task('2017-7-30', '2017-8-20','5'));
        g.AddTaskDetail(new Task('2017-7-21', '2017-7-25','task6'));

        g.Draw();
        g.drag();
        g.Show();
    }else {
        var divFrom = from.split("-");
        var divTo = to.split("-");

        var fromMonthDay = getDaysInMonth(parseInt(divFrom[1],10),parseInt(divFrom[0],10));
        var toMonthDay = getDaysInMonth(parseInt(divTo[1],10),parseInt(divTo[0],10));

        var fromTime = Date.parse(new Date(divFrom[0], divFrom[1]-1, divFrom[2]));
        var toTime = Date.parse(new Date(divTo[0], divTo[1]-1, divTo[2]));
        if(parseInt(divFrom[2],10)>fromMonthDay||parseInt(divFrom[2],10)<=0){
            alert("请输入正确的开始日期！！！");
        }else{
            if (parseInt(divTo[2],10)>toMonthDay||parseInt(divTo[2],10)<=0){
                alert("请输入正确的结束日期！！！");
            }else{
                if (fromTime>toTime){
                    alert("请确认开始时间在结束时间之前！！！");
                }else{
                    var g = new Gantt(document.all.GanttChart,document.all.taskShow);
                    g.AddTaskDetail(new Task(from,to,taskName));

                    g.Draw();
                    g.drag();
                    g.Show();
                }
            }
        }
    }
}

//点击刷新表格按钮刷新表格
function showTable() {
    var g = new Gantt(document.all.GanttChart,document.all.taskShow);
    g.Show();
}