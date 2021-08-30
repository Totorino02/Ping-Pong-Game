const cvs = document.querySelector('.canvas');
const ctx = cvs.getContext('2d');
const  haut = document.querySelector('.haut');
const  bas = document.querySelector('.bas');
let d;

let ball ={
    x:cvs.width/2,
    y:cvs.height/2,
    raduis:10,
    speed:5,
    velocityX:5,
    velocityY:5,
    color: "white"
}

let com = {
    x:0,
    y:cvs.height/2-100/2,
    width:15,
    height:100,
    color: "white",
    score:0
}

let user = {
    x:cvs.width-15,
    y:cvs.height/2-100/2,
    width:15,
    height:100,
    color: "white",
    score:0
}

let Net = {
    x:cvs.width/2 -1,
    y:0,
    w:2,
    h:10,
    color: "white"
}

// GAME LOOP

game = ()=>{
    update()
    render()
}
setInterval(game,20)



//--------------------------------------------FUNCTIONS-----------------------------------------------

drawNet = ()=>{
    for(let i=0; i<cvs.width; i+=15){
        drawRect(Net.x,Net.y+i,Net.w,Net.h,Net.color)
    }
}

//help us draw rectangle
drawRect = (x,y,w,h,color)=>{
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}

//help us draw circle
drawCircle = (x,y,r,color)=>{
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2)
    ctx.closePath();
    ctx.fill();
}

//help us draw text
drawText = (text, x,y)=>{
    ctx.fillStyle = "white";
    ctx.font = "75px fantasy";
    ctx.fillText(text,x,y)
}

// this function build the game interface
render =()=>{
    drawRect(0,0,600,400,"black")
    drawText(com.score, 1*(cvs.width/4),cvs.height/5)
    drawText(user.score, 3*(cvs.width/4)-50,cvs.height/5)
    drawNet()
    drawRect(user.x,user.y,user.width,user.height,user.color)
    drawRect(com.x,com.y,com.width,com.height,com.color)
    drawCircle(ball.x,ball.y,ball.raduis,ball.color)
}

// this function detect collisions 
collision =(b,p)=>{
    
    b.top = b.y-b.raduis;
    b.bottom = b.y+b.raduis;
    b.left = b.x-b.raduis;
    b.right = b.x+b.raduis;

    p.top = p.y;
    p.bottom = p.y+p.height;
    p.left = p.x;
    p.right = p.x+p.width;

    return b.right>p.left && b.left<p.right && b.top<p.bottom && b.bottom>p.top
}

restball = ()=>{
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;
    ball.velocityX = -ball.velocityX
}

moveUser =()=>{
    haut.addEventListener('click',()=>{
        d="UP"
    })
    bas.addEventListener('click',()=>{
        d="DOWN"
    })
    user.y = (d=="UP" && user.y>0)? user.y-=0.05 : user.y 
    user.y = (d=="DOWN" && user.y<cvs.height-100)? user.y+=0.05 : user.y
}

direction=(e)=>{
    if(e.keyCode== 38){
        d="UP"
    }else if(e.keyCode== 40){
        d="DOWN"
    }
    user.y = (d=="UP" && user.y>0)? user.y-=0.05 : user.y 
    user.y = (d=="DOWN" && user.y<cvs.height-100)? user.y+=0.05 : user.y 
}

movePaddle = (e)=>{
    let rect = cvs.getBoundingClientRect();
    user.y = e.clientY - rect.top - user.height/2;
}

update = ()=>{
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    if(ball.y+ball.raduis > cvs.height || ball.y-ball.raduis<0){
        ball.velocityY = -ball.velocityY
    }
    
    let player = (ball.x>cvs.width/2)? user : com;
    if(collision(ball,player)){
        coef = ball.y -(player.y + player.height/2);
        coef = coef/(player.height/2);
        angle = coef*(Math.PI/4)

        dir = (ball.x>cvs.width/2)? -1 : 1

        ball.velocityX = dir*(ball.speed*Math.cos(angle))
        ball.velocityY = (ball.speed*Math.sin(angle))

        ball.speed +=0.01;
    }
    if(ball.x-ball.raduis<0){
        user.score++;
        restball()
    }else if(ball.x-ball.raduis>cvs.width){
        com.score++;
        restball()
    }
    let computerLevel = 0.1;
    com.y +=(ball.y - (com.y+com.height/2))*computerLevel

    //document.addEventListener('keydown',function(e){ direction(e)});

    cvs.addEventListener('mousemove', (e)=>{movePaddle(e)});
    
    //moveUser()
}