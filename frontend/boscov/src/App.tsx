import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/login";
import RegisterForm from "./components/Auth/registerForm";
import Home from "./pages/Home/home";
import Gerenciador from "./pages/Gerenciador/gerenciador";
import Profile from "./pages/Profile/profile";
import RequireAuth from "./components/Auth/requireAuth";
import MovieDetails from "./pages/Movies/movieDetails";

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const role = localStorage.getItem("role");
  if (role !== "ADMIN") {
    return <Navigate to="/home" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/gerenciador"
          element={
            <RequireAuth>
              <RequireAdmin>
                <Gerenciador />
              </RequireAdmin>
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/movies/:id"
          element={
            <RequireAuth>
              <MovieDetails />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;