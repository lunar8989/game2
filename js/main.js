var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
document.getElementById("pause").style.display = 'none';
var username = '';
var status = false;
//заводим переменные объектов

var counter = 0,
    min = 0,
    sek = 0,
    box = [],
    stopX = 0,
    stopY = 0,
    jumpCount = 0,
    jumpHeight = 0,
    groundY = 893,
    shishkaStatus = true;

var frozenData = {
    hp: 0,
    min: 0,
    sek: 0,
    timeCode: 0,
};

var ground = {
    img: new Image(),
    x: 0,
    y: 0,
    width: 2048,
    height: 1024,
}; 
ground.img.src = 'img/ground.jpg';

var pers = {
    name: '',
    img: new Image(),
    hp: 100,
    speed: 5,
    jump: 60,
    height: 128,
    width: 128,
    x: 50,
    y: 765,
};

var bear = {
    img: new Image(),
    x: 680,
    y: 765,
};


var gusin = []; 

var shishka = {
    img: new Image(),
    x: 750,
    y: 573,
};
shishka.img.src = "img/shishka.png";

var fon = new Audio();
fon.src = "audio/fon.mp3";

// Игровое меню
document.getElementById('username').oninput = function(){

    username = document.getElementById('username').value;

    if(username != '' && pers.name != ''){

        document.getElementById('btnStart').disabled = false;
        document.getElementById('btnStart').style.backgroundColor = '#F66209';
        document.getElementById('btnStart').style.cursor = 'pointer'; 

    }else if(username == '' && pers.name != ''){

        document.getElementById('btnStart').disabled = true;
        document.getElementById('btnStart').style.backgroundColor = '#F3B158';
        document.getElementById('btnStart').style.cursor = '';

    } 
};

document.getElementById('btnStart').disabled = true;

//Выбор персонажа
document.getElementById('tig').onclick = function() {

    document.getElementById("leoimg").classList.add("grayImg");
    document.getElementById("tigimg").classList.remove("grayImg");  
    pers.img.src = 'img/tig.png'; 
    pers.name = 'tig';

    if(username != '' && pers.name != ''){

        document.getElementById('btnStart').disabled = false;
        document.getElementById('btnStart').style.backgroundColor = '#F66209';
        document.getElementById('btnStart').style.cursor = 'pointer'; 

    }   
    
};

document.getElementById('leo').onclick = function() {

    document.getElementById("tigimg").classList.add("grayImg");
    document.getElementById("leoimg").classList.remove("grayImg"); 
    pers.img.src = 'img/leo.png'; 
    pers.name = 'leo'; 

    if(username != '' && pers.name != ''){

        document.getElementById('btnStart').disabled = false;
        document.getElementById('btnStart').style.backgroundColor = '#F66209';
        document.getElementById('btnStart').style.cursor = 'pointer'; 

    }   
    
};

var secondX = 0,
    secondY = 0,
    persX = pers.x,
    persY = pers.y;

// Создание коробок
for(var i = 0; i < 7; i++){

    box[i] = {
        img: new Image(),
        width: 128,
        height: 128,
        x: secondX,
        y: secondY,
    };
    box[i].img.src="img/box.png";

    if(i == 0){
        box[i].x += 256;
        box[i].y += 765;
        secondX += box[i].x + box[i].width * Math.floor(Math.random() * (5 - 2) + 2);
        secondY += box[i].y - box[i].height;
    }else if(i > 0 && i < 4){
        box[i].x += box[i].width;
        box[i].y = secondY;
        secondX = box[i].x;
        if(i == 3){
            secondY += box[i].height;
            secondX = box[i].x + box[i].width * Math.floor(Math.random() * (5 - 2) + 2);
        }  
    }else if(i > 3 && i < 7){
        box[i].x += box[i].width;
        box[i].y = secondY;
        secondX += box[i].width * Math.floor(Math.random() * (5 - 2) + 2);
    }   
}


var leftPressed = false;
var rightPressed = false;
var jumpPressed = false;
var pauseStatus = false;


