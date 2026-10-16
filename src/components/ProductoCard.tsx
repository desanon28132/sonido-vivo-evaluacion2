import { useState } from "react";
import type { Producto } from "../types/Producto";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { formatearPrecio } from "../utils/formatoPrecio";
import accesoriosInstrumentos from "../assets/img/accesorioInstrumento.png";
import amplificador from "../assets/img/amplificador.png";
import auricular from "../assets/img/auricularEstudio.png";
import bajo from "../assets/img/bajoElectrico.png";
import bateria from "../assets/img/bateria.png";
import guitarraAcustica from "../assets/img/guitarraAcustica.png";
import guitarraElectrica from "../assets/img/guitarraElectrica.png";
import microfonos from "../assets/img/microfonos.png";
import pedalEfecto from "../assets/img/pedalEfecto.png";
import teclado from "../assets/img/teclado.png";

const imagenesPorCategoria: Record<string, string> = {
  "Guitarras Acústicas": guitarraAcustica,
  "Guitarras Eléctricas": guitarraElectrica,
  "Bajos Eléctricos": bajo,
  Baterías: bateria,
  "Teclados y Pianos": teclado,
  Amplificadores: amplificador,
  Micrófonos: microfonos,
  "Pedales de Efectos": pedalEfecto,
  Accesorios: accesoriosInstrumentos,
  "Estudio y Grabación": auricular,
};

export function obtenerImagenProducto(categoria: string): string {
  return imagenesPorCategoria[categoria] ?? accesoriosInstrumentos;
}

export const ProductoCard = ({ producto }: { producto: Producto }) => {
  const { agregarAlCarrito, usuarioActual } = useStore();
  const [mensaje, setMensaje] = useState("");

  const agregar = () => {
    setMensaje(
      agregarAlCarrito(producto.id)
        ? "Producto agregado al carrito."
        : "No hay stock suficiente.",
    );
  };

  return (
    <div className="col-md-6 col-lg-4">
      <article className="card producto-card h-100 border-0 shadow-sm">
        <img
          className="card-img-top producto-img"
          src={obtenerImagenProducto(producto.categoria)}
          alt={producto.nombre}
        />
        <div className="card-body p-4 d-flex flex-column">
          <span className="badge text-bg-secondary mb-2 align-self-start">
            {producto.categoria}
          </span>
          <h2 className="h5 fw-bold">{producto.nombre}</h2>
          <p className="text-secondary mb-1">
            {producto.marca} · {producto.modelo}
          </p>
          <p className="fs-5 fw-bold text-primary mb-1">
            {formatearPrecio(producto.precio)}
          </p>
          <p className="text-secondary">
            Stock disponible: {producto.stock}
          </p>
          <Link
            className="btn btn-outline-secondary mt-auto mb-2"
            to={`/detalle/${producto.id}`}
          >
            Ver detalle
          </Link>
         {usuarioActual ? (
  <button
    className="btn btn-primary"
    type="button"
    disabled={producto.stock <= 0}
    onClick={agregar}
  >
    {producto.stock <= 0
      ? "Sin stock"
      : "Agregar al carrito"}
  </button>
) : (
  <Link
    className="btn btn-primary"
    to="/login"
  >
    Inicia sesión para comprar
  </Link>
)}
{mensaje && usuarioActual && (
  <p
    className="small mt-2 mb-0"
    role="status"
  >
    {mensaje}
  </p>
)}
        </div>
      </article>
    </div>
  );
};
