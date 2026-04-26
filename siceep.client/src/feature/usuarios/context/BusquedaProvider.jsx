import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const BusquedaContext = createContext();

export function BusquedaProvider({ children }) {
    const [idSeleccionado, setIdSeleccionado] = useState(null);
    return (
        <BusquedaContext.Provider value={{ idSeleccionado, setIdSeleccionado }}>
            {children}
        </BusquedaContext.Provider>
    );
}