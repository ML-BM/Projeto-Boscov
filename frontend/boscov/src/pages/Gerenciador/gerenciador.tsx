import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Home/navbar";
import Footer from "../../components/Home/footer";
import MovieFormAddModal from "../../components/Movies/movieFormAddModal";
import "../../components/Auth/formAuth.css";

type Genre = {
  id: number;
  description: string;
};

type Movie = {
  id: number;
  name: string;
  director: string;
  year: number;
  duration: number;
  producer: string;
  classification: string;
  poster: string;
  genreid?: { genre?: { id: number; description: string } }[];
};

export default function Gerenciador() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // Buscar filmes e gêneros
  const fetchMovies = () => {
    axios.get("http://localhost:3000/movies").then(res => setMovies(res.data));
  };

  useEffect(() => {
    fetchMovies();
    axios.get("http://localhost:3000/genres").then(res => setGenres(res.data));
  }, []);

  // Ao clicar em um filme, seleciona para mostrar opções
  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  // Excluir filme
  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este filme?")) return;
    try {
      await axios.delete(`http://localhost:3000/movies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedMovie(null);
      fetchMovies();
    } catch (err: any) {
      setError("Erro ao excluir filme: " + (err.response?.data?.error || ""));
    }
  };

  // Adicionar novo filme
  const handleAdd = () => {
    setSelectedMovie(null);
    setShowModal(true);
  };

  // Editar filme
  const handleEdit = () => {
    setShowModal(true);
  };

  // Fechar opções/modal
  const handleClose = () => {
    setShowModal(false);
    setSelectedMovie(null);
    setError("");
  };

  // Sucesso ao salvar
  const handleFormSuccess = () => {
    setShowModal(false);
    setSelectedMovie(null);
    setError("");
    fetchMovies();
  };

  const buttonStyle = {
    background: "#FF0000",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    fontWeight: "bold",
    fontSize: "1rem",
    padding: "8px 20px",
    cursor: "pointer",
    transition: "background 0.2s",
    marginRight: 8,
  };

  const buttonStyleSecondary = {
    ...buttonStyle,
    background: "#6c757d", // cinza para "Fechar", se quiser diferenciar
  };

  const buttonStyleDelete = {
    ...buttonStyle,
    background: "#c40000", // vermelho mais escuro para "Excluir"
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", maxWidth: "80%", margin: "0 auto", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
          <button
            onClick={handleAdd}
            style={buttonStyle}
            onMouseOver={e => (e.currentTarget.style.background = "#c40000")}
            onMouseOut={e => (e.currentTarget.style.background = "#FF0000")}
          >
            Adicionar Novo Filme
          </button>
        </div>
        <div className="home-movie-list" style={{ marginTop: "2rem" }}>
          {movies.map((movie) => (
            <div
              className="home-movie-card"
              key={movie.id}
              style={{
                border: selectedMovie?.id === movie.id ? "2px solid #ff0000" : undefined,
                cursor: "pointer"
              }}
              onClick={() => handleMovieClick(movie)}
            >
              <img
                src={movie.poster}
                alt={movie.name}
                className="home-movie-poster"
              />
              <div className="home-movie-info">
                <strong>{movie.name}</strong>
                <p>
                  Diretor: {movie.director}<br />
                  Ano: {movie.year}<br />
                  Duração: {movie.duration} min<br />
                  Classificação: {movie.classification}<br />
                  Gêneros: {(movie.genreid ?? [])
                    .map(g => g.genre?.description)
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Opções ao clicar em um filme */}
        {selectedMovie && (
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <button
              onClick={handleEdit}
              style={buttonStyle}
              onMouseOver={e => (e.currentTarget.style.background = "#c40000")}
              onMouseOut={e => (e.currentTarget.style.background = "#FF0000")}
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(selectedMovie.id)}
              style={buttonStyleDelete}
              onMouseOver={e => (e.currentTarget.style.background = "#a30000")}
              onMouseOut={e => (e.currentTarget.style.background = "#c40000")}
            >
              Excluir
            </button>
            <button
              onClick={handleClose}
              style={buttonStyleSecondary}
              onMouseOver={e => (e.currentTarget.style.background = "#495057")}
              onMouseOut={e => (e.currentTarget.style.background = "#6c757d")}
            >
              Fechar
            </button>
          </div>
        )}
        {/* Modal para adicionar/editar */}
        <MovieFormAddModal
          show={showModal}
          onClose={handleClose}
          onSuccess={handleFormSuccess}
          genres={genres}
          movie={selectedMovie ?? undefined}
        />
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      </main>
      <Footer />
    </>
  );
}