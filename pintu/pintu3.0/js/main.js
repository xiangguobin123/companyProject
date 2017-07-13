/**
 * Created by developer on 2017/6/26.
 */

var r = 0;
var c = 0;

var productNum;
var divArray = new Array();

var hour = 0;
var minute = 0;
var second = 0;
var s;

var box = null;

/*console.log(box);*/

//点击开始按钮执行游戏
function startGame() {
    hour = 0;
    minute = 0;
    second = 0;
    if(s == null){
        clearArea();
        countTime();        //开始计时器
        getArea();          //游戏主要功能实现
    }else{
        alert("游戏已经开始了！！！");
        document.getElementById("button1").onclick = function(){};
    }
    if(gameOver()){
        document.getElementById("button1").onclick = startGame();
    }
}

function clearArea() {
    for(var i =0;i<productNum;i++){
        document.getElementById("gameShow").removeChild(divArray[i]);
    }
    productNum = 0;
    divArray = new Array(productNum);
}

//计时器实现
function countTime() {
    var text_time = hour + ":" + minute + ":" + second;
    document.getElementById('countTime').innerHTML = text_time;
    second++;

    //秒和分都要小于60
    if(second == 60){
        minute += 1;
        second = 0;
    }
    if(minute == 60){
        hour += 1;
        minute = 0;
    }
    s = setTimeout("countTime()",1000);
}


//生成随机颜色
function getColorRandom(){
    var c="#";
    var cArray=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
    for(var i=0;i<6;i++){
        var  cIndex= Math.round(Math.random()*15);
        c+=cArray[cIndex];
    }
    return c;
}

//点击“开始”按钮，获取输入框中的行和列，随机生成带有从1到行*列的数字的方块
function getArea() {
    box = document.getElementById('gameShow');

    r = document.getElementById('row').value;
    c = document.getElementById('col').value;

    var row = parseInt(r);
    var col = parseInt(c);

    if(row == "" || col == ""){
        alert("请输正确的行或列！");
    }
    productNum = parseInt(row) * parseInt(col);

    //生成1-productNum的随机数存入数组
    var a = [0];
    for (var i = 0; i < productNum; i++) {
        a[i] = Math.floor(Math.random() * productNum) + 1;
        for (var j = 0; j < i; j++) {           //随机数不重复
            if (a[j] == a[i]) {
                while (1) {
                    a[i] = Math.floor(Math.random() * productNum) + 1;
                    if (a[j] != a[i]) {
                        j = -1;
                        break;
                    }
                }
            }
        }
    }


    var loop = 0;
    //建一个二维数组
    var tArray = new Array(row);
    for(var i=0;i<tArray.length;i++){
        tArray[i] = new Array(col);
    }

    console.log(a);

    for (var i = 0; i < row; i++) {
        for(var j=0;j<col;j++){
            var b = Math.floor(Math.random() * 10)+40;

            var canvas=document.getElementById("canvas");
            var ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.lineWidth = "1";
            ctx.strokeStyle = "blue";
            ctx.fillStyle = "orange";
            ctx.moveTo(50*j+b, 50*i+b);
            ctx.lineTo(50*j+b, 50*i+b+50);
            ctx.lineTo(50*j+b+50, 50*i+b+50);
            ctx.lineTo(50*j+b+50, 50*i+b);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.font = "32pt Arial";
            ctx.strokeText(a[loop], 50*j+b+10+5, 50*i+b+40);
            ctx.strokeStyle = "red";
            ctx.stroke();

            /*tArray[i][j] = document.createElement("div");
            addClass(tArray[i][j],"block");
            tArray[i][j].innerHTML = a[loop];        //将数字写入页面
            tArray[i][j].id = a[loop];
            loop++;
            /!*tArray[i][j].style.backgroundColor = getColorRandom();*!/
            tArray[i][j].style.top = (b+100+80*i) + "px";
            tArray[i][j].style.left = (b+80*j) + "px";
            box.appendChild(tArray[i][j]);*/

            loop++;
        }
        /*<div style="clear:both"></div>*/
    }

    for (var i = 0; i < row; i++) {
        for(var j=0;j<col;j++){
            dragBlock(tArray[i][j]);
            divArray.push(parseInt(tArray[i][j].id));
        }
    }
    divArray.sort();
}

//鼠标拖动
function dragBlock(obj) {
    var disX=0;
    var disY=0;
    //鼠标点击落下事件
    obj.onmousedown=function (event){
        disX=event.clientX-obj.offsetLeft;
        disY=event.clientY-obj.offsetTop;
        //鼠标移开事件
        document.onmousemove=function(ev){
            obj.style.left=ev.clientX-disX+"px";
            obj.style.top=ev.clientY-disY+"px";
        }
        //鼠标松开事件
        document.onmouseup= function () {
            document.onmousemove=null;
            document.onmouseup=null;
        }
    };
}

//拖拽到指定位置合在一起


function addClass(node,newclass){
    if(node.className.indexOf(newclass)>0){
        return;
    }
    node.className = node.className?node.className+" "+newclass:newclass;
}
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

//点击“暂停”按钮游戏暂停，div提示框显示可见
function pauseGame() {
    if(s != null){
        clearTimeout(s);
        document.getElementById('pauseAlert').style.display = "block";
    }else{
        alert("当前游戏未开始！！！");
    }
}

//点击关闭按钮，关闭提示，查看游戏最终状态
function closeOverAlert() {
    document.getElementById('completeAlert').style.display = "none";
}


//点击“继续游戏”按钮游戏继续，div提示框显示不可见
function continueGame() {
    countTime();
    document.getElementById('pauseAlert').style.display = "none";
}

//游戏结束判断
function gameOver() {
    /*if(s == null){
        alert("游戏尚未开始！！！");
    }
    var count = 0;
    for(var i=0;i<productNum;i++){
        /!*console.log("inn:"+parseInt(divArray[i].innerHTML));
         console.log("id:"+parseInt(divArray[i].id));*!/
        if(parseInt(divArray[i].innerHTML) == parseInt(divArray[i].id)){
            count++;
            divArray[i].style.margin = "0";
        }else{
            divArray[i].style.margin = "5px";
        }
    }
    if(count != 0){
        if(count == productNum){
            /!*for(var i=0;i<productNum;i++)
             divArray[i].style.margin = 0;*!/
            document.getElementById("completeAlert").style.display = "block";
            clearTimeout(s);
            s = null;
        }
    }else{
        clearTimeout(s);
        s = null;
    }*/
}