import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Home/navbar";

type UserProfile = {
  id: number;
  name: string;
  nickname: string;
  email: string;
  user_type: string;
};

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Usuário não autenticado.");
          return;
        }
        if (typeof api.get !== "function") {
          setError("Serviço de API não está disponível.");
          return;
        }
        const response = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Erro ao carregar perfil");
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (error) return <div>{error}</div>;
  if (!profile) return <div>Carregando perfil...</div>;

  return (
    <div>
      <Navbar />
      <h2>Perfil do Usuário</h2>
      <p>
        <strong>Nome:</strong> {profile.name}
      </p>
      <p>
        <strong>Usuário:</strong> {profile.nickname}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>Tipo:</strong> {profile.user_type}
      </p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}
