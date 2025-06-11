import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

type Movie = {
  id: number;
  name: string;
  director: string;
  year: number;
  duration: number;
  producer: string;
  classification: string;
  poster: string;
};

type Review = {
  id: number;
  comment: string;
  rating: number;
  user: { nickname: string };
  createdAt: string;
};

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get!(`/movies/${id}`).then(res => setMovie(res.data));
    api.get!(`/reviews/movie/${id}`).then(res => setReviews(res.data));
  }, [id]);

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/reviews",
        { comment, rating, movieId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment("");
      setRating(5);
      const res = await api.get!(`/reviews/movie/${id}`);
      setReviews(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao enviar avaliação");
    }
  };

  if (!movie) return <div>Carregando...</div>;

  return (
    <div>
      <img src={movie.poster} alt={movie.name} width={200} />
      <h2>{movie.name}</h2>
      <p><strong>Diretor:</strong> {movie.director}</p>
      <p><strong>Ano:</strong> {movie.year}</p>
      <p><strong>Duração:</strong> {movie.duration} min</p>
      <p><strong>Produtor:</strong> {movie.producer}</p>
      <p><strong>Classificação:</strong> {movie.classification}</p>

      <h3>Avaliações</h3>
      {reviews.length === 0 && <p>Seja o primeiro a avaliar!</p>}
      <ul>
        {reviews.map((r) => (
          <li key={r.id}>
            <strong>{r.user.nickname}</strong> ({r.rating}/5): {r.comment}
          </li>
        ))}
      </ul>

      <form onSubmit={handleReview}>
        <h4>Deixe sua avaliação</h4>
        <label>
          Nota:
          <select value={rating} onChange={e => setRating(Number(e.target.value))}>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <br />
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Seu comentário"
          required
        />
        <br />
        <button type="submit">Enviar Avaliação</button>
        {error && <div style={{color: "red"}}>{error}</div>}
      </form>
    </div>
  );
}