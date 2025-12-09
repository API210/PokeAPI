const fetchBtn = document.getElementById('fetchBtn');
const randPokeDiv = document.getElementById('randPoke');

fetchBtn.addEventListener("click", () =>{
    const appUrl = "https://pokeapi.co/api/v2/pokemon/ditto";

    fetch(appUrl)
    .then(response => {
        console.log("response");
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })

.then(data => {
    const pokeName = data.name;
    const pokeAbil = abilities.name;
    const pokeMoves = moves.move.name;
console.log("data");
    randPokeDiv.innerHTML = `<p><strong>Pokemon Name:</strong> ${data.name}</p>
    <p><strong>Pokemon Ability:</strong> ${abilities.name} C</p>
    <p><strong>Wind Speed:</strong> ${moves.move.name} km/h</p>`;
})
.catch(error =>{
    randPokeDiv.innerHTML = `
    <p><strong>Error:</strong> ${error.message}</p>`;
    console.log(error);
});
});