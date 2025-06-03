import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-3 mt-5">
      <div className="container text-center">
        <span>© {new Date().getFullYear()} MeuCatálogo. Todos os direitos reservados.</span>
      </div>
    </footer>
  );
}