/**
 * Created by developer on 2017/6/30.
 */
var item;
var workLoad;

var ganttArea;
var num = 1;

var bottomShow;

var barType;        //生成的每一行的长条
var ganttBulk;      //按照工作量生成的块区域
var deleteGantt;    //删除区域
var dragGantt;      //可以点击拉伸的区域
var overText = null;       //当字数太多时将事项名卸载其中
function startGantt(){
    ganttArea = document.getElementById('ganttArea');

    bottomShow = document.getElementById('itemShow');

    item = document.getElementById('item').value;
    workLoad = document.getElementById('workLoad').value;

    if(item==""||workLoad==""||isNaN(workLoad)||workLoad<=0){
        alert("请输入事项或有效的工作量！");
    }else{
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

        if(ganttBulk.scrollHeight>ganttBulk.clientHeight){
            ganttBulk.style.backgroundColor = "orange";
            ganttBulk.style.color = ganttBulk.style.backgroundColor;
            overText = document.createElement("div");
            addClass(overText,"over_text");
            overText.id = "overText" + "&" + num;
            overText.style.top = parseInt(ganttBulk.offsetTop) + "px";
            overText.style.left = parseInt(ganttBulk.offsetLeft) + "px";
            overText.innerHTML = item;
            barType.appendChild(overText);
        }

        dragGantt = document.createElement("div");
        addClass(dragGantt,"drag_gantt");
        barType.appendChild(dragGantt);

        deleteGantt = document.createElement("button");
        addClass(deleteGantt,"delete_gantt");
        deleteGantt.innerHTML = "×";
        deleteGantt.id="delete"+"&"+num;
        barType.appendChild(deleteGantt);

        alertRight(dragGantt);
        dragBlock(ganttBulk,deleteGantt,dragGantt,overText); //控制左右拖动和改变工作量
        /*changeWorkload(ganttBulk);*/
        deleteF(deleteGantt);       //删除

        num++;
    }
}

//添加样式
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

//鼠标拖动
function dragBlock(obj,deteleObj,dragObj,overObj) {
    var disX = 0;
    var disY = 0;
    var x = 0;
    var ox = 0;
    var changeWidth = 0;
    var workloadChange;
    var priWidth = obj.style.width;

    //当鼠标落下拖动时左右拖动块，当鼠标落下并且按住ctrl时拖动改变工作量
    /*    //鼠标点击落下事件
     obj.onmousedown=function (event){
     if(event.ctrlKey == false){        //判断ctrl键
     disX=event.clientX-obj.offsetLeft;
     disY=event.clientY-obj.offsetTop;

     var text = obj.id.split("&");
     bottomShow.innerHTML = "事项："+ text[0] + " "+ "工作量："+text[1];
     }else{
     x=event.clientX;

     var text = obj.id.split("&");
     bottomShow.innerHTML = "事项："+ text[0] + " "+ "工作量："+text[1];
     }

     //鼠标移开事件
     document.onmousemove=function(ev){
     if(ev.ctrlKey == false)
     {
     obj.style.left=ev.clientX-disX+"px";
     other.style.left = ev.clientX-disX+"px";

     if(parseInt(obj.style.left)<=0){
     document.onmousemove=null;
     document.onmouseup=null;
     }
     }else{
     changeWidth = parseInt(priWidth) + (ev.clientX - x);
     obj.style.width = changeWidth + "px";

     workloadChane = (changeWidth/100).toFixed(1);
     }
     };
     //鼠标松开事件
     document.onmouseup= function (event) {
     if(event.ctrlKey ==false){
     document.onmousemove=null;
     document.onmouseup=null;
     }else{
     document.onmousemove=null;
     document.onmouseup=null;

     priWidth = obj.style.width;
     obj.id = ganttBulk.id = item+"&"+workloadChane;
     }

     }
     };*/

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
            overObj.style.left = ev.clientX-disX+"px";

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

            if(obj.scrollHeight<=obj.clientHeight){
                if(overObj.style.display == "block"){
                    obj.style.color = "black";
                    overObj.style.display = "none";
                }
            }else{
                if (overObj.style.display == "none"){
                    obj.style.backgroundColor = "orange";
                    obj.style.color = obj.style.backgroundColor;
                    overObj.style.display = "block";
                }
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
                    overObj.style.left = ev.clientX-disX+"px";

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
    if(overObj){
        overObj.onmousedown = function (event) {
            ox = event.clientX - overObj.offsetLeft;

            var text = obj.id.split("&");
            bottomShow.innerHTML = "事项：" + text[0] + " " + "工作量：" + text[1];

            //鼠标移开事件
            document.onmousemove = function (ev) {
                overObj.style.left = ev.clientX - ox + 10 + "px";
                obj.style.left = ev.clientX - ox + "px";
                deteleObj.style.left = ev.clientX - ox + "px";
                dragObj.style.left = ev.clientX-ox+"px";

                if (parseInt(overObj.style.left) <= 10) {
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
function deleteF(obj) {
    obj.onmousedown=function (event){
        var deleteId = obj.id;
        var t = deleteId.split("&");

        /*document.getElementById("barType"+t[1]).removeChild(document.getElementById("overText&"+t[1]));*/
        ganttArea.removeChild(document.getElementById("barType"+t[1]));
    };
}