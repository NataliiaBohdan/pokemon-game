function Pokemon({
  name,
  image,
  height,
  weight,
  attack,
  types,
  color,
  flipped,
}) {
  return (
    <li className={`pokemon-item ${flipped ? "flipped" : ""}`}>
      <div className="pokemon-info">
        <div className="pokemon-info-text">
          <p>
            <span className="text-accent">Attack &gt; &nbsp;</span>
            <span className="pokemon-attack-text">{attack}</span>
          </p>
          <p>
            <span className="text-accent">Height &gt; &nbsp;</span> {height}
          </p>
          <p>
            <span className="text-accent">Weight &gt; &nbsp;</span> {weight}
          </p>
          <p>
            <span className="text-accent">Types &gt; &nbsp;</span>{" "}
            <span style={{ color: color }}>{types}</span>
          </p>
        </div>
      </div>
      <div className="pokemon-head-info">
        <img className="pokemon-image animating" src={image} alt={name} />
        <h3 className="pokemon-name" style={{ color: color }}>
          <span> &lt; </span> {name}
          <span> &gt; </span>
        </h3>
      </div>
    </li>
  );
}
export default Pokemon;
