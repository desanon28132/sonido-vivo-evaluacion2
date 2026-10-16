import { useState, type FormEvent } from "react";
import { Mensaje } from "../components/PageHelpers";
import { useStore, type Usuario } from "../context/StoreContext";
import { formatearPrecio } from "../utils/formatoPrecio";

const regiones = [
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Biobío",
  "La Araucanía",
  "Los Lagos",
];
export function VendedorPage() {
const {
  productos,
  actualizarStock,
  usuarios,
  usuarioActual,
  guardarUsuarios,
} = useStore();
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"danger" | "success">(
    "success",
  );
  const terminoBusqueda = busqueda.trim().toLocaleLowerCase("es-CL");
  const productosFiltrados = productos.filter((producto) =>
    [
      producto.id,
      producto.nombre,
      producto.categoria,
      producto.marca,
      producto.modelo,
      producto.descripcion,
    ].some((dato) => dato.toLocaleLowerCase("es-CL").includes(terminoBusqueda)),
  );

  const guardarStock = (
    evento: FormEvent<HTMLFormElement>,
    idProducto: string,
  ) => {
    evento.preventDefault();
    const formulario = new FormData(evento.currentTarget);
    const stock = Number(formulario.get("stock"));
    const guardado = actualizarStock(idProducto, stock);
    setMensaje(
      guardado
        ? "Stock actualizado correctamente."
        : "No se pudo actualizar el stock. Ingresa un número entero igual o mayor a cero.",
    );
    setTipoMensaje(guardado ? "success" : "danger");
  };
  const crearCliente = (
  evento: FormEvent<HTMLFormElement>,
) => {
  evento.preventDefault();

  if (usuarioActual?.rol !== "vendedor") {
    setTipoMensaje("danger");
    setMensaje(
      "Solo un vendedor puede crear clientes desde esta sección.",
    );
    return;
  }

  const formulario = new FormData(
    evento.currentTarget,
  );

  const leer = (campo: string) =>
    String(
      formulario.get(campo) ?? "",
    ).trim();

  const nombre = leer("nombre");
  const apellido = leer("apellido");
  const fechaNacimiento =
    leer("fechaNacimiento");

  const correo = leer("correo")
    .toLowerCase();

  const password =
    String(
      formulario.get("password") ?? "",
    );

  const confirmarPassword =
    String(
      formulario.get(
        "confirmarPassword",
      ) ?? "",
    );

  const direccion = leer("direccion");
  const region = leer("region");
  const genero = leer("genero");

  const nacimiento = new Date(
    `${fechaNacimiento}T00:00:00`,
  );

  const hoy = new Date();

  let edad =
    hoy.getFullYear() -
    nacimiento.getFullYear();

  if (
    hoy.getMonth() <
      nacimiento.getMonth() ||
    (
      hoy.getMonth() ===
        nacimiento.getMonth() &&
      hoy.getDate() <
        nacimiento.getDate()
    )
  ) {
    edad -= 1;
  }

  if (
    !nombre ||
    !apellido ||
    !fechaNacimiento ||
    !correo ||
    !direccion ||
    !region ||
    !genero
  ) {
    setTipoMensaje("danger");
    setMensaje(
      "Completa todos los campos del cliente.",
    );
    return;
  }

  if (!correo.includes("@")) {
    setTipoMensaje("danger");
    setMensaje(
      "El correo debe tener un formato válido.",
    );
    return;
  }

  if (nacimiento > hoy) {
    setTipoMensaje("danger");
    setMensaje(
      "La fecha de nacimiento no puede ser posterior a hoy.",
    );
    return;
  }

  if (edad < 14) {
    setTipoMensaje("danger");
    setMensaje(
      "El cliente debe tener al menos 14 años.",
    );
    return;
  }

  const correoExiste = usuarios.some(
    (usuario) =>
      usuario.correo.toLowerCase() ===
      correo,
  );

  if (correoExiste) {
    setTipoMensaje("danger");
    setMensaje(
      "Ya existe una cuenta con ese correo.",
    );
    return;
  }

  if (password.length < 8) {
    setTipoMensaje("danger");
    setMensaje(
      "La contraseña debe tener mínimo 8 caracteres.",
    );
    return;
  }

  if (
    password !== confirmarPassword
  ) {
    setTipoMensaje("danger");
    setMensaje(
      "Las contraseñas no coinciden.",
    );
    return;
  }

  const nuevoCliente: Usuario = {
    id: crypto.randomUUID(),
    nombre,
    apellido,
    fechaNacimiento,
    correo,
    password,
    direccion,
    region,
    genero,
    intentosFallidos: 0,
    bloqueado: false,

    // IMPORTANTE:
    rol: "cliente",
  };

  guardarUsuarios([
    ...usuarios,
    nuevoCliente,
  ]);

  evento.currentTarget.reset();

  setTipoMensaje("success");
  setMensaje(
    "Cliente creado correctamente.",
  );
};


  return (
    <main className="container py-5">
      <section className="mb-4">
        <span className="badge text-bg-primary mb-3">Vendedor</span>
        <h1 className="display-6 fw-bold">Gestión de la tienda</h1>
        <p className="text-secondary">
          Actualiza únicamente las existencias de los productos.
        </p>
      </section>
      <Mensaje texto={mensaje} tipo={tipoMensaje} />
      <section className="card shadow-sm border-0 mb-4">
  <div className="card-body p-4">
    <h2 className="h4 fw-bold mb-3">
      Crear cliente
    </h2>

    <p className="text-secondary">
      El vendedor puede crear únicamente
      cuentas con rol Cliente.
    </p>

    <form onSubmit={crearCliente}>
      <div className="row g-3">

        <div className="col-md-6">
          <label
            className="form-label"
            htmlFor="cliente-nombre"
          >
            Nombre
          </label>

          <input
            className="form-control"
            id="cliente-nombre"
            name="nombre"
            type="text"
            required
          />
        </div>

        <div className="col-md-6">
          <label
            className="form-label"
            htmlFor="cliente-apellido"
          >
            Apellido
          </label>

          <input
            className="form-control"
            id="cliente-apellido"
            name="apellido"
            type="text"
            required
          />
        </div>

        <div className="col-md-6">
          <label
            className="form-label"
            htmlFor="cliente-fecha"
          >
            Fecha de nacimiento
          </label>

          <input
            className="form-control"
            id="cliente-fecha"
            name="fechaNacimiento"
            type="date"
            max={new Date()
              .toISOString()
              .slice(0, 10)}
            required
          />
        </div>

        <div className="col-md-6">
          <label
            className="form-label"
            htmlFor="cliente-correo"
          >
            Correo electrónico
          </label>

          <input
            className="form-control"
            id="cliente-correo"
            name="correo"
            type="email"
            required
          />
        </div>

        <div className="col-md-6">
          <label
            className="form-label"
            htmlFor="cliente-password"
          >
            Contraseña
          </label>

          <input
            className="form-control"
            id="cliente-password"
            name="password"
            type="password"
            required
          />
        </div>

        <div className="col-md-6">
          <label
            className="form-label"
            htmlFor="cliente-confirmar"
          >
            Confirmar contraseña
          </label>

          <input
            className="form-control"
            id="cliente-confirmar"
            name="confirmarPassword"
            type="password"
            required
          />
        </div>

        <div className="col-md-6">
          <label
            className="form-label"
            htmlFor="cliente-direccion"
          >
            Dirección
          </label>

          <input
            className="form-control"
            id="cliente-direccion"
            name="direccion"
            type="text"
            required
          />
        </div>

        <div className="col-md-6">
          <label
            className="form-label"
            htmlFor="cliente-region"
          >
            Región
          </label>

          <select
            className="form-select"
            id="cliente-region"
            name="region"
            defaultValue=""
            required
          >
            <option
              value=""
              disabled
            >
              Seleccione una región
            </option>

            {regiones.map((region) => (
              <option
                key={region}
                value={region}
              >
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label
            className="form-label"
            htmlFor="cliente-genero"
          >
            Género
          </label>

          <select
            className="form-select"
            id="cliente-genero"
            name="genero"
            defaultValue=""
            required
          >
            <option
              value=""
              disabled
            >
              Seleccione una opción
            </option>

            {[
              "Masculino",
              "Femenino",
              "Otro",
              "Prefiero no indicar",
            ].map((opcion) => (
              <option
                key={opcion}
                value={opcion}
              >
                {opcion}
              </option>
            ))}
          </select>
        </div>

      </div>

      <button
        className="btn btn-success mt-4"
        type="submit"
      >
        Crear cliente
      </button>
    </form>
  </div>
</section>

      <section className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="h4 fw-bold mb-3">Productos y existencias</h2>
          <label className="form-label" htmlFor="buscar-productos-vendedor">
            Buscar producto
          </label>
          <input
            className="form-control mb-3"
            id="buscar-productos-vendedor"
            type="search"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            placeholder="Busca por nombre, código, categoría, marca o modelo"
          />
          <p className="small text-secondary" aria-live="polite">
            {productosFiltrados.length} de {productos.length} productos
          </p>
          <div className="list-group">
            {productosFiltrados.map((producto) => (
              <details className="list-group-item" key={producto.id}>
                <summary className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <span>
                    <span className="fw-semibold">{producto.nombre}</span>
                    <span className="d-block small text-secondary">
                      {producto.id} · {producto.categoria}
                    </span>
                  </span>
                  <span className="badge text-bg-light">
                    Stock: {producto.stock}
                  </span>
                </summary>
                <div className="border-top mt-3 pt-3">
                  <div className="small mb-3">
                    <p className="mb-1">
                      <strong>Marca:</strong> {producto.marca}
                    </p>
                    <p className="mb-1">
                      <strong>Modelo:</strong> {producto.modelo}
                    </p>
                    <p className="mb-1">
                      <strong>Precio:</strong>{" "}
                      {formatearPrecio(producto.precio)}
                    </p>
                    <p className="mb-0">
                      <strong>Descripción:</strong> {producto.descripcion}
                    </p>
                  </div>
                  <form
                    id={`stock-${producto.id}`}
                    className="row g-2 align-items-end"
                    onSubmit={(evento) => guardarStock(evento, producto.id)}
                  >
                    <div className="col-sm-6 col-md-4">
                      <label
                        className="form-label mb-1"
                        htmlFor={`nuevo-stock-${producto.id}`}
                      >
                        Nuevo stock
                      </label>
                      <input
                        className="form-control"
                        id={`nuevo-stock-${producto.id}`}
                        name="stock"
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={producto.stock}
                        required
                      />
                    </div>
                    <div className="col-auto">
                      <button
                        className="btn btn-outline-primary"
                        type="submit"
                      >
                        Guardar stock
                      </button>
                    </div>
                  </form>
                </div>
              </details>
            ))}
            {productosFiltrados.length === 0 && (
              <p className="text-center text-secondary py-4 mb-0">
                No se encontraron productos que coincidan con la búsqueda.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
