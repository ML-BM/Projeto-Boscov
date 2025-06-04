import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Pegue o nome real do usuário do localStorage
  const user = {
    name: localStorage.getItem("name") || "Usuário",
    nickname: localStorage.getItem("nickname") || "",
    email: localStorage.getItem("email") || "",
    user_type: role || "",
  };

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-md navbar-dark"
      style={{
        background: "#000",
        width: "100%",
        left: 0,
        right: 0,
        padding: 0,
        minHeight: 56,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <div className="container-fluid" style={{ alignItems: "center", display: "flex" }}>
        {/* Logo */}
        <span
          style={{
            color: "#DC3545",
            fontWeight: "bold",
            fontSize: "1.5rem",
            letterSpacing: 1,
            userSelect: "none",
          }}
        >
          BOSCOV
        </span>
        {/* Centraliza os links */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <ul className="navbar-nav flex-row gap-3" style={{ alignItems: "center", margin: 0 }}>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/home" style={{ fontSize: "1.1rem" }}>
                Home
              </Link>
            </li>
            {role === "ADMIN" && (
              <li className="nav-item">
                <Link className="nav-link" to="/gerenciador" style={{ fontSize: "1.1rem" }}>
                  Gerenciar Filmes
                </Link>
              </li>
            )}
          </ul>
        </div>
        {/* Avatar e Dropdown */}
        <div
          className="d-flex align-items-center"
          ref={dropdownRef}
          style={{ position: "relative", marginLeft: 16 }}
        >
          <button
            className="btn btn-link nav-link p-0"
            style={{
              color: "#fff",
              textDecoration: "none",
              border: "none",
              background: "none",
              outline: "none",
              boxShadow: "none",
              padding: 0,
            }}
            onClick={() => setShowDropdown((v) => !v)}
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=343a40&color=fff&rounded=true&size=40`}
              alt="avatar"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                objectFit: "cover",
                border: (showDropdown || avatarHover) ? "2px solid #DC3545" : "2px solid transparent",
                transition: "border 0.2s",
                cursor: "pointer",
              }}
            />
          </button>
          {showDropdown && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "110%",
                background: "#fff",
                color: "#23252b",
                borderRadius: 8,
                boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                minWidth: 200,
                padding: 16,
                zIndex: 1001,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                animation: "fadeIn 0.2s",
              }}
            >
              <div><strong>{user.name}</strong></div>
              <div>{user.nickname}</div>
              <div>{user.email}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{user.user_type}</div>
              <button
                className="btn btn-danger btn-sm mt-2"
                style={{ marginTop: 8 }}
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
      {/* FadeIn animation inline */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </nav>
  );
}