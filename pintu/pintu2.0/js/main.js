/**
 * Created by developer on 2017/6/26.
 */

var r = 0;
var c = 0;

var row;
var col;

var productNum;
var divArray = new Array();

var hour = 0;
var minute = 0;
var second = 0;
var s;

var box = null;
var overArea;

//建一个二维数组
var tArray = new Array(6);
for(var i=0;i<tArray.length;i++){
    tArray[i] = new Array(6);
}
var idArray = new Array(6);     //用来存生成的div的id
for(var i=0;i<idArray.length;i++){
    idArray[i] = new Array(6);
}

var littleArray = new Array(6);     //用来存生成的div的id
for(var i=0;i<littleArray.length;i++){
    littleArray[i] = new Array(6);
}

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
    for(var i =0;i<row;i++){
        for (var j=0;j<col;j++){
            box.removeChild(tArray[i][j]);
            overArea.removeChild(littleArray[i][j]);
        }
    }
    productNum = 0;
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

var upDivTop;
var upDivLeft;

//点击“开始”按钮，获取输入框中的行和列，随机生成带有从1到行*列的数字的方块
function getArea() {
    box = document.getElementById('gameShow');
    overArea = document.getElementById('overArea');

    r = document.getElementById('row').value;
    c = document.getElementById('col').value;

    if(r<1 || c <1 ||r>6 || c>6 || r ==""||c==""){
        alert("请输正确的行或列！");
    }else{

        row = parseInt(r);
        col = parseInt(c);


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

        for (var i = 0; i < row; i++) {
            for(var j=0;j<col;j++){
                var b = Math.floor(Math.random() * 10)+1;

                tArray[i][j] = document.createElement("div");
                addClass(tArray[i][j],"block");
                tArray[i][j].innerHTML = a[loop];        //将数字写入页面
                tArray[i][j].id = a[loop];
                loop++;
                /*tArray[i][j].style.backgroundColor = getColorRandom();*/
                tArray[i][j].style.top = (b+100+80*i) + "px";
                tArray[i][j].style.left = (b+80*j) + "px";
                /*tArray[i][j].draggable = "true";*/
                box.appendChild(tArray[i][j]);

                idArray[i][j] = tArray[i][j].id;

                /*console.log(tArray[i][j]);*/
            }
            var huanhang = document.createElement("div");
            /*<div style="clear:both"></div>*/
        }

        var idNum = 1;
        for(var i=0;i<row;i++){
            for (var j=0;j<col;j++){
                littleArray[i][j] = document.createElement("div");
                addClass(littleArray[i][j],"little_area");
                if(i == 0&&j == 0){
                    littleArray[i][j].style.borderTop = "1px dashed black";
                    littleArray[i][j].style.borderLeft = "1px dashed black";
                    littleArray[i][j].innerHTML = "请从这里开始";
                }

                /*littleArray[i][j].style.backgroundColor = getColorRandom();*/
                littleArray[i][j].draggable = "true";
                littleArray[i][j].id = "model"+idNum;

                littleArray[i][j].style.top = (50*i) + "px";
                littleArray[i][j].style.left = (50*j) + "px";

                overArea.appendChild(littleArray[i][j]);
                idNum++;
                /*console.log(littleArray[i][j].style.top);*/
            }
        }

        for (var i = 0; i < row; i++) {
            for(var j=0;j<col;j++){
                dragBlock(tArray[i][j]);
            }
        }
    }
}

