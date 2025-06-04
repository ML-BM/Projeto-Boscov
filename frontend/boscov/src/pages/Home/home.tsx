import React, { useEffect, useState } from "react";
import Navbar from "../../components/Home/navbar";
import Footer from "../../components/Home/footer";
import "./home.css";
import axios from "axios";
import MovieDetailsModal from "../../components/Movies/movieDetailsModal";
type Movie = {
  id: number;
  name: string;
  poster: string;
};

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/movies")
      .then((res) => {
        setMovies(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main
        className="home-container"
        style={{
          maxWidth: "80%",
          margin: "0 auto",
          width: "100%",
          minHeight: "100vh",
        }}
      >
        <div className="home-search">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar filmes..."
          />
        </div>
        {loading ? (
          <div className="home-loading">Carregando...</div>
        ) : (
          <div className="home-movie-list">
            {filteredMovies.length === 0 && (
              <div className="home-empty">Nenhum filme encontrado.</div>
            )}
            {filteredMovies.map((movie) => (
              <div
                className="home-movie-card"
                key={movie.id}
                onClick={() => setSelectedMovieId(movie.id)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={movie.poster}
                  alt={movie.name}
                  className="home-movie-poster"
                />
                <div className="home-movie-info">
                  <strong>{movie.name}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedMovieId && (
          <MovieDetailsModal
            movieId={selectedMovieId}
            onClose={() => setSelectedMovieId(null)}
          />
        )}
      </main>
      <Footer />
    </>
  );
}