function game(){   
    document.getElementById("menu").style.display = "none";
        controll();
        if(pauseStatus != true){    
            update();
        }
        render();
        requestAnimFrame(game);  
    
    
}
document.getElementById("intro").style.display = "none";

document.getElementById("btnStart").onclick = function() {  
    
    document.getElementById("menu").style.display = "none";
    document.getElementById("intro").style.display = "";
};

document.addEventListener("keydown", skipIntro);

function skipIntro(e){
    if(e.keyCode == 32){
        document.getElementById("intro").style.display = "none";
        game();
    }
}

document.getElementById('intro').addEventListener('ended',myHandler,false);

function myHandler(e) {
    document.getElementById("intro").style.display = "none";
    game();

}


function controll(){
    
    document.addEventListener("keydown", keyRightHandler, false);
    document.addEventListener("keyup", keyLeftHandler, false);

    function keyRightHandler(e){
        if(e.keyCode == 68 || e.keyCode == 39 && pauseStatus != true){
            rightPressed = true;
        }
        if(e.keyCode == 65 || e.keyCode == 37 && pauseStatus != true){
            leftPressed = true;
        }
        if(e.keyCode == 87 || e.keyCode == 38 && pauseStatus != true){
            if(persY == groundY - pers.height){
               jumpPressed = true; 
            }
            
        }

        if(e.keyCode == 27){

            pauseStatus = true;
            
        }

    }

    function keyLeftHandler(e){
        if(e.keyCode == 68 || e.keyCode == 39 && pauseStatus != true){
            rightPressed = false;
        }
        if(e.keyCode == 65 || e.keyCode == 37 && pauseStatus != true){
            leftPressed = false;
        }
    }

    document.getElementById("resume").onclick = function() {
        pauseStatus = false;
        document.getElementById("pause").style.display = 'none';
    };
    document.getElementById("close").onclick = function() {
        location.reload();
        pauseStatus = false;
        document.getElementById("pause").style.display = 'none';
    };
}

