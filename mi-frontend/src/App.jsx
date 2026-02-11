import ListaProductos from "./components/ListaProductos";
function App(){
  return (
    <div className="App">
      {/* Barra de navegación simple con Bootstrap */}
      <nav className="navbar navbar-dark bg-dark mb-4">
        <div className="container">
          <a className="navbar-brand" href="#">Mi sistema de inventario</a>
        </div>
      </nav>
      {/* Aquí llamaos al componente que creamos antes */}
      <main>
        <ListaProductos/>
      </main>
    </div>
  );
};

export default App;