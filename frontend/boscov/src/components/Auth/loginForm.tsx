import React from "react";

type LoginFormProps = {
  email: string;
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  error?: string;
  msg?: string;
};

export default function LoginForm({
  email,
  password,
  onChange,
  onSubmit,
  error,
  msg,
}: LoginFormProps) {
  return (
    <form className="form-auth-container" onSubmit={onSubmit}>
      <h1>Login</h1>
      <span>Use seu e-mail e senha</span>
      <input
        type="email"
        name="email"
        value={email}
        onChange={onChange}
        placeholder="E-mail"
        autoComplete="username"
        required
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={onChange}
        placeholder="Senha"
        autoComplete="current-password"
        required
      />
      <button type="submit">Entrar</button>
      {msg && <div className="success-msg">{msg}</div>}
      {error && <div className="error-list">{error}</div>}
    </form>
  );
}