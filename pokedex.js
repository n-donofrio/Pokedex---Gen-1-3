
const pokemonCount = 300;
var pokedex = {}; // {1 : {"name" : "bulbsaur", "img" : url, "type" : ["grass", "poison"], "desc" : "...."} }

window.onload = async function() 
{
    // getPokemon(1);
    for (let i = 1; i <= pokemonCount; i++) {
        await getPokemon(i);
        //<div id="1" class="pokemon-name">BULBASAUR</div>
        let pokemon = document.createElement("div");
        pokemon.id = i;
        pokemon.innerText = i.toString() + ". " + pokedex[i]["name"].toUpperCase();
        pokemon.classList.add("pokemon-name");
        pokemon.addEventListener("click", updatePokemon);
        document.getElementById("pokemon-list").append(pokemon);
    }

    document.getElementById("pokemon-description").innerText = pokedex[1]["desc"];

    console.log(pokedex);
}

// 
async function getPokemon(num) 
{
    let url = "https://pokeapi.co/api/v2/pokemon/" + num.toString();

    let res = await fetch(url);
    let pokemon = await res.json();
    // console.log(pokemon);

    let pokemonName = pokemon["name"];
    let pokemonType = pokemon["types"];
    let pokemonImg = pokemon["sprites"]["front_default"];

    res = await fetch(pokemon["species"]["url"]);
    let pokemonDesc = await res.json();

    // console.log(pokemonDesc);
    pokemonDesc = pokemonDesc["flavor_text_entries"][9]["flavor_text"];

    pokedex[num] = {"name" : pokemonName, "img" : pokemonImg, "types" : pokemonType, "desc" : pokemonDesc};

   return {
        name: pokemonName,
        img: pokemonImg,
        types: pokemonType,
        desc: pokemonDesc
    };

}

function updatePokemon()
{
    document.getElementById("pokemon-img").src = pokedex[this.id]["img"];

    //clear previous type
    let typesDiv = document.getElementById("pokemon-types");
  
    while (typesDiv.firstChild) 
    {
        typesDiv.firstChild.remove();
    }

    //update types
    let types = pokedex[this.id]["types"];
  
    for (let i = 0; i < types.length; i++) 
    {
        let type = document.createElement("span");
        type.innerText = types[i]["type"]["name"].toUpperCase();
        type.classList.add("type-box");
        type.classList.add(types[i]["type"]["name"]); //adds background color and font color
        typesDiv.append(type);
    }

    //update description
    document.getElementById("pokemon-description").innerText = pokedex[this.id]["desc"];
}

// Search bar function
document.addEventListener("DOMContentLoaded", function() 
{
    const searchInput = document.getElementById("pokemon-search");
    const searchButton = document.getElementById("search-button");
    const pokemonImg = document.getElementById("pokemon-img");
    const pokemonTypes = document.getElementById("pokemon-types");
    const pokemonDescription = document.getElementById("pokemon-description");

   function displayPokemon(pokemon) 
   {
    pokemonImg.src =   
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

    const types = pokemon.types.map(type => `<span class="type-box 
    ${type.type.name}">${type.type.name.toUpperCase()}</span>`).join("");
    pokemonTypes.innerHTML = types;

    // Display the Pokémon description
    const description = pokedex[pokemon.id]["desc"];
    pokemonDescription.innerHTML = `<p> ${description}</p>`;
}


    function searchPokemon(name) 
    {
        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => 
            {
                displayPokemon(data);
            })
            .catch(error => 
            {
                pokemonImg.src = ""; // Clear image
                pokemonTypes.innerHTML = ""; // Clear types
                pokemonDescription.innerHTML = "<p>Pokémon not found.</p>";
            });
    }

    searchButton.addEventListener("click", function() {
        const searchTerm = searchInput.value.toUpperCase(); // Convert to uppercase
        searchPokemon(searchTerm);
    });

    searchInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchButton.click();
        }
    });
});
