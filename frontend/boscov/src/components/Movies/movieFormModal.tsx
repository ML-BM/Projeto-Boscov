import React, { useState, useEffect } from "react";
import axios from "axios";

type Genre = { id: number; description: string; };
type Movie = {
  id?: number;
  name: string;
  director: string;
  year: string;
  duration: string;
  producer: string;
  classification: string;
  poster: string;
  genreIds: number[];
};

export default function MovieFormModal({
  show,
  onClose,
  onSuccess,
  genres,
  token
}: {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  genres: Genre[];
  token: string | null;
}) {
  const [form, setForm] = useState<Movie>({
    name: "",
    director: "",
    year: "",
    duration: "",
    producer: "",
    classification: "",
    poster: "",
    genreIds: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
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
      setError("");
    }
  }, [show]);

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
      await axios.post(
        "http://localhost:3000/movies",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      setError("Erro ao salvar filme: " + (err.response?.data?.error || ""));
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close">X</button>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Adicionar Filme</button>
          <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Cancelar</button>
          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </form>
      </div>
    </div>
  );
}