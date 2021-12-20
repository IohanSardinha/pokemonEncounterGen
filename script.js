var last_selected = [null,null];
function changePokemon(element){
    last_selected = [last_selected[1], element.selectedIndex]
    document.getElementById("pokemon").src = encodeURIComponent("images/pokemon/"+element.children[element.selectedIndex].text);    

    let textarea = document.getElementById("textarea-2");
    let name_last = element.children[last_selected[0]].text.split(" ")[1].split(".")[0].replace(/♀|♂/g,"");
    let name_curr = element.children[last_selected[1]].text.split(" ")[1].split(".")[0].replace(/♀|♂/g,"");
    if(textarea.value.includes(name_last)){
        textarea.value = textarea.value.replace(name_last, name_curr);
        changeText("text2",2);
    }
}

function changeText(elementId, textareaNum){
    document.getElementById(elementId).innerText = document.getElementById("textarea-"+textareaNum.toString()).value.replace(/ /g, '\u00a0');
}

function reset_animation(id) {
    var el = document.getElementById(id);
    el.style.animation = 'none';
    el.offsetHeight; /* trigger reflow */
    el.style.animation = null; 
}

function resetAnimations(){
    reset_animation("background");
    reset_animation("pokemon");
    reset_animation("grass");
    reset_animation("text1");
    reset_animation("text2");
    reset_animation("top-bar");
    reset_animation("bottom-bar");
}

function save(){
    resetAnimations();
    document.getElementById("gif").style.visibility = 'hidden';
    let speedval = document.getElementById("speed").value;
    let speed = 500-speedval;
    let options = {
        width: 234,
        height: 169,
        gifDelay: speed,
        quality: 0
    };

    let html2Gif = new Html2Gif(document.getElementById("container"), options);
    html2Gif.oncomplete = function(dataUri) {
        document.getElementById("gif").style.visibility = 'visible';
        document.getElementById("gif").src = dataUri;
    };
    html2Gif.onerror = function(err){
        console.log(err);
    }
    
    html2Gif.start(1, 15);
}

onload = ()=>{
    last_selected = [null, document.getElementById("pokemons").selectedIndex]
    changePokemon(document.getElementById("pokemons"));
    changeText("text1",1);
    changeText("text2",2);
}