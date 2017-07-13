/**
 * Created by developer on 2017/6/26.
 */

var row = 0;
var col = 0;

var productNum;
var divArray = new Array(productNum);

var hour;
var minute;
var second;
var s;

var box = document.getElementById("gameShow");

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

//重置区域
function clearArea() {
    for(var i =0;i<productNum;i++){
        document.getElementById("gameShow").removeChild(divArray[i]);
    }
    productNum = 0;
    divArray = new Array(productNum);
}

//计时器实现
function countTime() {
    s = setTimeout("countTime()",1000);
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
    row = document.getElementById('row').value;
    col = document.getElementById('col').value;

    if(row<1 || row>4 || col<1 || col>4){
        alert("请输入正确的数字！！！");
    }else{
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
        //计算生成的div的宽度
        var areaWidth = 500;
        var cDivWidth = Math.floor(areaWidth / col) - 20;
        var cDivHeight = Math.floor(areaWidth / row) -20;

        for (var i = 0; i < productNum; i++) {
            var id;
            var b = Math.floor(Math.random() * 100) + 1;

            divArray[i] = document.createElement("div");
            divArray[i].innerHTML = a[loop];        //将数字写入页面
            divArray[i].id = i+1;
            loop++;
            divArray[i].style.position = "relative";
            divArray[i].style.float = "left";
            divArray[i].style.width = cDivWidth + "px";
            divArray[i].style.height = cDivHeight + "px";
            divArray[i].style.marginLeft = b + "px";
            divArray[i].style.marginBottom = b + "px";
            divArray[i].style.backgroundColor = getColorRandom();
            divArray[i].draggable = "true";
            document.getElementById("gameShow").appendChild(divArray[i]);
        }
        var dragnow;//目前被拽着的物体
        for (var i = 0; i < productNum; i++) {
            addHandler(divArray[i],'dragstart',dragstart);
            addHandler(divArray[i],'dragenter',dragenter);
            addHandler(divArray[i],'dragover',dragover);
            addHandler(divArray[i],'dragleave',dragleave);
            addHandler(divArray[i],'drop',drop);
            addHandler(divArray[i],'dragend',dragend);
        }
    }

}
//实现div的拖拽
function addHandler(node,type,handler){
    if(window.addEventListener){
        node.addEventListener(type,handler,false);
    }else if(window.attachEvent){
        node.attachEvent('on'+type,handler);
    }
}

function dragstart(e){//被拖拽元素
    if(typeof e.target.style.opacity!='undefined'){
        e.target.style.opacity='0.4';
    }else{
        e.target.style.filter = "alpha(opacity=40)";
    }
    addClass(e.target,"zIndex");
    e.dataTransfer.setData("text/html",e.target.innerHTML +"&"+ e.target.style.backgroundColor+"&"+e.target.id);//存储文字
    dragnow=e.target;   //目前被拽的物体
}
function dragover(e){//拖拽目标身上的效果
    e.preventDefault();
    e.dataTransfer.dropEffect='move';
}
function dragenter(e){
    if(e.stopPropagation){e.stopPropagation();}     //阻止默认行为
    if(typeof e.target.classList !='undefined'){
        e.target.classList.add('hover');
    }else{
        addClass(e.target,"hover");
    }
}
function dragleave(e){
    removeClass(e.target,"hover");
}
function drop(e){
    var text = e.dataTransfer.getData("text/html");//获取文字
    var text2 = text.split("&");
    e.preventDefault();
    if(e.stopPropagation){      //IE
        e.stopPropagation();
    }else if(e.attachEvent){
        e.cancelBubble=true;
    }
    if(dragnow == e.target){
        removeClass(e.target,"hover");
        removeClass(e.target,"zIndex");
        return;
    }else{//如果拽着的元素与被拽着的元素一样，不用处理
        dragnow.innerHTML = e.target.innerHTML;
        dragnow.style.backgroundColor = e.target.style.backgroundColor;
        e.target.innerHTML = text2[0];
        e.target.style.backgroundColor = text2[1];
        removeClass(e.target,"hover");
        removeClass(e.target,"zIndex");

        gameOver();
    }
}
function dragend(e){
    e.preventDefault();
    if(typeof e.target.style.opacity!='undefined'){
        e.target.style.opacity='1';
    }else{
        e.target.style.filter = "alpha(opacity=100)";
    }//针对FF 在dragend 时候阻止冒泡
    removeClass(e.target,"zIndex");

}//发生在被拖拽物体身上

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
    if(s == null){
        alert("游戏尚未开始！！！");
    }
    var count = 0;
    for(var i=0;i<productNum;i++){
        /*console.log("inn:"+parseInt(divArray[i].innerHTML));
         console.log("id:"+parseInt(divArray[i].id));*/
        if(parseInt(divArray[i].innerHTML) == parseInt(divArray[i].id)){
            count++;
            divArray[i].style.margin = "0";
        }else{
            divArray[i].style.margin = "5px";
        }
    }
    if(productNum != 0) {
        if (count == productNum) {
            /*for(var i=0;i<productNum;i++)
             divArray[i].style.margin = 0;*/
            document.getElementById("completeAlert").style.display = "block";
            clearTimeout(s);
            s = null;
        }
    }else{
        clearTimeout(s);
        s = null;
    }
}