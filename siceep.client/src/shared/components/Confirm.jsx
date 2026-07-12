import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InfoIcon from '@mui/icons-material/Info';

function Confirm({ open, handleClose, onConfirm, title, content }) {

    const btnAceptarRef = React.useRef(null);

    React.useEffect(() => {
        if (!open) return;

        const frameId = requestAnimationFrame(() => {
            btnAceptarRef.current?.focus();
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [open]);

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                role="alertdialog"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        minWidth: { xs: '90%', sm: 400 },
                        maxWidth: 500,
                        overflow: 'hidden',
                    }
                }}
            >
                {/* encabezado */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: 'linear-gradient(90deg, #1976d2, #64b5f6)',
                    }}
                />

                <DialogTitle
                    id="alert-dialog-title"
                    sx={{
                        pt: 3,
                        pb: 1,
                        px: 3,
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        color: '#1a1a1a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    {/* Icono de alerta */}
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <InfoIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                    </Box>
                    {title}
                </DialogTitle>

                <DialogContent sx={{ px: 3, py: 2 }}>
                    <DialogContentText
                        id="alert-dialog-description"
                        sx={{
                            color: '#424242',
                            fontSize: '0.95rem',
                            lineHeight: 1.6,
                            mb: 1,
                        }}
                    >
                        {content}
                    </DialogContentText>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 3,
                        pt: 1,
                        gap: 1.5,
                    }}
                >
                    <Button
                        onClick={handleClose}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 2.5,
                            py: 0.8,
                            color: '#666',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.05)',
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={onConfirm}
                        variant="contained"
                        autoFocus
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 3,
                            py: 0.8,
                            boxShadow: '0 2px 6px rgba(25, 118, 210, 0.3)',
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                            }
                        }}
                    >
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default Confirm;