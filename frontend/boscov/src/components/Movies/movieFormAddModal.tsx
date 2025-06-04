import React from "react";
import MovieForm from "./movieForm";
import "./modal.css";

type Genre = { id: number; description: string };
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
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  genres: Genre[];
  movie?: Movie;
};

export default function MovieFormAddModal({ show, onClose, onSuccess, genres, movie }: Props) {
  if (!show) return null;

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
        <button
          onClick={onClose}
          className="modal-close"
          style={{
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
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          ×
        </button>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            minHeight: 300,
          }}
        >
          <div style={{ flex: 1, minWidth: 220 }}>
            <MovieForm
              genres={genres}
              movie={movie}
              onSuccess={() => {
                onSuccess();
                onClose();
              }}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}