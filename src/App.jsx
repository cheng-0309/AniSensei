import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [sortType, setSortType] = useState("default");
  const [minScore, setMinScore] = useState(0);

  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const [loading, setLoading] = useState(false);

  // 🔥 LIVE SEARCH DROPDOWN
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!search.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `https://api.jikan.moe/v4/anime?q=${search}&limit=5`
        );
        const data = await res.json();
        setSuggestions(data.data || []);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔥 MAIN FETCH
  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);

      try {
        const url = debouncedSearch
          ? `https://api.jikan.moe/v4/anime?q=${debouncedSearch}`
          : `https://api.jikan.moe/v4/anime?page=${page}`;

        const res = await fetch(url);
        const data = await res.json();

        if (debouncedSearch) {
          setAnimeList(data.data);
        } else {
          setAnimeList((prev) => [...prev, ...data.data]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [page, debouncedSearch]);

  const handleSearch = () => {
    if (!search.trim()) return;
    setDebouncedSearch(search);
    setSuggestions([]);
    setPage(1);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id]
    );
  };

  const filtered = animeList
    .filter((a) => (a.score ?? 0) >= minScore)
    .filter((a) =>
      showFavorites ? favorites.includes(a.mal_id) : true
    );

  const sorted = [...filtered].sort((a, b) => {
    if (sortType === "score") return (b.score ?? 0) - (a.score ?? 0);
    if (sortType === "title")
      return (a.title || "").localeCompare(b.title || "");
    return 0;
  });

  return (
    <div className="app">
      {/* HERO */}
      <div className="hero">
        <div className="hero-overlay">
          <h1 className="hero-title">AniSensei</h1>

          <div className="hero-search-wrapper">
            <div className="hero-search">
              <input
                type="text"
                placeholder="Search anime..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
            </div>

            {suggestions.length > 0 && (
              <div className="search-dropdown">
                {suggestions.map((anime) => (
                  <div
                    key={anime.mal_id}
                    className="dropdown-item"
                    onClick={() => {
                      setSearch(anime.title);
                      setDebouncedSearch(anime.title);
                      setSuggestions([]);
                    }}
                  >
                    <img src={anime.images?.jpg?.image_url} />
                    <span>{anime.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="hero-subtext">
            Discover trending anime, top rated shows, and your favorites
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="main-container">
        <div className="controls">
          <select onChange={(e) => setSortType(e.target.value)}>
            <option value="default">Sort</option>
            <option value="score">Top Rated</option>
            <option value="title">A-Z</option>
          </select>

          <select onChange={(e) => setMinScore(Number(e.target.value))}>
            <option value="0">All Scores</option>
            <option value="7">7+</option>
            <option value="8">8+</option>
            <option value="9">9+</option>
          </select>

          <button onClick={() => setShowFavorites(!showFavorites)}>
            Show Favorites
          </button>
        </div>

        <div className="grid">
          {sorted.map((anime) => (
            <div key={anime.mal_id} className="card">
              <img src={anime.images?.jpg?.image_url} />
              <h3>{anime.title}</h3>
              <p>
                {anime.synopsis
                  ? anime.synopsis.slice(0, 80) + "..."
                  : "No description"}
              </p>
              <span>⭐ {anime.score ?? "N/A"}</span>

              <button onClick={() => toggleFavorite(anime.mal_id)}>
                {favorites.includes(anime.mal_id)
                  ? "❤️ Favorited"
                  : "🤍 Add"}
              </button>
            </div>
          ))}
        </div>

        {!debouncedSearch && (
          <div className="center">
            <button onClick={() => setPage((p) => p + 1)}>
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;