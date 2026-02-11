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
            await axios.post(URL, nuevoProducto);
            setNuevoProducto({ nombre: '', precio: '', stock: ''}); //Limpiar el formulario
            cargarProductos(); //Recargamos la lista
        } catch (error) {
            //Si el backend lanza un error de validación, lo atrapamos aqui
            alert("Error: " + error.response.data.message || "Datos invalidado");
        }
    };

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
                    <button type='submit' className='btn btn-success w-100'>Agregar</button>
                </div>
            </form>
            <h2 className='text-center mb-4'>Inventario de Producto</h2>
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
                    {productos.map((p) =>(
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.nombre}</td>
                            <td>{p.precio}</td>
                            <td>{p.stock}u.</td>
                            <td>
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