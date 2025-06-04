import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../components/Movies/modal.css";

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

export default function MovieDetailsModal({
  movieId,
  onClose,
}: {
  movieId: number;
  onClose: () => void;
}) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/movies/${movieId}`).then(res => setMovie(res.data));
    api.get(`/reviews/movie/${movieId}`).then(res => setReviews(res.data));
  }, [movieId]);

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/reviews",
        { comment, rating, movieId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment("");
      setRating(5);
      const res = await api.get(`/reviews/movie/${movieId}`);
      setReviews(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao enviar avaliação");
    }
  };

  function renderStars(rating: number) {
    return (
      <span style={{ color: "#FFD700", fontSize: "1.2em" }}>
        {[1,2,3,4,5].map(i =>
          <span key={i}>{i <= rating ? "★" : "☆"}</span>
        )}
      </span>
    );
  }

  if (!movie) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{
          maxWidth: "80%",
          width: "100%",
          padding: "32px",
          borderRadius: 12,
          boxSizing: "border-box",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <button onClick={onClose} className="modal-close" style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "#FF0000",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          fontWeight: "bold",
          fontSize: 22,
          padding: "4px 14px",
          cursor: "pointer"
        }}>×</button>
        <div style={{
          display: "flex",
          gap: 32,
          alignItems: "flex-start",
          flexWrap: "wrap",
          marginBottom: 32,
        }}>
          <img
            src={movie.poster}
            alt={movie.name}
            style={{
              width: 200,
              height: 300,
              objectFit: "cover",
              borderRadius: 8,
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              background: "#eee",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 220 }}>
            <h2 style={{ marginBottom: 8 }}>{movie.name}</h2>
            <div><b>Diretor:</b> {movie.director}</div>
            <div><b>Ano:</b> {movie.year}</div>
            <div><b>Duração:</b> {movie.duration} min</div>
            <div><b>Produtor:</b> {movie.producer}</div>
            <div><b>Classificação:</b> {movie.classification}</div>
            {/* Adicione outros campos se quiser */}
          </div>
        </div>
        <hr style={{ margin: "24px 0" }} />
        <div>
          <h3 style={{ marginBottom: 12 }}>Avaliações</h3>
          {reviews.length === 0 && <p>Seja o primeiro a avaliar!</p>}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {reviews.map((r) => (
              <li key={r.id} style={{
                background: "#f8f9fa",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}>
                <strong>{r.user.nickname}</strong> {renderStars(r.rating)}
                <div style={{ marginTop: 4 }}>{r.comment}</div>
              </li>
            ))}
          </ul>
          <form onSubmit={handleReview}>
            <h4>Deixe sua avaliação</h4>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: "bold" }}>Nota:&nbsp;</span>
              {[1,2,3,4,5].map(n => (
                <span
                  key={n}
                  style={{
                    cursor: "pointer",
                    color: n <= rating ? "#FFD700" : "#ccc",
                    fontSize: "1.5em",
                    transition: "color 0.2s"
                  }}
                  onClick={() => setRating(n)}
                  aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
                >
                  ★
                </span>
              ))}
            </div>
            <br />
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Seu comentário"
              required
              style={{ width: "100%", minHeight: 60, marginTop: 8, borderRadius: 4, border: "1px solid #ccc", padding: 8 }}
            />
            <br />
            <button type="submit" style={{
              background: "#FF0000",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontWeight: "bold",
              fontSize: "1rem",
              padding: "8px 20px",
              cursor: "pointer",
              marginTop: 8,
            }}>Enviar Avaliação</button>
            {error && <div style={{color: "red"}}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}