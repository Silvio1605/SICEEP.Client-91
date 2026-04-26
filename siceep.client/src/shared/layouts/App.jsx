import { Routes, Route } from "react-router-dom";
import Usuarios from './../../feature/usuarios/pages/Usuarios.jsx';
import { BusquedaProvider } from './../../feature/usuarios/context/BusquedaProvider.jsx';
import Permisos from './../../feature/permisos/pages/Permisos.jsx';
import Home from "./Home.jsx";
import Index from "./Index.jsx";

function App() {
  return (
      <Routes>
          <Route path="/" element={<Index />}>
              <Route index element={<Home />} />
              <Route path="usuarios" element={
                  <BusquedaProvider>
                      <Usuarios />
                   </BusquedaProvider>
                  }
              />
              <Route path="permisos" element={<Permisos />} />
          </Route>
      </Routes>
  )
}

export default App;
