import { Routes, Route } from "react-router-dom";
import Usuarios from './pages/usuarios.jsx';
import Permisos from './pages/Permisos.jsx';
import Home from "./pages/Home.jsx";
import Index from "./pages/Index.jsx";

function App() {
  return (
      <Routes>
          <Route path="/" element={<Index />}>
              <Route index element={<Home />} />
              <Route path="usuarios" element={<Usuarios />} />
              <Route path="permisos" element={<Permisos />} />
          </Route>
      </Routes>
  )
}

export default App;
