import { useState } from 'react';
import { Link } from "react-router-dom";
import type { ChangeEvent, FormEvent } from 'react';
import api from '../../services/api';
import './formAuth.css';

type FormState = {
  name: string;
  nickname: string;
  email: string;
  password: string;
  date_birth: string;
  user_type: "COMMON";
};

type ValidationError = {
  field: string;
  message: string;
};

export default function RegisterForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    nickname: '',
    email: '',
    password: '',
    date_birth: '',
    user_type: 'COMMON'
  });
  const [msg, setMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value, user_type: "COMMON" });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMsg('');
    setValidationErrors([]);
    try {
      await api.post('/users/register', { ...form, user_type: "COMMON" });
      setMsg('Usuário cadastrado com sucesso!');
      setForm({
        name: '',
        nickname: '',
        email: '',
        password: '',
        date_birth: '',
        user_type: 'COMMON'
      });
    } catch (err: any) {
      if (err.response?.data?.validationErrors) {
        setValidationErrors(err.response.data.validationErrors);
      } else if (err.response?.data?.error) {
        setMsg(err.response.data.error);
      } else if (err.message) {
        setMsg(err.message);
      } else {
        setMsg('Erro ao cadastrar usuário');
      }
    }
  };

  return (
    <div className="form-auth-outer">
      <form className="form-auth-container" onSubmit={handleSubmit}>
        <h2>Cadastro</h2>
        <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} />
        <input name="nickname" placeholder="Usuário" value={form.nickname} onChange={handleChange} />
        <input name="email" type="email" placeholder="E-mail" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Senha" value={form.password} onChange={handleChange} />
        <input name="date_birth" type="date" placeholder="Data de nascimento" value={form.date_birth} onChange={handleChange} />
        {}
        <button type="submit">Cadastrar</button>
        {msg && <p>{msg}</p>}
        {validationErrors.length > 0 && (
          <ul>
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err.message}</li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          Já sou cadastrado? <Link to="/login">Fazer login</Link>
        </div>
      </form>
    </div>
  );
}