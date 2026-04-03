import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("default");

  useEffect(() => {
    fetch("https://api.jikan.moe/v4/anime")
      .then((res) => res.json())
      .then((data) => {
        setAnimeList(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // SEARCH (basic filter)
  const filtered = animeList.filter((anime) =>
    (anime.title || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // SORT
  const sorted = [...filtered].sort((a, b) => {
    if (sortType === "score") {
      return (b.score || 0) - (a.score || 0);
    }

    if (sortType === "title") {
      return (a.title || "").localeCompare(b.title || "");
    }

    return 0;
  });

  return (
    <div className="container">
      <h1>AniSensei</h1>

      {/* CONTROLS */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search anime..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="default">Sort</option>
          <option value="score">Top Rated</option>
          <option value="title">A-Z</option>
        </select>
      </div>

      {/* GRID */}
      <div className="grid">
        {sorted.map((anime) => (
          <div key={anime.mal_id} className="card">
            <img
              src={anime.images?.jpg?.image_url}
              alt={anime.title}
            />

            <h3>{anime.title}</h3>

            <p>
              {anime.synopsis
                ? anime.synopsis.slice(0, 80) + "..."
                : "No description"}
            </p>

            <span>⭐ {anime.score || "N/A"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;