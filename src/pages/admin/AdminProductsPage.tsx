import { useState, type FormEvent } from "react";
import { Mensaje } from "../../components/PageHelpers";
import { useStore } from "../../context/StoreContext";
import type { Producto } from "../../types/Producto";

export function AdminProductsPage() {
  const { productos, categorias, actualizarProducto, crearProducto, eliminarProducto,  } = useStore();
const [productoSeleccionado, setProductoSeleccionado] = useState(
  productos[0]?.id ?? "",
);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"danger" | "success">(
    "success",
  );

  const [nuevoId, setNuevoId] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaMarca, setNuevaMarca] = useState("");
  const [nuevoModelo, setNuevoModelo] = useState("");
  const [nuevoStock, setNuevoStock] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
const productoActual = productos.find(
  (producto) =>
    producto.id === productoSeleccionado,
);
  const guardarNuevoProducto = (
  evento: FormEvent<HTMLFormElement>,
) => {
  evento.preventDefault();

  const nuevoProducto: Producto = {
    id: nuevoId.trim(),
    categoria: nuevaCategoria,
    nombre: nuevoNombre.trim(),
    marca: nuevaMarca.trim(),
    modelo: nuevoModelo.trim(),
    stock: Number(nuevoStock),
    precio: Number(nuevoPrecio),
    descripcion: nuevaDescripcion.trim(),
  };

  const creado = crearProducto(nuevoProducto);

  if (!creado) {
    setTipoMensaje("danger");
    setMensaje(
      "No fue posible crear el producto. Revisa los datos o el código del producto.",
    );
    return;
  }

  setTipoMensaje("success");
  setMensaje("Producto creado correctamente.");

  setNuevoId("");
  setNuevaCategoria("");
  setNuevoNombre("");
  setNuevaMarca("");
  setNuevoModelo("");
  setNuevoStock("");
  setNuevoPrecio("");
  setNuevaDescripcion("");
};

  const guardarDatosProducto = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (!productoActual) return;
    const formulario = new FormData(evento.currentTarget);
    const leer = (campo: string) => String(formulario.get(campo) ?? "").trim();
    const actualizado: Producto = {
      ...productoActual,
      categoria: leer("categoria"),
      nombre: leer("nombre"),
      marca: leer("marca"),
      modelo: leer("modelo"),
      stock: Number(formulario.get("stock")),
      precio: Number(formulario.get("precio")),
      descripcion: leer("descripcion"),
    };
    const guardado = actualizarProducto(actualizado);
    setMensaje(
      guardado
        ? "Datos del producto actualizados correctamente."
        : "Revisa los campos: el stock debe ser un entero y el precio no puede ser negativo.",
    );
    setTipoMensaje(guardado ? "success" : "danger");
  };
  const borrarProducto = () => {
  if (!productoActual) {
    return;
  }

  const confirmar = window.confirm(
    `¿Seguro que deseas eliminar "${productoActual.nombre}"?`,
  );

  if (!confirmar) {
    return;
  }
  console.log(
    "Producto a eliminar:",
    productoActual.id,
  );

  const eliminado = eliminarProducto(
    productoActual.id,
  );
   console.log(
    "Resultado eliminarProducto:",
    eliminado,
  );

  if (!eliminado) {
    setTipoMensaje("danger");
    setMensaje(
      "No fue posible eliminar el producto.",
    );
    return;
  }

  const siguienteProducto = productos.find(
    (producto) =>
      producto.id !== productoActual.id,
  );

  setProductoSeleccionado(
    siguienteProducto?.id ?? "",
  );

  setTipoMensaje("success");
  setMensaje(
    "Producto eliminado correctamente.",
  );
};

  return (
    <section className="card shadow-sm border-0 mb-5">
      <div className="card-body p-4">
        <h2 className="h4 fw-bold mb-3">Administración de productos</h2>
        <Mensaje texto={mensaje} tipo={tipoMensaje} />
        <h3 className="h5 mt-4 mb-3">
  Crear producto
</h3>

<form onSubmit={guardarNuevoProducto} className="mb-5">
  <div className="row g-3">

    <div className="col-md-6">
      <label className="form-label">
        Código
      </label>

      <input
        type="text"
        className="form-control"
        value={nuevoId}
        onChange={(evento) =>
          setNuevoId(evento.target.value)
        }
        required
      />
    </div>

    <div className="col-md-6">
      <label className="form-label">
        Categoría
      </label>

      <select
        className="form-select"
        value={nuevaCategoria}
        onChange={(evento) =>
          setNuevaCategoria(evento.target.value)
        }
        required
      >
        <option value="">
          Seleccione una categoría
        </option>

        {categorias.map((categoria) => (
          <option
            key={categoria}
            value={categoria}
          >
            {categoria}
          </option>
        ))}
      </select>
    </div>

    <div className="col-md-6">
      <label className="form-label">
        Nombre
      </label>

      <input
        type="text"
        className="form-control"
        value={nuevoNombre}
        onChange={(evento) =>
          setNuevoNombre(evento.target.value)
        }
        required
      />
    </div>

    <div className="col-md-6">
      <label className="form-label">
        Marca
      </label>

      <input
        type="text"
        className="form-control"
        value={nuevaMarca}
        onChange={(evento) =>
          setNuevaMarca(evento.target.value)
        }
        required
      />
    </div>

    <div className="col-md-6">
      <label className="form-label">
        Modelo
      </label>

      <input
        type="text"
        className="form-control"
        value={nuevoModelo}
        onChange={(evento) =>
          setNuevoModelo(evento.target.value)
        }
        required
      />
    </div>

    <div className="col-md-3">
      <label className="form-label">
        Stock
      </label>

      <input
        type="number"
        className="form-control"
        min="0"
        step="1"
        value={nuevoStock}
        onChange={(evento) =>
          setNuevoStock(evento.target.value)
        }
        required
      />
    </div>

    <div className="col-md-3">
      <label className="form-label">
        Precio
      </label>

      <input
        type="number"
        className="form-control"
        min="0"
        step="1"
        value={nuevoPrecio}
        onChange={(evento) =>
          setNuevoPrecio(evento.target.value)
        }
        required
      />
    </div>

    <div className="col-12">
      <label className="form-label">
        Descripción
      </label>

      <textarea
        className="form-control"
        rows={3}
        value={nuevaDescripcion}
        onChange={(evento) =>
          setNuevaDescripcion(evento.target.value)
        }
        required
      />
    </div>

  </div>

  <button
    className="btn btn-success mt-3"
    type="submit"
  >
    Crear producto
  </button>
</form>

<hr className="my-4" />

<h3 className="h5 mb-3">
  Editar producto
</h3>
        <label
  className="form-label"
  htmlFor="productoSeleccionado"
>
  Producto
</label>

<select
  className="form-select mb-4"
  id="productoSeleccionado"
  value={productoSeleccionado}
  onChange={(evento) =>
    setProductoSeleccionado(evento.target.value)
  }
>
  {productos.map((producto) => (
    <option
      key={producto.id}
      value={producto.id}
    >
      {producto.id} - {producto.nombre}
    </option>
  ))}
</select>
        {productoActual && (
          <form key={productoActual.id} onSubmit={guardarDatosProducto}>
            <div className="row g-3">
              <div className="col-md-6">
  <label
    className="form-label"
    htmlFor="producto-categoria"
  >
    Categoría
  </label>

  <select
    className="form-select"
    id="producto-categoria"
    name="categoria"
    defaultValue={productoActual.categoria}
    required
  >
    {categorias.map((categoria) => (
      <option
        key={categoria}
        value={categoria}
      >
        {categoria}
      </option>
    ))}
  </select>
</div>
              {(
                [
                  ["id","Código",productoActual.id],
                  ["nombre", "Nombre", productoActual.nombre],
                  ["marca", "Marca", productoActual.marca],
                  ["modelo", "Modelo", productoActual.modelo],
                  ["stock", "Stock", productoActual.stock],
                  ["precio", "Precio", productoActual.precio],
                ] as const
              )
              .map(([name, label, value]) => (
                <div className="col-md-6" key={name}>
                  <label className="form-label" htmlFor={`producto-${name}`}>
                    {label}
                  </label>
                  <input
                    className="form-control"
                    id={`producto-${name}`}
                    name={name}
                    type={
                      name === "stock" || name === "precio" ? "number" : "text"
                    }
                    min={
                      name === "stock" || name === "precio" ? 0 : undefined
                    }
                    step={
                      name === "stock" || name === "precio" ? 1 : undefined
                    }
                    defaultValue={value}
                    required
                  />
                </div>
              ))}
              <div className="col-12">
                <label className="form-label" htmlFor="producto-descripcion">
                  Descripción
                </label>
                <textarea
                  className="form-control"
                  id="producto-descripcion"
                  name="descripcion"
                  rows={3}
                  defaultValue={productoActual.descripcion}
                  required
                />
              </div>
            </div>
           <div className="d-flex gap-2 mt-4">

  <button
    className="btn btn-primary"
    type="submit"
  >
    Guardar cambios
  </button>

  <button
    className="btn btn-danger"
    type="button"
    onClick={borrarProducto}
  >
    Eliminar producto
  </button>

</div>
          </form>
        )}
      </div>
    </section>
  );
}
