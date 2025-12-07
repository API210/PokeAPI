const fetchBtn = document.getElementById('fetchBtn');
const randPokeDiv = document.getElementById('randPoke');

fetchBtn = addEventListener("click", () =>{
    const appUrl = "https://pokeapi.co/api/v2/pokemon/ditto";

    fetch(appUrl)
    .then(response => {
        console.log("response");
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
});