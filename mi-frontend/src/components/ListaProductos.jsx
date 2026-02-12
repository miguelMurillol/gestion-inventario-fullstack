import React, { useState, useEffect } from 'react';
import axios from 'axios'; //Libreria recomendada para peticiones

const ListaProductos = () => {
    // 1.Estado para guardar los productos que vienen de Java
    const [productos, setProductos] = useState([]);

    // Estado para el formulario
    const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: '', stock: '' });

    const URL = "http://localhost:8080/api/productos";

    // 2.Funciona para llamar a tu API de Spring Boot
    const cargarProductos = async () =>{
        const resultado = await axios.get(URL);
        setProductos(resultado.data);
    };

    //Estado para saber saber si se esta editando 
    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    //Estado para para guardar busqueda

    const [busqueda, setBusqueda] = useState("");

    // 3.Se ejecuta automaticamente al cargar la página
    useEffect(() => {
        cargarProductos();
    }, []);

    //Función para ELIMINAR
    const eliminarProducto = async (id) =>{
        await axios.delete(`${URL}/${id}`);
        cargarProductos(); //Recargamos la lista tras borrar
    };

    // Función para GUARDAR productos
    const guardarProducto = async (e) => {
        e.preventDefault(); //Evita que la pagina se recargue
        try {
            if(editando){
                await axios.put(`${URL}/${idEditar}`, nuevoProducto);
                setEditando(false);
                setIdEditar(null);
            }else{
                await axios.post(URL, nuevoProducto);
            }
            setNuevoProducto({ nombre: '', precio: '', stock: ''}); //Limpiar el formulario
            cargarProductos(); //Recargamos la lista
        } catch (error) {
            //Si el backend lanza un error de validación, lo atrapamos aqui
            alert("Error: " + error.response.data.message || "Datos invalidado");
        }
    };

    const prepararEdicion = (producto) =>{
        setEditando(true);
        setIdEditar(producto.id);
        setNuevoProducto({
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock
        });
    };

    //Filtrar los productos 
    const productosFiltrados = productos.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className='container mt-4'>
            {/*  FORMULARIO PARA CREAR */}
            <form onSubmit={guardarProducto} className='row g-3 mb-5 p-3 border rounded bg-light shadow-sm'>
                <div className='col-md-4'>
                    <input type='text' className='form-control' placeholder='Nombre' value={nuevoProducto.nombre}
                    onChange={(e) =>
                        setNuevoProducto({...nuevoProducto, nombre: e.target.value})} required></input>
                </div>
                <div className='col-md-3'>
                    <input type='number' className='form-control' placeholder='Precio' value={nuevoProducto.precio}
                    onChange={(e) =>
                        setNuevoProducto({...nuevoProducto, precio: e.target.value})} required></input>
                </div>
                <div className='col-md-3'>
                    <input type='number' className='form-control' placeholder='Stock' value={nuevoProducto.stock}
                    onChange={(e) =>
                        setNuevoProducto({...nuevoProducto, stock: e.target.value})} required></input>
                </div>
                <div className='col-md-2'>
                    <button type='submit' className={`btn w-100 ${editando ? 'btn-warning' : 'btn-success'}`}>{editando ? 'Actualizar' : 'Agregar'}</button>
                    {editando && (<button className='btn btn-secondary w-100 mt-2' onClick={() =>
                        {
                            setEditando(false);
                            setNuevoProducto({nombre:'', precio:'', stock:''})
                        }
                    }>Cancelar</button>)}
                </div>
            </form>
            <h2 className='text-center mb-4'>Inventario de Producto</h2>
            {/* Barra de busqueda */}
            <div className='mb-3'>
                    <div className='input-group'>
                        <span className='input-group-text bg-primary text-white'></span>
                        <input type='text' className='form-control' placeholder='Buscar producto por nombre...'
                        value={busqueda} onChange={(e) => setBusqueda(e.target.value)}></input>
                    </div>
            </div>
            {/*  4. Tabla usando clases de Bootstrap */}
            <table className='table table-striped table-hover-shadow'>
                <thead className='table-dark'>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productosFiltrados.map((p) =>(
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
        </div>
    );
};

export default ListaProductos;