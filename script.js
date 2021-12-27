var last_selected = [null,null];

function changePokemon(element){
    last_selected = [last_selected[1], element.selectedIndex]

    let textarea = document.getElementById("textarea-2");
    let name_last = element.children[last_selected[0]].text.split(" ")[1].split(".")[0].replace(/♀|♂/g,"");
    let name_curr = element.children[last_selected[1]].text.split(" ")[1].split(".")[0].replace(/♀|♂/g,"");
    if(textarea.value.includes(name_last)){
        textarea.value = textarea.value.replace(name_last, name_curr);
        changeText("text2",2);
    }
}

function startRecording() {
    resetAll();
    resetTime();
    document.getElementById("modal-body").innerHTML = "<div id='ba' class='bar'></div>";
    document.getElementById("modal-title").innerHTML = "Generating gif...";
    recorder = new GIF({
        workers: 2,
        quality: 10
    });
    recording = true;

    recorder.on('finished',(blob) =>{
        document.getElementById("modal-title").innerHTML = "Gif ready!";
        document.getElementById("modal-body").innerHTML = "<img id='gif'>";
        document.getElementById("gif").src = URL.createObjectURL(blob);
        restartAnimation();
    });

  }