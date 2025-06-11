import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/login";
import Register from "./pages/Register/register";
import Home from "./pages/Home/home";
import Gerenciador from "./pages/Gerenciador/gerenciador";
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
        <Route path="/register" element={<Register/>} />
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