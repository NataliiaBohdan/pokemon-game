import { useState, useEffect } from "react";
import Pokemon from "./Pokemon";
import Button from "./Button";

function Pokemons() {
  const [pokemons, setPokemons] = useState([]);
  const [winner, setWinner] = useState(null);
  const [battleInProgress, setBattleInProgress] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    fetchPokemons();
  }, []);

  async function fetchPokemons() {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/");
    const data = await res.json();
    const randomTwo = data.results.sort(() => 0.5 - Math.random()).slice(0, 2);

    const detailedPokemons = await Promise.all(
      randomTwo.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        const detailedData = await res.json();

        const speciesRes = await fetch(detailedData.species.url);
        const speciesData = await speciesRes.json();

        const attackStat = detailedData.stats.find(
          (stat) => stat.stat.name === "attack"
        ).base_stat;

        const types = detailedData.types.map((t) => t.type.name).join(", ");

        const moves = detailedData.moves.map((m) => m.move.name);
        const randomMove = moves[Math.floor(Math.random() * moves.length)];

        return {
          name: detailedData.name,
          image: detailedData.sprites.front_default,
          height: detailedData.height,
          weight: detailedData.weight,
          attack: attackStat,
          types: types,
          color: speciesData.color.name,
          move: randomMove,
        };
      })
    );

    setPokemons(detailedPokemons);
    setWinner(null);
  }

  const handleStartBattle = () => {
    setBattleInProgress(true);
    setTimer(5);

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => {
      const [pokemon1, pokemon2] = pokemons;

      if (pokemon1.attack === pokemon2.attack) {
        setWinner({ name: "Draw" });
      } else {
        const winnerPokemon =
          pokemon1.attack > pokemon2.attack ? pokemon1 : pokemon2;
        setWinner(winnerPokemon);
      }

      setBattleInProgress(false);
      setTimer(0);
    }, 5000);
  };
  const handleStartOver = () => {
    setWinner(null);

    setBattleInProgress(false);
    fetchPokemons();
  };

  return (
    <>
      {!winner ? (
        <div className="game-wrapper">
          <ul className="pokemons-wrapper">
            {pokemons.map((pokemon, idx) => (
              <Pokemon
                key={idx}
                name={pokemon.name}
                image={pokemon.image}
                height={pokemon.height}
                weight={pokemon.weight}
                attack={pokemon.attack}
                types={pokemon.types}
                color={pokemon.color}
                flipped={idx === 0}
              />
            ))}
          </ul>

          {battleInProgress ? (
            <p className="timer">
              Battle finish in: <span className="pokemon-timer">{timer}</span>{" "}
              sec...
            </p>
          ) : (
            <Button onClick={handleStartBattle}>Start Battle</Button>
          )}
        </div>
      ) : (
        <div className="game-wrapper">
          {winner.name === "Draw" ? (
            <h2>🤝 It's a Draw! 🤝</h2>
          ) : (
            <>
              <h2>
                🏆 Winner:&nbsp;
                <span className="pokemon-winner-text">
                  &lt;{winner.name}&gt;
                </span>{" "}
                🏆
              </h2>
              <p className="result-log">
                {pokemons[0].attack === pokemons[1].attack
                  ? "It looks like this might be a close match! 🤝"
                  : `${
                      pokemons[0].attack > pokemons[1].attack
                        ? pokemons[0].name
                        : pokemons[1].name
                    } lands a decisive blow with ${
                      pokemons[0].attack > pokemons[1].attack
                        ? pokemons[0].move
                        : pokemons[1].move
                    }, knocking out ${
                      pokemons[0].attack > pokemons[1].attack
                        ? pokemons[1].name
                        : pokemons[0].name
                    }! 💥`}
              </p>

              <div className="pokemon-winner-box">
                <img src={winner.image} alt={winner.name} />
                <img src="/conf.gif" className="pokemon-conf-gif" />
              </div>
            </>
          )}
          <Button onClick={handleStartOver}>🔄 Start Again</Button>
        </div>
      )}
    </>
  );
}

export default Pokemons;
