var canvas, context;
var background, textBox, top_bar, bottom_bar, first_text, second_text, pokemon, grass;
var last_time, total_time = 0;
var animation_duration = 4;
var curr_rep = 0;
var recording = false, recorder;
var playing = true;
let frameCount = 0;

function restartAnimation(){
    playing = true;
    resetTime();
    resetAll();
    window.requestAnimationFrame(draw);
}

window.onfocus = restartAnimation;

window.onblur = () =>{
    playing = false;
}

function resetTime(){
    total_time = 0;
    last_time = Date.now();
    curr_rep = 0;
}

function resetAll(){
    frameCount = 0;
    background.resetPosition();
    top_bar.resetPosition();
    bottom_bar.resetPosition();
    pokemon.resetPosition();
    grass.resetPosition();
}

function draw(){
    if(playing || recording){
        let now = Date.now();
        let deltaTime = (now - last_time)/1000;
        last_time = now;
        total_time += deltaTime;

        if(parseInt(total_time/animation_duration) > curr_rep){
            curr_rep++
            resetAll();
            if(recording){
                playing = false;
                recording = false;
                recorder.render();
            }
        }

        context.clearRect(0,0,canvas.width,canvas.height);
        background.draw(total_time, deltaTime);
        pokemon.draw(total_time, deltaTime);
        grass.draw(total_time,deltaTime);
        textBox.draw(total_time, deltaTime);
        first_text.draw(total_time, deltaTime);
        second_text.draw(total_time, deltaTime);
        top_bar.draw(total_time, deltaTime);
        bottom_bar.draw(total_time, deltaTime);
        
        let speed = document.getElementById("speed").value;
        if(recording && frameCount%speed == 0){
            recorder.addFrame(canvas, {copy:true,delay:200});
        }
        frameCount++;
        window.requestAnimationFrame(draw);
}
}

onload = ()=>{
    last_selected = [null, document.getElementById("pokemons").selectedIndex]

    canvas = document.getElementById("container");
    context = canvas.getContext("2d");
    //context.font = "10px pokefont";
    last_time = Date.now();

    background = new Sprite(0,0,420,111, "images/background.png", context);
    background.move_function = (total_time, delta_time)=>{
        let speed = (background.size.width*8/9)/(animation_duration);
        time = total_time % animation_duration;
        if(time < animation_duration/2){
            background.position.x -= delta_time*speed;
        }
    };

    top_bar = new Rectangle(0,0, 234,111/2,"#000000",context);
    top_bar.move_function = (total_time, delta_time)=>{
        let speed = top_bar.size.height/(animation_duration/2);
        top_bar.position.y-=speed*delta_time;
    };

    bottom_bar = new Rectangle(0,111/2, 234,170-(111/2),"#000000",context);
    bottom_bar.move_function = (total_time, delta_time)=>{
        let speed = bottom_bar.size.height/(animation_duration/2);
        bottom_bar.position.y+=speed*delta_time;
    };


    textBox = new Sprite(0,111,234,170-111,"images/textbox.png", context);

    first_text = new CanvasText(10,135, document.getElementById("textarea-1").value,"20px pokefont", context);
    first_text.move_function = (total_time, delta_time) =>{
        let time = total_time % animation_duration;
        if(time < animation_duration/2 || time > animation_duration*3/4){
            first_text.text = "";
        }
        else{
            let text = document.getElementById("textarea-1").value.replace(/ /g, '\u00a0');
            let r_index = Math.ceil((time-animation_duration/2)/(animation_duration/4)*100);  
            first_text.text = text.substring(0, r_index);
        }
    };

    second_text = new CanvasText(10,135, document.getElementById("textarea-2").value,"20px pokefont", context);
    second_text.move_function = (total_time, deltaTime) =>{
        let time = total_time % animation_duration;
        if(time > animation_duration*3/4){
            let text = document.getElementById("textarea-2").value.replace(/ /g, '\u00a0');
            let r_index = Math.ceil((time-animation_duration*3/4)/(animation_duration/4)*100);  
            second_text.text = text.substring(0, r_index);
        }
        else{
            second_text.text = "";
        }
    };


    let name = encodeURIComponent("images/pokemon/"+document.getElementById("pokemons").children[last_selected[1]].text);
    pokemon = new Sprite(130+170,10,70,70, name, context);
    pokemon.move_function = (total_time, deltaTime)=>{
        pokemon.image.src = encodeURIComponent("images/pokemon/"+document.getElementById("pokemons").children[last_selected[1]].text);
        let time = total_time%(animation_duration);
        if(time < animation_duration/2){
            let speed = 170/(animation_duration/2);
            pokemon.position.x -= speed*deltaTime; 
        }
    };

    grass = new Sprite(0, 10, 513, 46, "images/grass.png", context);
    grass.move_function = (total_time, deltaTime)=>{
        let xSpeed =grass.size.width/animation_duration;
        grass.position.x -= xSpeed*deltaTime;
        let ySpeed = 120/(animation_duration/2);
        grass.position.y += ySpeed*deltaTime;
    };

    window.requestAnimationFrame(draw);
}