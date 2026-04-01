import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://api.jikan.moe/v4/anime");

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        setAnimeList(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  if (loading) {
    return <h2 className="center">Loading anime...</h2>;
  }

  if (error) {
    return <h2 className="center error">{error}</h2>;
  }

  return (
    <div className="container">
      <h1>Anime Explorer</h1>

      <div className="grid">
        {animeList.map((anime) => (
          <div key={anime.mal_id} className="card">
            <img
              src={anime.images.jpg.image_url}
              alt={anime.title}
            />

            <h2>{anime.title}</h2>

            <p>
              {anime.synopsis
                ? anime.synopsis.slice(0, 100) + "..."
                : "No description available"}
            </p>

            <span>⭐ {anime.score || "N/A"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;