import { useState, type FormEvent } from "react";
import { useStore } from "../../context/StoreContext";
import { Mensaje } from "../../components/PageHelpers";

export function AdminCategoriesPage() {
  const {
    categorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
  } = useStore();

  const [nuevaCategoria, setNuevaCategoria] =
    useState("");

  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState(categorias[0] ?? "");

  const [nuevoNombre, setNuevoNombre] =
    useState("");

  const [mensaje, setMensaje] =
    useState("");

  const [tipoMensaje, setTipoMensaje] =
    useState<"success" | "danger">("success");

  const guardarNuevaCategoria = (
    evento: FormEvent<HTMLFormElement>,
  ) => {
    evento.preventDefault();

    const creada =
      crearCategoria(nuevaCategoria);

    if (!creada) {
      setTipoMensaje("danger");
      setMensaje(
        "No fue posible crear la categoría. Revisa que el nombre no esté vacío o repetido.",
      );
      return;
    }

    setTipoMensaje("success");
    setMensaje(
      "Categoría creada correctamente.",
    );

    setNuevaCategoria("");
  };

  const modificarCategoria = (
    evento: FormEvent<HTMLFormElement>,
  ) => {
    evento.preventDefault();

    if (!categoriaSeleccionada) {
      return;
    }

    const actualizada =
      actualizarCategoria(
        categoriaSeleccionada,
        nuevoNombre,
      );

    if (!actualizada) {
      setTipoMensaje("danger");
      setMensaje(
        "No fue posible modificar la categoría.",
      );
      return;
    }

    setCategoriaSeleccionada(
      nuevoNombre.trim(),
    );

    setNuevoNombre("");

    setTipoMensaje("success");
    setMensaje(
      "Categoría modificada correctamente.",
    );
  };

  const borrarCategoria = () => {
    if (!categoriaSeleccionada) {
      return;
    }

    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar la categoría "${categoriaSeleccionada}"?`,
    );

    if (!confirmar) {
      return;
    }

    const eliminada =
      eliminarCategoria(
        categoriaSeleccionada,
      );

    if (!eliminada) {
      setTipoMensaje("danger");
      setMensaje(
        "No se puede eliminar esta categoría porque tiene productos asociados.",
      );
      return;
    }

    const siguiente = categorias.find(
      (categoria) =>
        categoria !== categoriaSeleccionada,
    );

    setCategoriaSeleccionada(
      siguiente ?? "",
    );

    setTipoMensaje("success");
    setMensaje(
      "Categoría eliminada correctamente.",
    );
  };

  return (
    <section className="card shadow-sm border-0 mb-5">
      <div className="card-body p-4">

        <h2 className="h4 fw-bold mb-3">
          Administración de categorías
        </h2>

        <Mensaje
          texto={mensaje}
          tipo={tipoMensaje}
        />

        <h3 className="h5 mt-4">
          Crear categoría
        </h3>

        <form
          onSubmit={guardarNuevaCategoria}
          className="mb-5"
        >
          <label className="form-label">
            Nombre de la categoría
          </label>

          <input
            type="text"
            className="form-control"
            value={nuevaCategoria}
            onChange={(evento) =>
              setNuevaCategoria(
                evento.target.value,
              )
            }
            required
          />

          <button
            className="btn btn-success mt-3"
            type="submit"
          >
            Crear categoría
          </button>
        </form>

        <hr />

        <h3 className="h5 mt-4">
          Modificar o eliminar categoría
        </h3>

        {categorias.length === 0 ? (
          <p className="text-muted">
            No existen categorías registradas.
          </p>
        ) : (
          <>
            <label className="form-label">
              Categoría
            </label>

            <select
              className="form-select mb-3"
              value={categoriaSeleccionada}
              onChange={(evento) => {
                setCategoriaSeleccionada(
                  evento.target.value,
                );

                setNuevoNombre("");
              }}
            >
              {categorias.map(
                (categoria) => (
                  <option
                    key={categoria}
                    value={categoria}
                  >
                    {categoria}
                  </option>
                ),
              )}
            </select>

            <form
              onSubmit={modificarCategoria}
            >
              <label className="form-label">
                Nuevo nombre
              </label>

              <input
                type="text"
                className="form-control"
                value={nuevoNombre}
                onChange={(evento) =>
                  setNuevoNombre(
                    evento.target.value,
                  )
                }
                placeholder={
                  categoriaSeleccionada
                }
                required
              />

              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-primary"
                  type="submit"
                >
                  Guardar cambios
                </button>

                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={borrarCategoria}
                >
                  Eliminar categoría
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </section>
  );
}