import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { productos as catalogoInicial } from "../data/Productos";
import type { Producto } from "../types/Producto";

const CLAVE_PRODUCTOS = "sonidovivo_productos";
const CLAVE_CARRITO = "sonidovivo_carrito";
const CLAVE_USUARIOS = "sonidovivo_usuarios";
const CLAVE_SESION = "sonidovivo_sesion";
const CLAVE_CATEGORIAS = "sonidovivo_categorias";

export type RolUsuario = "cliente" | "vendedor" | "administrador";

export interface ItemCarrito {
  idProducto: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  correo: string;
  password: string;
  direccion: string;
  region: string;
  genero: string;
  intentosFallidos: number;
  bloqueado: boolean;
  rol: RolUsuario;
}

interface StoreContextValue {
  productos: Producto[];
  carrito: ItemCarrito[];
  usuarios: Usuario[];
  usuarioActual: Usuario | null;
  categorias: string[];
  agregarAlCarrito: (idProducto: string) => boolean;
  eliminarDelCarrito: (idProducto: string) => void;
  vaciarCarrito: () => void;
  finalizarCompra: () => string | null;
  establecerSesion: (idUsuario: string) => void;
  cerrarSesion: () => void;
  guardarUsuarios: (usuarios: Usuario[]) => void;
  actualizarStock: (idProducto: string, stock: number) => boolean;
  actualizarProducto: (producto: Producto) => boolean;
  crearProducto: (producto: Producto) => boolean;
  eliminarProducto: (idProducto: string) => boolean;
  crearCategoria: (nombre: string) => boolean;
actualizarCategoria: (
  nombreActual: string,
  nombreNuevo: string,
) => boolean;
eliminarCategoria: (nombre: string) => boolean;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function leerLocalStorage<T>(clave: string, valorInicial: T): T {
  const valor = localStorage.getItem(clave);
  return valor === null ? valorInicial : (JSON.parse(valor) as T);
}

function cargarProductos(): Producto[] {
  const guardados = leerLocalStorage<Producto[]>(
    CLAVE_PRODUCTOS,
    [],
  );

  if (guardados.length > 0) {
    return guardados;
  }

  localStorage.setItem(
    CLAVE_PRODUCTOS,
    JSON.stringify(catalogoInicial),
  );

  return catalogoInicial;
}
function cargarCategorias(): string[] {
  const guardadas =
    localStorage.getItem(CLAVE_CATEGORIAS);

  if (guardadas !== null) {
    return JSON.parse(guardadas) as string[];
  }

  const productosGuardados =
    leerLocalStorage<Producto[]>(
      CLAVE_PRODUCTOS,
      catalogoInicial,
    );

  const categoriasIniciales = [
    ...new Set(
      productosGuardados.map(
        (producto) => producto.categoria,
      ),
    ),
  ];

  localStorage.setItem(
    CLAVE_CATEGORIAS,
    JSON.stringify(categoriasIniciales),
  );

  return categoriasIniciales;
}

function cargarUsuarios(): Usuario[] {
  const cuentasPrueba: Usuario[] = [
    {
      id: "usuario-administrador-demo",
      nombre: "Admin",
      apellido: "Sonido Vivo",
      fechaNacimiento: "1990-01-01",
      correo: "admin@sonidovivo.cl",
      password: "Admin123!",
      direccion: "Casa matriz",
      region: "Valparaíso",
      genero: "Prefiero no indicar",
      intentosFallidos: 0,
      bloqueado: false,
      rol: "administrador",
    },
    {
      id: "usuario-vendedor-demo",
      nombre: "Vendedor",
      apellido: "Sonido Vivo",
      fechaNacimiento: "1990-01-01",
      correo: "vendedor@sonidovivo.cl",
      password: "Vendedor123!",
      direccion: "Casa matriz",
      region: "Valparaíso",
      genero: "Prefiero no indicar",
      intentosFallidos: 0,
      bloqueado: false,
      rol: "vendedor",
    },
    {
      id: "usuario-cliente-demo",
      nombre: "Cliente",
      apellido: "Demo",
      fechaNacimiento: "1990-01-01",
      correo: "cliente@sonidovivo.cl",
      password: "Cliente123!",
      direccion: "Av. Sonido Vivo 123",
      region: "Valparaíso",
      genero: "Prefiero no indicar",
      intentosFallidos: 0,
      bloqueado: false,
      rol: "cliente",
    },
  ];
  const guardados = leerLocalStorage<Partial<Usuario>[]>(CLAVE_USUARIOS, []);
  const normalizados: Usuario[] = guardados.map((usuario) => ({
    id: usuario.id ?? crypto.randomUUID(),
    nombre: usuario.nombre ?? "",
    apellido: usuario.apellido ?? "",
    fechaNacimiento: usuario.fechaNacimiento ?? "",
    correo: usuario.correo ?? "",
    password: usuario.password ?? "",
    direccion: usuario.direccion ?? "",
    region: usuario.region ?? "",
    genero: usuario.genero ?? "",
    intentosFallidos: usuario.intentosFallidos ?? 0,
    bloqueado: usuario.bloqueado ?? false,
    rol:
      usuario.rol === "administrador" || usuario.rol === "vendedor"
        ? usuario.rol
        : "cliente",
  }));
  const porCorreo = new Map(normalizados.map((usuario) => [usuario.correo, usuario]));

  for (const cuenta of cuentasPrueba) {
    if (!porCorreo.has(cuenta.correo)) porCorreo.set(cuenta.correo, cuenta);
  }

  const actualizados = [...porCorreo.values()];
  if (JSON.stringify(guardados) !== JSON.stringify(actualizados)) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(actualizados));
  }
  return actualizados;
}

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [productos, setProductos] = useState<Producto[]>(cargarProductos);
  const [categorias, setCategorias] =
  useState<string[]>(cargarCategorias);
  const [carrito, setCarrito] = useState<ItemCarrito[]>(() =>
    leerLocalStorage<ItemCarrito[]>(CLAVE_CARRITO, []),
  );
  const [usuarios, setUsuarios] = useState<Usuario[]>(cargarUsuarios);
  const [idSesion, setIdSesion] = useState<string | null>(() =>
    localStorage.getItem(CLAVE_SESION),
  );
  const usuarioActual = usuarios.find((usuario) => usuario.id === idSesion) ?? null;

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    if (usuarioActual) localStorage.setItem(CLAVE_SESION, usuarioActual.id);
    else localStorage.removeItem(CLAVE_SESION);
  }, [usuarioActual]);

  const value = useMemo<StoreContextValue>(
    () => ({
      productos,
      categorias,
      carrito,
      usuarios,
      usuarioActual,
      agregarAlCarrito: (idProducto) => {
        if (!usuarioActual) return false;
        const producto = productos.find((item) => item.id === idProducto);
        if (!producto || producto.stock <= 0) return false;

        const existente = carrito.find(
          (item) => item.idProducto === idProducto,
        );
        if (existente && existente.cantidad >= producto.stock) return false;

        setCarrito(
          existente
            ? carrito.map((item) =>
                item.idProducto === idProducto
                  ? { ...item, cantidad: item.cantidad + 1 }
                  : item,
              )
            : [
                ...carrito,
                {
                  idProducto: producto.id,
                  nombre: producto.nombre,
                  precio: producto.precio,
                  cantidad: 1,
                },
              ],
        );
        return true;
      },
      eliminarDelCarrito: (idProducto) =>
        setCarrito((actual) =>
          actual.filter((item) => item.idProducto !== idProducto),
        ),
      vaciarCarrito: () => setCarrito([]),
      finalizarCompra: () => {
       if (!usuarioActual) {
  return "Debes iniciar sesión para realizar una compra.";
}
        if (carrito.length === 0) return "No existen productos para comprar.";

        for (const item of carrito) {
          const producto = productos.find(
            (actual) => actual.id === item.idProducto,
          );
          if (!producto) return "Uno de los productos ya no existe.";
          if (item.cantidad > producto.stock) {
            return `No existe stock suficiente para ${producto.nombre}.`;
          }
        }

        const actualizados = productos.map((producto) => {
          const item = carrito.find(
            (actual) => actual.idProducto === producto.id,
          );
          return item
            ? { ...producto, stock: producto.stock - item.cantidad }
            : producto;
        });
        localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(actualizados));
        setProductos(actualizados);
        setCarrito([]);
        return null;
      },
      establecerSesion: (idUsuario) => setIdSesion(idUsuario),
      cerrarSesion: () => setIdSesion(null),
      guardarUsuarios: (actualizados) => {
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(actualizados));
        setUsuarios(actualizados);
      },
      actualizarStock: (idProducto, stock) => {
        if (
          usuarioActual?.rol !== "vendedor" ||
          !Number.isInteger(stock) ||
          stock < 0
        ) {
          return false;
        }
        const actualizados = productos.map((producto) =>
          producto.id === idProducto ? { ...producto, stock } : producto,
        );
        if (!actualizados.some((producto) => producto.id === idProducto)) {
          return false;
        }
        localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(actualizados));
        setProductos(actualizados);
        return true;
      },

      crearProducto: (nuevoProducto) => {
  if (usuarioActual?.rol !== "administrador") {
    return false;
  }

  if (
    !nuevoProducto.id.trim() ||
    !nuevoProducto.categoria.trim() ||
    !nuevoProducto.nombre.trim() ||
    !nuevoProducto.marca.trim() ||
    !nuevoProducto.modelo.trim() ||
    !nuevoProducto.descripcion.trim()
  ) {
    return false;
  }

  if (
    !Number.isInteger(nuevoProducto.stock) ||
    nuevoProducto.stock < 0
  ) {
    return false;
  }

  if (
    !Number.isFinite(nuevoProducto.precio) ||
    nuevoProducto.precio < 0
  ) {
    return false;
  }

  const existe = productos.some(
    (producto) => producto.id === nuevoProducto.id,
  );

  if (existe) {
    return false;
  }

  const actualizados = [
    ...productos,
    nuevoProducto,
  ];


  localStorage.setItem(
    CLAVE_PRODUCTOS,
    JSON.stringify(actualizados),
  );

  setProductos(actualizados);

  return true;
},
eliminarProducto: (idProducto) => {
  if (usuarioActual?.rol !== "administrador") {
    return false;
  }

  const existe = productos.some(
    (producto) => producto.id === idProducto,
  );

  if (!existe) {
    return false;
  }

  const actualizados = productos.filter(
    (producto) => producto.id !== idProducto,
  );


  localStorage.setItem(
    CLAVE_PRODUCTOS,
    JSON.stringify(actualizados),
  );

  setProductos(actualizados);

  setCarrito((carritoActual) =>
    carritoActual.filter(
      (item) => item.idProducto !== idProducto,
    ),
  );
  

  return true;
},
crearCategoria: (nombre) => {
  if (
    usuarioActual?.rol !== "administrador"
  ) {
    return false;
  }

  const nuevaCategoria = nombre.trim();

  if (!nuevaCategoria) {
    return false;
  }

  const existe = categorias.some(
    (categoria) =>
      categoria.toLowerCase() ===
      nuevaCategoria.toLowerCase(),
  );

  if (existe) {
    return false;
  }

  const actualizadas = [
    ...categorias,
    nuevaCategoria,
  ];

  localStorage.setItem(
    CLAVE_CATEGORIAS,
    JSON.stringify(actualizadas),
  );

  setCategorias(actualizadas);

  return true;
},
actualizarCategoria: (
  nombreActual,
  nombreNuevo,
) => {
  if (
    usuarioActual?.rol !== "administrador"
  ) {
    return false;
  }

  const nuevoNombre = nombreNuevo.trim();

  if (!nuevoNombre) {
    return false;
  }

  const existe = categorias.some(
    (categoria) =>
      categoria.toLowerCase() ===
        nuevoNombre.toLowerCase() &&
      categoria !== nombreActual,
  );

  if (existe) {
    return false;
  }

  const categoriasActualizadas =
    categorias.map((categoria) =>
      categoria === nombreActual
        ? nuevoNombre
        : categoria,
    );

  const productosActualizados =
    productos.map((producto) =>
      producto.categoria === nombreActual
        ? {
            ...producto,
            categoria: nuevoNombre,
          }
        : producto,
    );

  localStorage.setItem(
    CLAVE_CATEGORIAS,
    JSON.stringify(categoriasActualizadas),
  );

  localStorage.setItem(
    CLAVE_PRODUCTOS,
    JSON.stringify(productosActualizados),
  );

  setCategorias(categoriasActualizadas);
  setProductos(productosActualizados);

  return true;
},
eliminarCategoria: (nombre) => {
  if (
    usuarioActual?.rol !== "administrador"
  ) {
    return false;
  }

  const tieneProductos = productos.some(
    (producto) =>
      producto.categoria === nombre,
  );

  if (tieneProductos) {
    return false;
  }

  const actualizadas = categorias.filter(
    (categoria) =>
      categoria !== nombre,
  );

  localStorage.setItem(
    CLAVE_CATEGORIAS,
    JSON.stringify(actualizadas),
  );

  setCategorias(actualizadas);

  return true;
},

      actualizarProducto: (actualizado) => {
        if (
          usuarioActual?.rol !== "administrador" ||
          !Number.isInteger(actualizado.stock) ||
          actualizado.stock < 0 ||
          !Number.isFinite(actualizado.precio) ||
          actualizado.precio < 0 ||
          !actualizado.categoria.trim() ||
          !actualizado.nombre.trim() ||
          !actualizado.marca.trim() ||
          !actualizado.modelo.trim() ||
          !actualizado.descripcion.trim()
        ) {
          return false;
        }
        const actualizados = productos.map((producto) =>
          producto.id === actualizado.id ? actualizado : producto,
        );
        if (!actualizados.some((producto) => producto.id === actualizado.id)) {
          return false;
        }
        localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(actualizados));
        setProductos(actualizados);
        return true;
      },
    }),
    [productos, categorias, carrito, usuarios, usuarioActual],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore debe usarse dentro de StoreProvider.");
  return context;
}
