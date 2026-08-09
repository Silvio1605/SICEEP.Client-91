import React from 'react';
import { Box, Typography, Paper, Button, Divider } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

export default function TabDocumentos() {
    return (
        <Box>
            <Typography variant="subtitle1" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
                Gestión de Expediente Digital - Documentos Requeridos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Adjunte los documentos institucionales obligatorios y soportes según los lineamientos del sistema.
            </Typography>

            <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>

                {/*Cédula*/}
                <Box sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold">Cédula de Identidad</Typography>
                        <Typography variant="body2" color="text.secondary">Formato PDF o Imagen (Ambos lados)</Typography>
                    </Box>
                    <Button component="label" variant="outlined" startIcon={<FileUploadOutlinedIcon />} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                        ADJUNTAR
                        <input type="file" hidden accept="application/pdf, image/jpeg, image/png" />
                    </Button>
                </Box>

                <Divider />

                {/*Fotografía*/}
                <Box sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold">Fotografía del Funcionario</Typography>
                        <Typography variant="body2" color="text.secondary">Formato JPG o PNG</Typography>
                    </Box>
                    <Button component="label" variant="outlined" startIcon={<FileUploadOutlinedIcon />} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                        ADJUNTAR
                        <input type="file" hidden accept="image/jpeg, image/png" />
                    </Button>
                </Box>

                <Divider />

                {/*Contrato*/}
                <Box sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold">Contrato de Trabajo</Typography>
                        <Typography variant="body2" color="text.secondary">Documento oficial firmado en PDF</Typography>
                    </Box>
                    <Button component="label" variant="outlined" startIcon={<FileUploadOutlinedIcon />} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                        ADJUNTAR
                        <input type="file" hidden accept="application/pdf" />
                    </Button>
                </Box>

                <Divider />

                {/*Soporte Académico*/}
                <Box sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold">Soporte Académico (Títulos / Certificados)</Typography>
                        <Typography variant="body2" color="text.secondary">Diploma, título o certificado de cursos en PDF o Imagen</Typography>
                    </Box>
                    <Button component="label" variant="outlined" startIcon={<FileUploadOutlinedIcon />} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                        ADJUNTAR
                        <input type="file" hidden accept="application/pdf, image/jpeg, image/png" />
                    </Button>
                </Box>

            </Paper>
        </Box>
    );
}