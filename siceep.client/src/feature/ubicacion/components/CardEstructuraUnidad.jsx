import { useState } from 'React';
import {
    Grid,
    Button,
    Card,
    CardContent,
    Stack
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import AppInput from "./../../../shared/components/AppInput";
import { useEstructuras } from "./../hooks/useEstructuras";
import { useUnidades } from "./../hooks/useUnidades";

export default function CardEstructuraUnidad({
    open,
    onClose,
    tipo,
    titulo
}) {
    // Configuración para el diálogo responsivo
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const { registrarEstructura } = useEstructuras();
    const { registrarUnidad } = useUnidades();

    // 
    const [guardando, setGuardando] = useState(false);
    const [registro, setRegistro] = useState({
        descripcion: "",
        orden: ""
    });

    const handleGuardar = async () => {

        setGuardando(true);
        if (tipo === 1) {
            await registrarEstructura(registro);
        } else {
            await registrarUnidad(registro);
        }

        setGuardando(false);
        onClose();
    };

    return (
        <React.Fragment>
          <Dialog
              fullScreen={fullScreen}
              open={open}
              onClose={onClose}
              fullWidth
              maxWidth="md"
              disableAutoFocus
          >
              <DialogTitle sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  borderBottom: 1,
                  borderColor: 'divider'
              }}>
                    {titulo}
              </DialogTitle>
              <DialogContent dividers>
                    <Card
                        elevation={2}
                        sx={{
                            borderRadius: 3
                        }}
                    >
                        <CardContent>
                            <Grid container spacing={2}>

                                <Grid size={{ xs: 12 }}>
                                    <AppInput
                                        id="nombre"
                                        label="Descripcion"
                                        value={registro.descripcion ?? ""}
                                        onChange={(e) =>
                                            setRegistro({
                                                ...registro,
                                                descripcion: e.target.value
                                            })
                                        }
                                    />
                                </Grid>

                                {tipo === 1 && (
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <AppInput
                                            id="orden"
                                            label="Orden"
                                            type="number"
                                            inputProps={{
                                                step: 0.01
                                            }}
                                            value={registro.orden ?? ""}
                                            onChange={(e) =>
                                                setRegistro({
                                                    ...registro,
                                                    orden: e.target.value
                                                })
                                            }
                                        />
                                    </Grid>
                                )}

                            </Grid>

                           
                        </CardContent>
                    </Card>
              </DialogContent>
              <DialogActions>
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                        sx={{ mt: 4 }}
                    >
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleGuardar}
                            disabled={guardando}
                        >
                            {guardando == true ? "Guardando..." : "Guardar"}
                        </Button>

                    </Stack>
              </DialogActions>
              {guardando == true && (
                  <Box sx={{ width: '100%' }}>
                      <LinearProgress aria-label="Loading…" />
                  </Box>
              )}
          </Dialog>
         
      </React.Fragment>
        
    );
}