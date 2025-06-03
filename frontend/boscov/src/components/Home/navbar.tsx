import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4" style={{ width: "100vw", left: 0, right: 0 }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">
          MeuCatálogo
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/home">
                Home
              </Link>
            </li>
            {role === "ADMIN" && (
              <li className="nav-item">
                <Link className="nav-link" to="/gerenciador">
                  Gerenciar Filmes
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/profile">
                Perfil
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}