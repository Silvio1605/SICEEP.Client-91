import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

export default function FiltroBusqueda({ busqueda, onBuscar }) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                backgroundColor: '#f8f9fa',
                borderColor: '#e0e0e0',
                borderRadius: 2,
                flexWrap: { xs: 'wrap', md: 'nowrap' }
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: 1,
                    border: '1px solid #ced4da',
                    borderRadius: 1,
                    backgroundColor: '#ffffff',
                    px: 1,
                    py: 0.5
                }}
            >
                <SearchIcon color="action" sx={{ ml: 1 }} />
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Buscar por nombre del propietario"
                    value={busqueda}
                    onChange={onBuscar}
                />
            </Box>
        </Paper>
    );
}
