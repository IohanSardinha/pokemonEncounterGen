<html>

	<head>
		<link rel="stylesheet" href="style.css" />
		<script src="script.js"></script> 
		<script src="html2gif.js"></script>
		
		<title>Pokémon Encounter Generator</title>
	</head>

	<body>

		<h1>Pokémon Encounter Generator</h1>

		<div id="container">
			<img id="background" src="images/background.png">
			<img id="pokemon" src="images/pokemon/%23001%20Bulbasaur.png"> 
			<img id="grass" src="images/grass.png">
			<img id="text-box" src="images/textbox.png">
			<div class="text" id="text1">A wild pokémon appeared!</div>
			<div class="text" id="text2">Its a Bulbasaur!</div>
			<div id="top-bar" class="bar"></div>
			<div id="bottom-bar" class="bar"></div>
		</div>

		<div>
		<select onchange="changePokemon(this);" id="pokemons">
			<?php
				foreach(array_diff(scandir("images/pokemon"),array('.', '..')) as $pokemon){
			?>
			<option><?=$pokemon?></option>
			<?php } ?>
		</select>
		<br>
		<textarea id="textarea-1" oninput="changeText('text1', 1);">A wild pokémon appeared!</textarea>
		<br>
		<textarea id="textarea-2" oninput="changeText('text2', 2);">It's a Bulbasaur!</textarea>
		<br>
		<label>Speed:</label> <input type="range" min="100" max="400" value="300" class="slider" id="speed">
		<br>
		<button onclick="save();">Save</button>
		</div>

		<img id="gif">

	</body>

</html>
