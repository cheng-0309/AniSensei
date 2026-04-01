import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.jikan.moe/v4/anime")
      .then((res) => res.json())
      .then((data) => {
        setAnimeList(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="container">
      <h1>Anime List</h1>

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
                ? anime.synopsis.slice(0, 120) + "..."
                : "No description"}
            </p>

            <span>Score: {anime.score || "N/A"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;