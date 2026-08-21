import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function SelectItemB({ value, valueDef, onChange, datos, titulo, incluirTodo }) {

    return (
        <div>
            <FormControl
                fullWidth
                size="small"
                sx={{ m: 0, p: 0 }}
            >
                <InputLabel
                    size="small"
                    id={`select-label-${titulo}`}
                >
                    {titulo}
                </InputLabel>

                <Select
                    labelId={`select-label-${titulo}`}
                    id={`select-${titulo}`}
                    value={value ?? valueDef}
                    label={titulo}
                    onChange={(e) => onChange(e.target.value)}
                    sx={{ m: 0, p: 0 }}
                >
                    {incluirTodo && (
                        <MenuItem value={valueDef}>
                            <em>Todos</em>
                        </MenuItem>
                    )}

                    {datos.map((sel) => (
                        <MenuItem key={sel.id} value={sel.id}>
                            {sel.nombre}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default SelectItemB;

