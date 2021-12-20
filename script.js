var last_selected = [null,null];
function changePokemon(element){
    last_selected = [last_selected[1], element.selectedIndex]
    document.getElementById("pokemon").src = encodeURIComponent("images/pokemon/"+element.children[element.selectedIndex].text);    

    let textarea = document.getElementById("textarea-2");
    let name_last = element.children[last_selected[0]].text.split(" ")[1].split(".")[0];
    let name_curr = element.children[last_selected[1]].text.split(" ")[1].split(".")[0];
    if(textarea.value.includes(name_last)){
        textarea.value = textarea.value.replace(name_last, name_curr);
        changeText("text2",2);
    }
}

function changeText(elementId, textareaNum){
    document.getElementById(elementId).innerText = document.getElementById("textarea-"+textareaNum.toString()).value.replace(/ /g, '\u00a0');
}

onload = ()=>{
    last_selected = [null, document.getElementById("pokemons").selectedIndex]
    changePokemon(document.getElementById("pokemons"));
    changeText("text1",1);
    changeText("text2",2);
}