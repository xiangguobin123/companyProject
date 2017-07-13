/**
 * Created by developer on 2017/7/6.
 */
function Task(from, to, taskName, workload) {
    var _from = new Date();
    var _to = new Date();
    var _taskName = taskName;
    var _workload = workload;
    var dvArr = from.split('/');
    _from.setFullYear(parseInt(dvArr[2], 10), parseInt(dvArr[0], 10) - 1,
        parseInt(dvArr[1], 10));
    dvArr = to.split('/');
    _to.setFullYear(parseInt(dvArr[2], 10), parseInt(dvArr[0], 10) - 1,
        parseInt(dvArr[1], 10));

    this.getFrom = function(){ return _from};
    this.getTo = function(){ return _to};
    this.getTaskName = function(){ return _taskName};
    this.getWorkload = function(){ return _workload};
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

$(function (){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth()+1;
    var  day = now.getDate();
    var nowTime = year + "-" + month + "-" + day;
    $("div#todayTime").html("今日时间："+nowTime);
});

$(function () {     //控制左右的滚轮上下同时
    $('#itemName').scroll( function() {
        $('#ganttArea').scrollTop($(this).scrollTop());
    });
    $('#ganttArea').scroll( function() {
        $('#itemName').scrollTop($(this).scrollTop());
    });
});

var item;
var workLoad;
var ganttArea;
var num = 1;
var checknum = 1;
var zuNum = 1;
var zuItemNameNum = 1;
var bottomShow;
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
function setUpGantt(){
    item = document.getElementById('item').value;
    workLoad = document.getElementById('workLoad').value;
    zuCheck = document.getElementById('zu').checked;

    bottomShow = document.getElementById('bottomShow');
    ganttArea = document.getElementById('ganttArea');
    itemName = document.getElementById('itemName');

    if(item==""||workLoad==""||isNaN(workLoad)||workLoad<=0){
        alert("请输入事项或有效的工作量！");
    }else{
        if(zuCheck){
            var zuDivId = "item&"+num;
            if(checknum == 1){
                zuItemNameNum = 1;
                var zuText;
                itemsDiv = document.createElement("div");
                addClass(itemsDiv,"items_div");
                itemsDiv.style.height = 30 + "px";
                itemsDiv.id = "zu&"+zuNum;
                itemsDiv.style.width = (workLoad*50) + "px";
                ganttArea.appendChild(itemsDiv);

                zuDiv = document.createElement("div");
                addClass(zuDiv,"zu_div");
                zuDiv.innerHTML = item;
                zuDivItem = zuDiv.innerHTML;
                zuDiv.id = item+"&"+workLoad;
                zuDiv.style.width = (workLoad*50) + "px";
                itemsDiv.appendChild(zuDiv);

                deleteGantt = document.createElement("button");
                addClass(deleteGantt,"delete_gantt");
                deleteGantt.innerHTML = "×";
                deleteGantt.id="deleteAllZu"+"&"+zuNum;
                deleteGantt.style.float = "right";
                zuDiv.appendChild(deleteGantt);

                zuItemName = document.createElement("div");
                addClass(zuItemName,"zu_item_name");
                zuItemName.id = "zuItemName" + zuNum;
                itemName.appendChild(zuItemName);

                var zuName = document.createElement("div");
                addClass(zuName,"zu_name");
                zuName.id = "zuName&" + zuNum;
                zuName.innerHTML = item;
                zuItemName.appendChild(zuName);

                deleteAllZu(deleteGantt);
                dragAllZu(zuDiv,itemsDiv);

                checknum ++;
                num++;
                zuNum++;
            }else{
                barType = document.createElement("div");
                barType.id = "barType"+num;
                addClass(barType,"bar_type");
                barType.style.width = (workLoad*50) + "px";
                if(parseInt(barType.style.width)>parseInt(itemsDiv.style.width)){
                    alert("组中的事项工作量不能超过组的工作量，请重新输入正确的工作量！");
                }else{
                    itemsDiv.appendChild(barType);

                    ganttBulk = document.createElement("div");
                    ganttBulk.id = item+"&"+workLoad+"&"+num;
                    ganttBulk.innerHTML = item;
                    ganttBulk.style.backgroundColor = "";
                    addClass(ganttBulk,"zu_gantt_bulk");
                    ganttBulk.style.width = (workLoad*50) + "px";
                    barType.appendChild(ganttBulk);
                    itemsDiv.style.height = (parseInt(itemsDiv.style.height)+30) + "px";

                    deleteGantt = document.createElement("button");
                    addClass(deleteGantt,"delete_gantt");
                    deleteGantt.style.float = "right";
                    deleteGantt.innerHTML = "×";
                    deleteGantt.id="delete"+"&"+num;
                    ganttBulk.appendChild(deleteGantt);

                    dragGantt = document.createElement("div");
                    dragGantt.style.float = "right";
                    addClass(dragGantt,"drag_gantt");
                    ganttBulk.appendChild(dragGantt);

                    itemNameBar = document.createElement("div");
                    addClass(itemNameBar,"item_name_bar");
                    itemNameBar.id = "itemNameBar" + num;
                    itemNameBar.style.fontSize = "15px";
                    itemNameBar.style.backgroundColor = "green";
                    itemNameBar.innerHTML = item;
                    zuItemName.appendChild(itemNameBar);

                    num++;
                    zuItemNameNum++;

                    var huanhang = document.createElement("div");
                    huanhang.style.clear = "both";
                    itemsDiv.appendChild(huanhang);

                    deleteZuSingle(itemsDiv,zuItemName,deleteGantt);
                    dragZuSingle(ganttBulk,zuDiv,dragGantt,itemsDiv);
                }
            }
        }else{
            var huanhang = document.createElement("div");
            huanhang.style.clear = "both";
            ganttArea.appendChild(huanhang);

            checknum = 1;
            barType = document.createElement("div");
            barType.id = "barType"+num;
            addClass(barType,"bar_type");
            ganttArea.appendChild(barType);

            ganttBulk = document.createElement("div");
            ganttBulk.id = item+"&"+workLoad;
            ganttBulk.innerHTML = item;
            addClass(ganttBulk,"gantt_bulk");
            ganttBulk.style.width = (workLoad*50) + "px";
            //设置文字不可选取,方便拖拽
            // IE
            ganttBulk.unselectable = "on";
            ganttBulk.onselectstart="javascript:return false;";
            barType.appendChild(ganttBulk);

            dragGantt = document.createElement("div");
            addClass(dragGantt,"drag_gantt");
            barType.appendChild(dragGantt);

            deleteGantt = document.createElement("button");
            addClass(deleteGantt,"delete_gantt");
            deleteGantt.innerHTML = "×";
            deleteGantt.id="delete"+"&"+num;
            barType.appendChild(deleteGantt);

            itemNameBar = document.createElement("div");
            addClass(itemNameBar,"item_name_bar");
            itemNameBar.id = "itemNameBar" + num;
            itemNameBar.innerHTML = item;
            itemName.appendChild(itemNameBar);

            alertRight(dragGantt);
            dragBlock(ganttBulk,deleteGantt,dragGantt); //控制左右拖动和改变工作量
            /*changeWorkload(ganttBulk);*/
            deleteF(ganttArea,itemName,deleteGantt);       //删除
            num++;

            var huanhang = document.createElement("div");
            huanhang.style.clear = "both";
            ganttArea.appendChild(huanhang);
        }
    }
}

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

//单个事项鼠标拖动
function dragBlock(obj,deteleObj,dragObj) {
    var disX = 0;
    var disY = 0;
    var x = 0;
    var changeWidth = 0;
    var workloadChange;
    var priWidth = obj.style.width;

    obj.onmousedown = function (event) {
        disX = event.clientX - obj.offsetLeft;
        disY = event.clientY - obj.offsetTop;

        var text = obj.id.split("&");
        bottomShow.innerHTML = "事项：" + text[0] + " " + "工作量：" + text[1];

        //鼠标移开事件
        document.onmousemove = function (ev) {
            obj.style.left = ev.clientX - disX + "px";
            deteleObj.style.left = ev.clientX - disX + "px";
            dragObj.style.left = ev.clientX-disX+"px";

            if (parseInt(obj.style.left) <= 0) {
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
    dragObj.onmousedown = function (event) {
        obj.onmousedown = null;
        x = event.clientX;

        var text = obj.id.split("&");
        bottomShow.innerHTML = "事项：" + text[0] + " " + "工作量：" + text[1];

        //鼠标移开事件
        document.onmousemove = function (ev) {
            changeWidth = parseInt(priWidth) + (ev.clientX - x);
            obj.style.width = changeWidth + "px";
            workloadChange = (changeWidth / 50).toFixed(1);

            if(changeWidth <=0 ){
                document.onmousemove = null;
                document.onmouseup = null;
            }
        };
        //鼠标松开事件
        document.onmouseup = function (event) {
            document.onmousemove = null;
            document.onmouseup = null;
            priWidth = obj.style.width;
            if(workloadChange == undefined){
                obj.id = ganttBulk.id = item + "&" + workLoad;
            }else{
                obj.id = ganttBulk.id = item + "&" + workloadChange;
            }
            var text = obj.id.split("&");
            bottomShow.innerHTML = "事项：" + text[0] + " " + "工作量：" + text[1];

            obj.onmousedown = function (event) {
                disX = event.clientX - obj.offsetLeft;
                disY = event.clientY - obj.offsetTop;

                var text = obj.id.split("&");
                bottomShow.innerHTML = "事项：" + text[0] + " " + "工作量：" + text[1];

                //鼠标移开事件
                document.onmousemove = function (ev) {
                    obj.style.left = ev.clientX - disX + "px";
                    deteleObj.style.left = ev.clientX - disX + "px";
                    dragObj.style.left = ev.clientX-disX+"px";

                    if (parseInt(obj.style.left) <= 0) {
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
        };
    };
}

//改变块的大小
function changeWorkload(obj) {
    var x = 0;
    var changeWidth = 0;
    var workloadChane;
    var priWidth = obj.style.width;
    obj.onmousedown = function (ev) {
        x=ev.clientX;

        var text = obj.id.split("&");
        bottomShow.innerHTML = "事项："+ text[0] + " "+ "工作量："+text[1];

        document.onmousemove=function(ev){
            changeWidth = parseInt(priWidth) + (ev.clientX - x);
            obj.style.width = changeWidth + "px";

            workloadChane = (changeWidth/100).toFixed(1);
        };
        document.onmouseup= function () {
            document.onmousemove=null;
            document.onmouseup=null;

            priWidth = obj.style.width;

            obj.id = ganttBulk.id = item+"&"+workloadChane;
        }
    };
}

//删除事项
function deleteF(outerObj,outItemNameObj,obj) {
    obj.onmousedown=function (event){
        var deleteId = obj.id;
        var t = deleteId.split("&");

        outerObj.removeChild(document.getElementById("barType"+t[1]));
        outItemNameObj.removeChild(document.getElementById("itemNameBar"+t[1]));
    };
}

//删除组
function deleteAllZu(obj) {
    obj.onmousedown = function (event) {
        var deleteId = obj.id;
        var t = deleteId.split("&");

        ganttArea.removeChild(document.getElementById("zu&"+t[1]));
        itemName.removeChild(document.getElementById("zuItemName"+t[1]));
        checknum = 1;
    }
}

//删除组中的单个事项
function deleteZuSingle(outerObj,outItemNameObj,obj) {
    obj.onmousedown=function (event){
        var deleteId = obj.id;
        var t = deleteId.split("&");

        outerObj.removeChild(document.getElementById("barType"+t[1]));
        outItemNameObj.removeChild(document.getElementById("itemNameBar"+t[1]));

        outerObj.style.height = (parseInt(outerObj.style.height)-30) + "px";
        /*//找到最左和最右
        var childs= outerObj.childNodes;
        var maxRight = childs[1].firstChild.offsetLeft + parseInt(childs[1].firstChild.style.width);
        var mixLeft = childs[1].firstChild.offsetLeft;
        for(var i = 1;i<childs.length-1;i+=2) {
            if (maxRight < childs[i].firstChild.offsetLeft + parseInt(childs[i].firstChild.style.width)) {
                maxRight = childs[i].firstChild.offsetLeft + parseInt(childs[i].firstChild.style.width);
            }
            if (mixLeft > childs[i].firstChild.offsetLeft) {
                mixLeft = childs[i].firstChild.offsetLeft;
            }
        }
        outerObj.style.width = (maxRight) + "px";*/
    };
}

//拖动整组
function dragAllZu(obj,zuAllAreaObj) {
    var disX = 0;
    var disY = 0;
    obj.onmousedown = function (event) {
        var text = obj.id.split("&");
        bottomShow.innerHTML = "事项：" + text[0] + " " + "工作量：" + text[1];

        disX = event.clientX - zuAllAreaObj.offsetLeft;

        //鼠标移开事件
        document.onmousemove = function (ev) {
            zuAllAreaObj.style.left = ev.clientX - disX + "px";

            if (parseInt(zuAllAreaObj.style.left) <= 0) {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        };
        //鼠标松开事件
        document.onmouseup = function (event) {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    }
}

//拖动组中的单项
function dragZuSingle(obj,zuNameObj,dragObj,outObj) {
    var disX = 0;
    var disY = 0;
    var x = 0;
    var changeWidth = 0;
    var workloadChange;
    var priWidth = obj.style.width;
    var objRight;
    var zuNameObjRight;
    var childs;
    var maxRight;
    var mixLeft;
    var nowEv;

    obj.onmousedown = function (event) {
        nowEv = event.clientX;
        disX = event.clientX - obj.offsetLeft;
        disY = event.clientY - obj.offsetTop;

        var zuText = zuNameObj.id.split("&");
        var text = obj.id.split("&");
        bottomShow.innerHTML = "事项："+ zuText[0] + ">" + text[0] + " " + "工作量：" + text[1];

        //鼠标移开事件
        document.onmousemove = function (ev) {
            obj.style.left = ev.clientX - disX + "px";

            if (parseInt(obj.style.left) <= 0) {
                document.onmousemove = null;
                document.onmouseup = null;
            }
            //当拖动超出右边界时，父div的宽度随之变化
            objRight = obj.offsetLeft + parseInt(obj.style.width);

            zuNameObjRight = zuNameObj.offsetLeft + parseInt(zuNameObj.style.width);
            if(objRight>zuNameObjRight){
                zuNameObj.style.width = objRight+"px";
                outObj.style.width = zuNameObj.style.width;
            }
        };
        //鼠标松开事件
        document.onmouseup = function (event) {
            document.onmousemove = null;
            document.onmouseup = null;

            //找到最左和最右
            childs= outObj.childNodes;
            maxRight = childs[1].firstChild.offsetLeft + parseInt(childs[1].firstChild.style.width);
            mixLeft = childs[1].firstChild.offsetLeft;
            var checkObj=childs[1].firstChild;
            for(var i = 1;i<childs.length;i++) {
                if(childs[i].hasChildNodes()){
                    if (maxRight < childs[i].firstChild.offsetLeft + parseInt(childs[i].firstChild.style.width)) {
                        maxRight = childs[i].firstChild.offsetLeft + parseInt(childs[i].firstChild.style.width);
                    }
                    if (mixLeft > childs[i].firstChild.offsetLeft) {
                        mixLeft = childs[i].firstChild.offsetLeft;
                        checkObj = childs[i].firstChild;
                    }
                }
            }
            /*outObj.style.left = mixLeft + "px";*/
            zuNameObj.style.width = (maxRight)+"px";
            outObj.style.width = zuNameObj.style.width;
            zuNameObj.style.left = 0;
            checkObj.style.left = 0;

            zuNameObj.id =zuText[0]+"&" + ((parseInt(zuNameObj.style.width)/50).toFixed(1));
        };
    };
    dragObj.onmousedown = function (event) {
        obj.onmousedown = null;
        x = event.clientX;

        var zuText = zuNameObj.id.split("&");
        var text = obj.id.split("&");
        bottomShow.innerHTML = "事项："+ zuText[0] + ">" + text[0] + " " + "工作量：" + text[1];

        //鼠标移开事件
        document.onmousemove = function (ev) {
            changeWidth = parseInt(priWidth) + (ev.clientX - x);
            obj.style.width = changeWidth + "px";
            workloadChange = (changeWidth / 50).toFixed(1);

            if(changeWidth <=0 ){
                document.onmousemove = null;
                document.onmouseup = null;
            }
            //当拖动超出右边界时，父div的宽度随之变化
            objRight = obj.offsetLeft + parseInt(obj.style.width);

            zuNameObjRight = zuNameObj.offsetLeft + parseInt(zuNameObj.style.width);
            if(objRight>zuNameObjRight){
                zuNameObj.style.width = objRight+"px";
                outObj.style.width = zuNameObj.style.width;
            }
        };
        //鼠标松开事件
        document.onmouseup = function (event) {
            document.onmousemove = null;
            document.onmouseup = null;
            priWidth = obj.style.width;
            if(workloadChange == undefined){
                obj.id = ganttBulk.id = item + "&" + workLoad;
            }else{
                obj.id = ganttBulk.id = item + "&" + workloadChange;
            }
            var zuText = zuNameObj.id.split("&");
            var text = obj.id.split("&");
            bottomShow.innerHTML = "事项："+ zuText[0] + ">" + text[0] + " " + "工作量：" + text[1];

            obj.onmousedown = function (event) {
                nowEv = event.clientX;
                disX = event.clientX - obj.offsetLeft;
                disY = event.clientY - obj.offsetTop;

                var zuText = zuNameObj.id.split("&");
                var text = obj.id.split("&");
                bottomShow.innerHTML = "事项："+ zuText[0] + ">" + text[0] + " " + "工作量：" + text[1];

                //鼠标移开事件
                document.onmousemove = function (ev) {
                    obj.style.left = ev.clientX - disX + "px";

                    if (parseInt(obj.style.left) <= 0) {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    }
                    //当拖动超出右边界时，父div的宽度随之变化
                    objRight = obj.offsetLeft + parseInt(obj.style.width);

                    zuNameObjRight = zuNameObj.offsetLeft + parseInt(zuNameObj.style.width);
                    if(objRight>zuNameObjRight){
                        zuNameObj.style.width = objRight+"px";
                        outObj.style.width = zuNameObj.style.width;
                    }
                };
                //鼠标松开事件
                document.onmouseup = function (event) {
                    document.onmousemove = null;
                    document.onmouseup = null;

                    //找到最左和最右
                    childs= outObj.childNodes;
                    maxRight = childs[1].firstChild.offsetLeft + parseInt(childs[1].firstChild.style.width);
                    mixLeft = childs[1].firstChild.offsetLeft;
                    var checkObj=childs[1].firstChild;
                    for(var i = 1;i<childs.length-1;i+=2) {
                        if(childs[i].hasChildNodes()){
                            if (maxRight < childs[i].firstChild.offsetLeft + parseInt(childs[i].firstChild.style.width)) {
                                maxRight = childs[i].firstChild.offsetLeft + parseInt(childs[i].firstChild.style.width);
                            }
                            if (mixLeft > childs[i].firstChild.offsetLeft) {
                                mixLeft = childs[i].firstChild.offsetLeft;
                                checkObj = childs[i].firstChild;
                            }
                        }
                    }
                    /*outObj.style.left = mixLeft + "px";*/
                    zuNameObj.style.width = (maxRight)+"px";
                    outObj.style.width = zuNameObj.style.width;
                    zuNameObj.style.left = 0;
                    checkObj.style.left = 0;

                    zuNameObj.id =zuText[0]+"&" + ((parseInt(zuNameObj.style.width)/50).toFixed(1));
                };
            };
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