import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectItem({ value, onChange, datos, titulo, incluirTodo }) {
    
    return (
        <div>
            <FormControl fullWidth variant="outlined" sx={{ m: 1}}>
                <InputLabel id={`select-label-${titulo}`}>{ titulo }</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id={`select-${titulo}`} 
                    value={value ?? ""}
                    onChange={
                        (e) => onChange(e.target.value)
                    }
                >
                    {
                        incluirTodo && (
                            <MenuItem value="">
                                <em>{"Todos"}</em>
                            </MenuItem>
                        )
                    }
                    {datos.map((sel) => (
                        <MenuItem value={sel.id}>{sel.nombre}</MenuItem>
                    ))}
                </Select>
            </FormControl>
          
        </div>
    );
}
