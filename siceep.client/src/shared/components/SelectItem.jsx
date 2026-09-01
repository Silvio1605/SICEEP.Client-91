import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectItem({ value, onChange, datos, titulo, incluirTodo }) {
    
    return (
        <div>
            <FormControl
                fullWidth
                variant="outlined"
                sx={{
                    mt: 1,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: '#fafafa',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&.Mui-focused': {
                            backgroundColor: '#ffffff',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#1976d2',
                                borderWidth: '2px',
                                boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)',
                            }
                        }
                    },

                    '& .MuiInputLabel-root': {
                        fontWeight: 500,
                        color: '#616161',
                        '&.Mui-focused': {
                            color: '#1976d2',
                            fontWeight: 500,
                        }
                    },
                    '& .MuiSelect-select': {
                        py: 1.5,
                        fontWeight: 400,
                        color: '#212121',
                    },
                }}
            >
                <InputLabel
                    id={`select-label-${titulo}`}
                    sx={{
                        '&.MuiInputLabel-shrink': {
                            transform: 'translate(14px, -8px) scale(0.85)',
                            backgroundColor: 'white',
                            px: '4px',
                        }
                    }}
                >
                    {titulo}
                </InputLabel>

                <Select
                    labelId={`select-label-${titulo}`}
                    id={`select-${titulo}`}
                    value={value ?? ""}
                    label={titulo}
                    onChange={(e) => onChange(e.target.value)}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                maxHeight: 300,
                                borderRadius: 2,
                                mt: 1,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                '& .MuiMenuItem-root': {
                                    fontSize: '0.9rem',
                                    py: 1,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: '#e3f2fd',
                                        '&:hover': {
                                            backgroundColor: '#bbdefb',
                                        }
                                    }
                                }
                            }
                        }
                    }}
                >
                    {incluirTodo && (
                        <MenuItem value="">
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
