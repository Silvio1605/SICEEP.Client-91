import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default function Alerta({ severity, mensaje }) {
    return (
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity={severity}>{mensaje}</Alert>
        </Stack>
    );
}
