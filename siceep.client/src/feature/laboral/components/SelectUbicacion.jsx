import React, { useCallback, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { getUbicacionesFiltro } from './../services/laboralServices';

// Selector de sede: muestra "Estructura - Unidad" y entrega { id, nombre } a través de onChange
export default function SelectUbicacion({ value, onChange, label, ayuda }) {
    const [opciones, setOpciones] = useState([]);
    const [cargando, setCargando] = useState(false);

    const cargarOpciones = useCallback(async () => {
        if (opciones.length > 0) return;
        setCargando(true);
        try {
            const res = await getUbicacionesFiltro(null, null);
            setOpciones(res?.data || []);
        } catch {
            setOpciones([]);
        } finally {
            setCargando(false);
        }
    }, [opciones.length]);

    return (
        <Autocomplete
            value={value || null}
            options={opciones}
            loading={cargando}
            getOptionLabel={(opcion) => opcion?.nombre || ''}
            isOptionEqualToValue={(opcion, valor) => opcion?.id === valor?.id}
            onChange={(_event, valor) => onChange(valor || null)}
            onOpen={cargarOpciones}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label || "Ubicación"}
                    placeholder="Busque una sede (estructura - unidad)..."
                    helperText={ayuda || ""}
                />
            )}
        />
    );
}