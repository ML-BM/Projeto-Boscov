import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import LoginForm from "../../components/Auth/loginForm";
import "../../components/Auth/formAuth.css";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [evt.target.name]: evt.target.value });
  };

  const handleOnSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setMsg("");
    setError("");
    try {
      const response = await api.post("/users/login", form);
      console.log(response.data.user); // <-- Adicione aqui!
      localStorage.setItem("token", response.data.token);
      if (response.data.user?.user_type) {
        localStorage.setItem("role", response.data.user.user_type);
      }
      if (response.data.user?.name) {
        localStorage.setItem("name", response.data.user.name);
      }
      setMsg("Login realizado com sucesso!");
      navigate("/home");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao fazer login");
    }
  };

  return (
    <div className="form-container sign-in-container">
      <LoginForm
        email={form.email}
        password={form.password}
        onChange={handleChange}
        onSubmit={handleOnSubmit}
        error={error}
        msg={msg}
      />
      <span style={{ display: "block", textAlign: "center", marginTop: "1rem" }}>
        Não tem conta? <Link to="/register">Cadastre-se</Link>
      </span>
    </div>
  );
}