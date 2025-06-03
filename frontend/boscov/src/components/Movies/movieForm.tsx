import React, { useState, useEffect } from "react";
import axios from "axios";

type Genre = {
  id: number;
  description: string;
};

type Movie = {
  id?: number;
  name: string;
  director: string;
  year: number;
  duration: number;
  producer: string;
  classification: string;
  poster: string;
  genreid?: { genre?: { id?: number } }[];
};

type Props = {
  genres: Genre[];
  movie?: Movie;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function MovieForm({ genres, movie, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState({
    name: "",
    director: "",
    year: "",
    duration: "",
    producer: "",
    classification: "",
    poster: "",
    genreIds: [] as number[],
  });
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (movie) {
      setForm({
        name: movie.name,
        director: movie.director,
        year: String(movie.year),
        duration: String(movie.duration),
        producer: movie.producer,
        classification: movie.classification,
        poster: movie.poster,
        genreIds: (movie.genreid ?? []).map(g => g.genre?.id).filter(Boolean) as number[],
      });
    } else {
      setForm({
        name: "",
        director: "",
        year: "",
        duration: "",
        producer: "",
        classification: "",
        poster: "",
        genreIds: [],
      });
    }
  }, [movie]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleGenreChange = (id: number) => {
    setForm((prev) => ({
      ...prev,
      genreIds: prev.genreIds.includes(id)
        ? prev.genreIds.filter((g) => g !== id)
        : [...prev.genreIds, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (movie && movie.id) {
        await axios.put(
          `http://localhost:3000/movies/${movie.id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:3000/movies",
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      onSuccess();
    } catch (err: any) {
      setError("Erro ao salvar filme: " + (err.response?.data?.error || ""));
    }
  };

  return (
    <form className="form-auth-container" onSubmit={handleSubmit} style={{ marginTop: 24 }}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Nome" required />
      <input name="director" value={form.director} onChange={handleChange} placeholder="Diretor" required />
      <input name="year" type="number" value={form.year} onChange={handleChange} placeholder="Ano" required />
      <input name="duration" type="number" value={form.duration} onChange={handleChange} placeholder="Duração (min)" required />
      <input name="producer" value={form.producer} onChange={handleChange} placeholder="Produtor" required />
      <input name="classification" value={form.classification} onChange={handleChange} placeholder="Classificação" required />
      <input name="poster" value={form.poster} onChange={handleChange} placeholder="Poster (URL)" required />
      <div>
        <label>Gêneros:</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {genres.map((genre) => (
            <label key={genre.id}>
              <input
                type="checkbox"
                checked={form.genreIds.includes(genre.id)}
                onChange={() => handleGenreChange(genre.id)}
              />
              {genre.description}
            </label>
          ))}
        </div>
      </div>
      <button type="submit">{movie ? "Salvar Alterações" : "Adicionar Filme"}</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancelar</button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </form>
  );
}