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
      <div className="modal-content">
        <button onClick={onClose} className="modal-close">X</button>
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
  );
}