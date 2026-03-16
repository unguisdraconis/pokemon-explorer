import { useEffect, useRef, useState } from "react";
import "./App.css";

const pokemons = [
  { id: 1, name: "Bulbasaur", type: "Grass", hp: 45, attack: 49 },
  { id: 4, name: "Charmander", type: "Fire", hp: 39, attack: 52 },
  { id: 7, name: "Squirtle", type: "Water", hp: 44, attack: 48 },
  { id: 25, name: "Pikachu", type: "Electric", hp: 35, attack: 55 },
  { id: 6, name: "Charizard", type: "Fire", hp: 78, attack: 84 },
  { id: 9, name: "Blastoise", type: "Water", hp: 79, attack: 83 },
  { id: 3, name: "Venusaur", type: "Grass", hp: 80, attack: 82 },
  { id: 150, name: "Mewtwo", type: "Psychic", hp: 106, attack: 110 },
  { id: 39, name: "Jigglypuff", type: "Normal", hp: 115, attack: 45 },
  { id: 143, name: "Snorlax", type: "Normal", hp: 160, attack: 110 },
  { id: 94, name: "Gengar", type: "Ghost", hp: 60, attack: 65 },
  { id: 131, name: "Lapras", type: "Water", hp: 130, attack: 85 },
  { id: 133, name: "Eevee", type: "Normal", hp: 55, attack: 55 },
  { id: 149, name: "Dragonite", type: "Dragon", hp: 91, attack: 134 },
  { id: 59, name: "Arcanine", type: "Fire", hp: 90, attack: 110 },
  { id: 65, name: "Alakazam", type: "Psychic", hp: 55, attack: 50 },
  { id: 68, name: "Machamp", type: "Fighting", hp: 90, attack: 130 },
  { id: 76, name: "Golem", type: "Rock", hp: 80, attack: 120 },
  { id: 130, name: "Gyarados", type: "Water", hp: 95, attack: 125 },
  { id: 148, name: "Dragonair", type: "Dragon", hp: 61, attack: 84 },
];

const getPokemonSpriteUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

function PokemonCard({ pokemon }) {
  const [flipped, setFlipped] = useState(false);
  const flipTimeoutRef = useRef(null);

  const clearFlipTimeout = () => {
    if (flipTimeoutRef.current) {
      clearTimeout(flipTimeoutRef.current);
      flipTimeoutRef.current = null;
    }
  };

  const toggleFlip = () => {
    clearFlipTimeout();
    setFlipped((value) => !value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFlip();
    }
  };

  useEffect(() => {
    if (!flipped) {
      clearFlipTimeout();
      return;
    }

    flipTimeoutRef.current = setTimeout(() => {
      setFlipped(false);
      flipTimeoutRef.current = null;
    }, 10000);

    return () => {
      clearFlipTimeout();
    };
  }, [flipped]);

  return (
    <div
      className={`card ${flipped ? "is-flipped" : ""}`}
      aria-label={`Card for ${pokemon.name}`}
      role="button"
      tabIndex={0}
      onClick={toggleFlip}
      onKeyDown={handleKeyDown}
    >
      <div className="card-inner">
        <div className="card-face card-front">
          <img src={getPokemonSpriteUrl(pokemon.id)} alt={pokemon.name} />
          <h2>{pokemon.name}</h2>
        </div>

        <div className="card-face card-back">
          <h2>{pokemon.name}</h2>
          <div className="stats">
            <p>
              <strong>Type:</strong> {pokemon.type}
            </p>
            <p>
              <strong>HP:</strong> {pokemon.hp}
            </p>
            <p>
              <strong>Attack:</strong> {pokemon.attack}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedType, setSelectedType] = useState("All");
  const hpValues = pokemons.map((pokemon) => pokemon.hp);
  const attackValues = pokemons.map((pokemon) => pokemon.attack);
  const minHp = Math.min(...hpValues);
  const maxHp = Math.max(...hpValues);
  const minAttack = Math.min(...attackValues);
  const maxAttack = Math.max(...attackValues);

  const [hpCap, setHpCap] = useState(maxHp);
  const [attackCap, setAttackCap] = useState(maxAttack);

  const types = Array.from(
    new Set(pokemons.map((pokemon) => pokemon.type)),
  ).sort();

  const filteredPokemons = pokemons
    .filter(
      (pokemon) => selectedType === "All" || pokemon.type === selectedType,
    )
    .filter((pokemon) => pokemon.hp <= hpCap)
    .filter((pokemon) => pokemon.attack <= attackCap);

  return (
    <div className="App">
      <h1>Pokémon Explorer</h1>

      <div className="filters">
        <button
          className={`filter-button ${selectedType === "All" ? "active" : ""}`}
          onClick={() => setSelectedType("All")}
        >
          All
        </button>
        {types.map((type) => (
          <button
            key={type}
            className={`filter-button ${selectedType === type ? "active" : ""}`}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="range-filters">
        <div className="range-control">
          <label htmlFor="hpRange">Max HP: {hpCap}</label>
          <input
            id="hpRange"
            type="range"
            min={minHp}
            max={maxHp}
            value={hpCap}
            onChange={(event) => setHpCap(Number(event.target.value))}
          />
        </div>

        <div className="range-control">
          <label htmlFor="attackRange">Max Attack: {attackCap}</label>
          <input
            id="attackRange"
            type="range"
            min={minAttack}
            max={maxAttack}
            value={attackCap}
            onChange={(event) => setAttackCap(Number(event.target.value))}
          />
        </div>
      </div>

      <div className="grid-container">
        {filteredPokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      <footer className="footer">
        <a
          className="social-button"
          href="mailto:jeremiah@vols.utk.edu"
          aria-label="Send email"
          title="Send email"
        >
          ✉️
        </a>
        <a
          className="social-button"
          href="https://github.com/unguisdraconis"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub page"
          title="GitHub"
        >
          🐙
        </a>
        <a
          className="social-button"
          href="https://www.linkedin.com/in/jeremiahjking"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn profile"
          title="LinkedIn"
        >
          🔗
        </a>
      </footer>
    </div>
  );
}
