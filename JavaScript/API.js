const fetchBtn = document.getElementById('fetchBtn');
const randPokeDiv = document.getElementById('randPoke');

fetchBtn.addEventListener("click", () => {
    
    const randomId = Math.floor(Math.random() * 898) + 1;
    const appUrl = `https://pokeapi.co/api/v2/pokemon/${randomId}`;

    fetch(appUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

            const pokeName = data.name;
            const pokeAbil = data.abilities[0].ability.name;
            const pokeMove = data.moves[0].move.name;
            const pokeImg = data.sprites.front_default;

            randPokeDiv.innerHTML = `
                <p class="API"><strong>Pokémon Name:</strong> ${pokeName}</p>
                <p class="API"><strong>Ability:</strong> ${pokeAbil}</p>
                <p class="API"><strong>Move:</strong> ${pokeMove}</p>
                <img class="apiImg" src="${pokeImg}" alt="${pokeName}">
            `;
        })
        .catch(error => {
            randPokeDiv.innerHTML = `
                <p class="API"><strong>Error:</strong> ${error.message}</p>`;
        });
});
