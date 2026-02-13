import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; //Libreria recomendada para peticiones
import * as XLSX from 'xlsx';

const ListaProductos = () => {
    // 1.Estado para guardar los productos que vienen de Java
    const [productos, setProductos] = useState([]);

    const [resumen, setResumen] = useState({ totalProductos: 0, valorTotal: 0, stockTotal: 0 });

    //Estado para para guardar busqueda
    const [busqueda, setBusqueda] = useState(""); 

    // Estado para el formulario
    const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: '', stock: '' });

    const [paginaActual, setPaginaActual] = useState(1);

    const [totalPaginas, setTotalPaginas] = useState(0);

    //Estado para ordenar tabla
    const [ordenarPor, setOrdenarPor] = useState('nombre');
    const [direccion, setDireccion] = useState('asc');

    const productosPorPagina = 5;

    const URL = "http://localhost:8080/api/productos";

    const cargarDatosCompletos = useCallback(async (pagina = 0, termino = busqueda, columna = ordenarPor, dir = direccion) => {
        try {
            // 1. Cargamos los productos para la tabla
            const resTabla = await axios.get(`${URL}?page=${pagina}&size=${productosPorPagina}&buscar=${termino}&sort=${columna}&direction=${dir}`);
            setProductos(resTabla.data.content || []);
            setTotalPaginas(resTabla.data.totalPages || 0);
            setPaginaActual(pagina + 1);

            // 2. Cargamos los totales basados en la misma búsqueda
            const resTotales = await axios.get(`${URL}/totales?buscar=${termino}`);
            setResumen(resTotales.data);

        } catch (error) {
            console.error("Error al sincronizar datos", error);
        }
    }, [busqueda, ordenarPor, direccion]);

    //Estado para saber saber si se esta editando 
    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    

    // 3.Se ejecuta automaticamente al cargar la página
    useEffect(() => {
        cargarDatosCompletos();
        //cargarProductos();
        //cargarResumen();
        //cargarDatosCompletos();
    }, [cargarDatosCompletos]);

    //Funcion para cambiar el orden
    const manejarOrden = (columna) => {
        const nuevaDireccion = (ordenarPor === columna && direccion === 'asc') ? 'desc' : 'asc';
        setOrdenarPor(columna);
        setDireccion(nuevaDireccion);
        cargarDatosCompletos(0, busqueda, columna, nuevaDireccion);

    };

    // Función para GUARDAR productos
    const guardarProducto = async (e) => {
        e.preventDefault(); //Evita que la pagina se recargue
        try {
            if (editando) {
                await axios.put(`${URL}/${idEditar}`, nuevoProducto);
                setEditando(false);
                setIdEditar(null);
            } else {
                await axios.post(URL, nuevoProducto);
            }
            setNuevoProducto({ nombre: '', precio: '', stock: '' }); //Limpiar el formulario
            //cargarProductos(); //Recargamos la lista
            //cargarResumen();
        } catch (error) {
            //Si el backend lanza un error de validación, lo atrapamos aqui
            alert("Error: " + error.response.data.message || "Datos invalidado");
        }
    };

    //Función para ELIMINAR
    const eliminarProducto = async (id) => {
        await axios.delete(`${URL}/${id}`);
        //cargarProductos(); //Recargamos la lista tras borrar
        //cargarResumen();
    };

    const prepararEdicion = (producto) => {
        setEditando(true);
        setIdEditar(producto.id);
        setNuevoProducto({
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock
        });
    };

    /*const cargarResumen = async () => {
        try {
            const response = await axios.get(`${URL}/totales`);
            setResumen(response.data);
        } catch (error) {
            console.error("Error al cargar totales", error);
        }
    };*/


    const exportarExcel = () => {
        //Se crea una copia de los datos para no enviar los IDs internos
        const datosParaExportar = productos.map(p => ({
            Nombre: p.nombre,
            Precio: p.precio,
            Stock: p.stock,
            'Valor Total': p.precio * p.stock
        }));

        //Crea el libro de trabajo (Workboks) y la hoja (worksheet)
        const hoja = XLSX.utils.json_to_sheet(datosParaExportar);
        const libro = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(libro, hoja, 'Inventario');

        //Generamos el archivo y lo descargamos
        XLSX.writeFile(libro, "Reporte_Inventarios.xlsx");
    };

    return (
        <div className='container mt-4'>
            <div className='row mb-4'>
                <div className='col-md-4'>
                    <div className='card border-left-primary shadow h-100 py-2'>
                        <div className='card-body'>
                            <div className='text-xs font-weight-bold text-primary text-uppercase mb-1'>
                                Items Diferentes
                            </div>
                            <div className='h5 mb-0 font-weight-bold text-gray-800'>{resumen.totalProductos}</div>
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='card border-left-success shadow h-100 py-2'>
                        <div className='card-body'>
                            <div className='text-xs font-weight-bold text-success text-uppercase mb-1'>
                                Valor Total Inventario
                            </div>
                            <div className='h5 mb-0 font-weight-bold text-gray-800'>${resumen.valorTotal.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='card border-left-info shadow h-100 py-2'>
                        <div className='card-body'>
                            <div className='text-xs font-weight-bold text-info text-uppercase mb-1'>
                                Stock Total (Unidades)
                            </div>
                            <div className='h5 mb-0 font-weight-bold text-gray-800'>{resumen.stockTotal} unidades</div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  FORMULARIO PARA CREAR */}
            <form onSubmit={guardarProducto} className='row g-3 mb-5 p-3 border rounded bg-light shadow-sm'>
                <div className='col-md-4'>
                    <input type='text' className='form-control' placeholder='Nombre' value={nuevoProducto.nombre}
                        onChange={(e) =>
                            setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })} required></input>
                </div>
                <div className='col-md-3'>
                    <input type='number' className='form-control' placeholder='Precio' value={nuevoProducto.precio}
                        onChange={(e) =>
                            setNuevoProducto({ ...nuevoProducto, precio: e.target.value })} required></input>
                </div>
                <div className='col-md-3'>
                    <input type='number' className='form-control' placeholder='Stock' value={nuevoProducto.stock}
                        onChange={(e) =>
                            setNuevoProducto({ ...nuevoProducto, stock: e.target.value })} required></input>
                </div>
                <div className='col-md-2'>
                    <button type='submit' className={`btn w-100 ${editando ? 'btn-warning' : 'btn-success'}`}>{editando ? 'Actualizar' : 'Agregar'}</button>
                    {editando && (<button className='btn btn-secondary w-100 mt-2' onClick={() => {
                        setEditando(false);
                        setNuevoProducto({ nombre: '', precio: '', stock: '' })
                    }
                    }>Cancelar</button>)}
                </div>
            </form>
            <h2 className='text-center mb-4'>Inventario de Producto</h2>
            {/* Barra de busqueda */}
            <div className='mb-3'>
                <div className='input-group'>
                    <span className='input-group-text bg-primary text-white'><i className='bi bi-search'></i></span>
                    <input type='text' className='form-control' placeholder='Buscar producto por nombre...'
                        value={busqueda}
                        onChange={(e) => { setBusqueda(e.target.value); cargarDatosCompletos(0, e.target.value); }}></input>
                    <button onClick={exportarExcel} className='btn btn-outline-success ms-2'>
                        <i className='bi bi-file-earmark-excel'></i>
                        Exportar a Excel
                    </button>
                </div>
            </div>
            {/*  4. Tabla usando clases de Bootstrap */}
            <table className='table table-striped table-hover-shadow'>
                <thead className='table-dark'>
                    <tr>
                        <th>ID</th>
                        <th onClick={() => manejarOrden('nombre')} style={{ cursor: 'pointer' }}>
                            Nombre{ordenarPor === 'nombre' ? (direccion === 'asc' ? ' ↑ ' : ' ↓ ') : ''}
                        </th>
                        <th onClick={() => manejarOrden('precio')} style={{ cursor: 'pointer' }}>
                            Precio{ordenarPor === 'precio' ? (direccion === 'asc' ? ' ↑ ' : ' ↓ ') : ''}
                        </th>
                        <th onClick={() => manejarOrden('stock')} style={{ cursor: 'pointer' }}>
                            Stock{ordenarPor === 'stock' ? (direccion === 'asc' ? ' ↑ ' : ' ↓ ') : ''}
                        </th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((p) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.nombre}</td>
                            <td>{p.precio}</td>
                            <td>{p.stock}u.</td>
                            <td>
                                <button onClick={() => prepararEdicion(p)} className='btn btn-info btn-sm me-2'>Editar</button>
                                <button onClick={() => eliminarProducto(p.id)} className='btn btn-danger btn-sm'>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ul className="pagination mb-0">
                <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => cargarDatosCompletos(paginaActual - 2)}>
                        Anterior
                    </button>
                </li>

                {[...Array(totalPaginas)].map((_, i) => (
                    <li key={i} className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => cargarDatosCompletos(i)}>
                            {i + 1}
                        </button>
                    </li>
                ))}

                <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => cargarDatosCompletos(paginaActual)}>
                        Siguiente
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default ListaProductos;