//鼠标拖动
function dragBlock(obj) {
    var disX=0;
    var disY=0;
    //鼠标点击落下事件
    obj.onmousedown=function (event){
        disX=event.clientX-obj.offsetLeft;
        disY=event.clientY-obj.offsetTop;

        obj.zIndex = 5;
        /*console.log(obj.zIndex);*/
        //鼠标移开事件
        document.onmousemove=function(ev){
            obj.style.left=ev.clientX-disX+"px";
            obj.style.top=ev.clientY-disY+"px";
        };
        //鼠标松开事件
        document.onmouseup= function () {
            document.onmousemove=null;
            document.onmouseup=null;
            gameOver();

            /*dragBlock(overArea);*/
        }
    };
}


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
    for (var i = 0; i < row; i++) {
        for(var j=0;j<col;j++){
            /!*console.log(parseInt(document.getElementById(idArray[i][j]).style.top));*!/
            var m1,m2,m3,n1,n2,n3;

            if((j==col-1)||(i==row-1)){
                continue;
            }

            var topFlag1 = false;
            var topFlag2 = false;
            var leftFlag1 = false;
            var leftFlag2 = false;

            m1 = parseInt(document.getElementById(idArray[i][j]).style.top);
            m2 = parseInt(document.getElementById(idArray[i][j+1]).style.top);
            n1 = parseInt(document.getElementById(idArray[i][j]).style.left);
            n2 = parseInt(document.getElementById(idArray[i][j+1]).style.left);
            m3 = parseInt(document.getElementById(idArray[i+1][j]).style.top);
            n3 = parseInt(document.getElementById(idArray[i+1][j]).style.left);

            /!*console.log("i="+i+",j="+j);*!/

            topFlag1 = (m2-m1>=-5)&&(m2-m1<=5);
            leftFlag1 = (n2-n1>=45)&&(n2-n1<=55);
            topFlag2 = (m3-m1>=45)&&(m3-m1<=55);
            leftFlag2 = (n3-n1>=-5)&&(n3-n1<=5);

/!*             console.log(topFlag1);
             console.log(topFlag2);
             console.log(leftFlag1);
             console.log(leftFlag2);*!/

            if((topFlag1&&leftFlag1)||(topFlag2&&leftFlag2)){
                count++;
            }
        }
     }
     //对最后一个元素判断
    var lt1 = parseInt(document.getElementById(idArray[row-2][col-2]).style.top);
    var lt2 = parseInt(document.getElementById(idArray[row-2][col-1]).style.top);
    var ll1 = parseInt(document.getElementById(idArray[row-2][col-2]).style.left);
    var ll2 = parseInt(document.getElementById(idArray[row-2][col-1]).style.left);
    var lt3 = parseInt(document.getElementById(idArray[row-1][col-2]).style.top);
    var ll3 = parseInt(document.getElementById(idArray[row-1][col-2]).style.left);

    var ltFlag1 = (lt2-lt1>=-5)&&(lt2-lt1<=5);
    var llFlag1 = (ll2-ll1>=45)&&(ll2-ll1<=55);
    var ltFlag2 = (lt3-lt1>=45)&&(lt3-lt1<=55);
    var llFlag2 = (ll3-ll1>=-5)&&(ll3-ll1<=5);

    if((ltFlag1&&llFlag1)||(ltFlag2&&llFlag2)){
        count++;
    }

     /!*console.log(count);*!/
    if(count == ((row-1)*(col-1)+1)){
        document.getElementById("completeAlert").style.display = "block";
        clearTimeout(s);
        s = null;
    }*/
    var count = 0;

    var flag1 = false;
    var flag2 = false;

    for(var i = 1;i<=productNum;i++){
        var n = i.toString();

        var yitop = parseInt(document.getElementById(n).style.top);
        var modeltop = parseInt(document.getElementById('model'+n).style.top);
        var yileft = parseInt(document.getElementById(n).style.left);
        var modelleft = parseInt(document.getElementById('model'+n).style.left);


        flag1 = ((yitop-250 <= modeltop+5)&&yitop-250 >= modeltop-5);
        flag2 = ((yileft-100 <= modelleft+5)&&yileft-100 >= modelleft-5);

        /*console.log(flag1);*/
        if(flag1 && flag2){
            count++;

            document.getElementById(n).style.opacity = "0";
            document.getElementById(n).style.zIndex  = "-3";

            document.getElementById("model"+n).innerHTML = document.getElementById(n).innerHTML;
            document.getElementById("model"+n).style.backgroundColor = "orange";

            document.getElementById(n).onmousedown = null;
            document.getElementById(n).onmousemove = null;
            document.getElementById(n).onmousedown = null;
        }

        /*console.log("yi:"+yitop);
        console.log("model::"+modeltop);*/
    }
    /*console.log(count);*/
    if(productNum!=0){
        if(count == productNum){
            document.getElementById("completeAlert").style.display = "block";
            clearTimeout(s);
            s = null;
        }
    }else {
        clearTimeout(s);
        s = null;
    }
}