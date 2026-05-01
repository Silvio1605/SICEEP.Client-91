import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Confirm({ open, handleClose, onConfirm, title, content }) {

    const btnAceptarRef = React.useRef(null);

    React.useEffect(() => {
        if (open) {
            // pequeño delay para asegurar que el dialog ya montó
            setTimeout(() => {
                btnAceptarRef.current?.focus();
            }, 0);
        }
    }, [open]);

    return (
        <React.Fragment>
            
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                role="alertdialog"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Cancelar
                    </Button>
                    <Button onClick={onConfirm}>Aceptar</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default Confirm;