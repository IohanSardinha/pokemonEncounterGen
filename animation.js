var canvas, context;
var background, textBox, top_bar, bottom_bar;
var last_time, total_time = 0;
var animation_duration = 4;
var curr_rep = 0;

function draw(){
    let now = Date.now();
    let deltaTime = now - last_time;
    last_time = now;
    total_time += deltaTime/1000;

    if(parseInt(total_time/animation_duration) > curr_rep){
        curr_rep++
        background.resetPosition();
        top_bar.resetPosition();
        bottom_bar.resetPosition();
    }

    context.clearRect(0,0,canvas.width,canvas.height);
    background.draw(total_time, deltaTime);
    textBox.draw(total_time, deltaTime);
    top_bar.draw(total_time, deltaTime);
    bottom_bar.draw(total_time, deltaTime);

    context.font = '20px pokefont';
    context.fillText("A wild pokémon appeared",0,10);

    window.requestAnimationFrame(draw);
}

onload = ()=>{
    canvas = document.getElementById("container");
    context = canvas.getContext("2d");
    last_time = Date.now();

    background = new Sprite(0,0,420,111, "images/background.png", context);
    background.move_function = (total_time, delta_time)=>{
        let speed = 0.093/animation_duration*4;
        time = total_time % animation_duration;
        if(time < animation_duration/2){
            background.position.x -= delta_time*speed;
        }
    };

    top_bar = new Rectangle(0,0, 234,170/2,"#000000",context);
    top_bar.move_function = (total_time, delta_time)=>{
        top_bar.position.y-=1;
    };

    bottom_bar = new Rectangle(0,170/2, 234,170/2,"#000000",context);
    bottom_bar.move_function = (total_time, delta_time)=>{
        bottom_bar.position.y += 1;
    };


    textBox = new Sprite(0,111,234,170-111,"images/textbox.png", context);

    window.requestAnimationFrame(draw);
}