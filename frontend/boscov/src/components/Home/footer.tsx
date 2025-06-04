import React from "react";

export default function Footer() {
  return (
    <footer className="py-3 mt-5" style={{ background: "#000" }}>
      <div className="container text-center text-light">
        <span>© {new Date().getFullYear()} BOSCOV. Todos os direitos reservados.</span>
      </div>
    </footer>
  );
}