function update(){

    if(bear.x != box[0].x + box[0].width - 5 && bear.x + 128 != box[4].x + 5){
        if(bear.x == box[0].x + box[0].width + 7){
            bear.img.src="img/bearPos2.png";
            
        }else if(bear.x + 128 == box[4].x - 7){
            bear.img.src="img/bear.png";
            
        }else{
            bear.img.src="img/bearPos2.png";
            
        }

        if(bear.img.src == "img/bearPos2.png"){
            bear.x++;
        }else{
            bear.x--;

        }
        if(status == true){
            bear.x -= 1;

        }else{
            bear.x += 1;

        }
    }
        
        

    
    if(rightPressed && persX < canvas.width-pers.width){
        pers.img.src = "img/" + pers.name + "Pos2.png";

        if(persX >= (canvas.width / 2) && ground.x >= -(ground.width - canvas.width)){
            
            ground.x -= pers.speed; 
            shishka.x -= pers.speed;
            for(var i in box){
                
                if(persX < box[i].x && stopX === 0){
                    stopX = box[i].x;
                    stopY = box[i].y;
                }else if(persX > stopX){
                    stopX = 0;
                }

                if(persX + pers.width !== stopX && persX + pers.width >= stopX - 5 && persY + pers.height <= stopY)     {

                    box[i].x -= pers.speed;

                }

                if(persX + pers.width < stopX - 5){
                    box[i].x -= pers.speed;
                }

                if(persX + pers.width >= stopX - 5 && persY == stopY + pers.width){
                    box[i].x -= pers.speed;
                } 

                
            }

            

        }else{

            for(var i in box){
                
                if(persX + pers.width < box[i].x && stopX === 0){
                    stopX = box[i].x;
                    stopY = box[i].y;
                }else if(persX > stopX + box[i].width){
                    stopX = 0;
                }

            }
            

            if(persX + pers.width !== stopX && persX + pers.width >= stopX - 5 && persY + pers.height <= stopY){

                persX += pers.speed;

            }

            if(persX + pers.width < stopX - 5){
                persX += pers.speed;
            }

            if(persX + pers.width >= stopX - 5 && persY == stopY + pers.width){
                persX += pers.speed;
            } 

        }
        
        if(persX + pers.width == shishka.x){
                shishkaStatus = false;
                pers.hp += 5;
        }

    }
    else if(leftPressed && persX > 0){

        pers.img.src = "img/" + pers.name + ".png";
  
        if(persX <= (canvas.width / 2) && ground.x <= 0){
            ground.x += pers.speed; 
            shishka.x += pers.speed;
            for(var i in box){    
                if(persX > box[i].x + box[i].width && stopX === 0){
                    stopX = box[i].x + box[i].width;
                    stopY = box[i].y;
                }else if(persX > stopX){
                    stopX = 0;
                }      
                if(persX !== stopX){
                    box[i].x += pers.speed;
                }
            }
            
        }else{
            for(var i in box) {
                if(persX > box[i].x + box[i].width && stopX === 0){
                    stopX = box[i].x + box[i].width;
                }else if (persX + pers.width < stopX - pers.width){
                    stopX = 0;
                }
            }

            if(persX !== stopX && persX <= stopX + 5 && persY + pers.height <= stopY){

                persX -= pers.speed;

            }

            if(persX != stopX - pers.width - 5 || persX >= stopX + 5){
                persX -= pers.speed;
            }

            

            
        }
        
    }

    if(persY <= groundY - pers.height && jumpPressed != true){
        
        if(persY + pers.height == stopY && persX + pers.width >= stopX && persX <= stopX + pers.width){ 
            groundY = stopY;
        }else if(persY == groundY - pers.height){
            groundY = 893;
        }else{
            persY += 4;
        }

        if(persX + pers.width >= shishka.x && persX <= shishka.x + 64 && persY + pers.height == shishka.y){
            shishkaStatus = false;
            pers.hp += 5;
        }
    }

    if(jumpPressed){
        // if(boxstatus == false){
        //     jumpCount++;
        //     jumpHeight = Math.floor(2*pers.jump*Math.sin(Math.PI*jumpCount/pers.jump));
        //     persY = Math.floor(canvas.height - pers.height - jumpHeight - 130);
        // }else{
        //     jumpCount = 0;
            
        //     jumpHeight = 0;
        // }
        
        persY -= 8;
        jumpCount++;
           
    }

    if(jumpCount > pers.jump - 30){
        
        jumpCount = 0;
        jumpPressed = false;
        
    }

    if(counter % 60 == 0){
        if(pers.hp == 0){
            alert("Вы проирали, начните игру заново.");
            location.reload();
        }

        pers.hp--;
        sek++;
        if(sek % 60 == 0){
            min++;
            sek = 0;
        }
        
    }

    if(counter % 1850 == 0){
        fon.play();
        counter = 0;
    }

    counter++;
    
    
}

function render(){
    context.drawImage(ground.img, ground.x, ground.y);
    context.drawImage(pers.img, persX, persY,  pers.width, pers.height);

    for(var i in box){
        context.drawImage(box[i].img, box[i].x, box[i].y, box[i].width, box[i].height);
    }
    if(shishkaStatus != false){
        context.drawImage(shishka.img, shishka.x, shishka.y, 64, 64);
    }
    context.drawImage(bear.img, bear.x, bear.y, 128, 128);
       
    if(pauseStatus == true){
        
        document.getElementById("pause").style.display = '';
        
    }
    
    context.fillStyle = '#000';
    context.font = '45px Verdana';
    context.fillText('Здоровье: ' + pers.hp, 10, ground.height - 20);
    context.font = '35px Verdana';
    context.fillText('Время игры ' + min + ':' + sek, canvas.width / 1.35, 100);
    context.fillStyle = '#000';
    context.font = '30px Verdana';
    context.fillText('User: ' + username, 10, 30);
}

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
            };
})();
