import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { StoreProvider } from "./context/StoreContext";
import { Perfil } from "./pages/Perfil";
import {
  Carrito,
  Catalogo,
  Detalle,
  DetalleAntiguo,
  Inicio,
} from "./pages/store";
import {
  Gestion,
  RutaUsuario,
  RutaPersonal,
} from "./pages/ManagementPages";
import { Login } from "./pages/LoginPage";
import { Registro } from "./pages/RegistroPage";

function Aplicacion() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Header />
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/detalle/:id" element={<Detalle />} />
            <Route
              path="/carrito"
              element={
                <RutaUsuario>
                  <Carrito />
                </RutaUsuario>
              }
            />
            <Route
              path="/gestion"
              element={
                <RutaPersonal>
                  <Gestion />
                </RutaPersonal>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route
             path="/perfil"
             element={<Perfil />}
            />
            <Route
              path="/html/index.html"
              element={<Navigate to="/" replace />}
            />
            <Route
              path="/html/catalogo.html"
              element={<Navigate to="/catalogo" replace />}
            />
            <Route
              path="/html/carrito.html"
              element={<Navigate to="/carrito" replace />}
            />
            <Route
              path="/html/login.html"
              element={<Navigate to="/login" replace />}
            />
            <Route
              path="/html/registro.html"
              element={<Navigate to="/registro" replace />}
            />
            <Route path="/html/detalle.html" element={<DetalleAntiguo />} />
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default Aplicacion;
