import React, { useState } from 'react';
import './../styles/StyleLogin.css';
import { useNavigate } from 'react-router-dom';
import { Box } from "@mui/material";
import bgImage from './../../../assets/imagen_izquierda.png';
import logoImage from './../../../assets/Logo_p.png';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyIcon from '@mui/icons-material/Key';
import LinearProgress from '@mui/material/LinearProgress';
import Alerta from '../../../shared/components/Alerta';
import { useAuth } from './../../../providers/Authenticacion/useAuth';

function Login() {
    // Estados para almacenar lo que el usuario escribe en los campos de texto.
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Controla si la contraseña se muestra como texto plano o como puntos ocultos.
    const [showPassword, setShowPassword] = useState(false);

    // Almacena y controla la visibilidad de los mensajes de error en pantalla.
    const [errorMessage, setErrorMessage ] = useState('');
    const [loading, setLoading] = useState(false);

    // Hook para redirigir al usuario a otras paginas tras un login exitoso.
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const response = await login(username, password);
        if (response.valid) {
            // Redirigir a la página principal o mostrar mensaje de éxito
            setTimeout(() => { }, 5000);
            setLoading(false);
            navigate('/index');

        } else {
            // Mostrar mensaje de error
            setErrorMessage(response.mensaje);
            setLoading(false);
        }
    }

    return (
        <div className="login-page">

            {/* --- SECCION IZQUIERDA: IMAGEN DE FONDO --- */}
            {/* Contenedor que muestra la imagen corporativa. Su tamaño se controla desde el CSS. */}
            <Box
                className="image-section"
                sx={{
                    display: {
                        xs: "none",   // móvil
                        sm: "block",   // tablets pequeñas
                        md: "block"   // desde laptop
                    },
                    backgroundImage: `url(${bgImage})`
                }}
            />
            
            {/* --- SECCION DERECHA: FORMULARIO DE ACCESO --- */}
            <div className="form-section">
                <div className="form-wrapper">

                    {/* Encabezado con el logotipo institucional y textos de bienvenida */}
                    <div className="header">
                        <div className="brand">
                            <img src={logoImage} alt="Logo SeguraNica" />
                            <span>SeguraNica S.A</span>
                        </div>
                        <h2 className="welcome-text">Bienvenido</h2>
                        <p className="sub-text">Ingresa a SeguraNica S.A.</p>
                    </div>

                    {/* Formulario vinculado a la funcion handleLogin mediante onSubmit */}
                    <form>

                        {/* --- CAMPO DE USUARIO --- */}
                        <div className="input-group">
                            <label htmlFor="username" className="label-text">Usuario</label>
                            <div className="input-container">
                                <PersonIcon sx={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 10 }} />
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Usuario"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* --- CONTRASEÑA --- */}
                        <div className="input-group">
                            <label htmlFor="password" className="label-text">Contraseña</label>
                            <div className="input-container">
                                <KeyIcon sx={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 10 }} />
                                <input
                                    id="password"
                                    aria-label="Contraseña"
                                    // Cambia el tipo de input dinamicamente para revelar u ocultar la clave.
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {/* Alterna el icono dependiendo de si la clave es visible o no. */}
                                    {showPassword ? <VisibilityIcon size={20} /> : <VisibilityOffIcon size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* --- SECCION DE ALERTAS --- */}
                        {/* Renderizado condicional: Solo existe en el DOM si hay un mensaje de error que mostrar. */}
                        {errorMessage && (
                            <div style={{ color: '#d32f2f', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
                                <Alerta severity="error" mensaje={errorMessage} />
                            </div>
                        )}

                        {/* --- BOTONES DE ACCION --- */}
                        {/* Boton tipo submit que dispara el evento handleLogin del formulario. */}
                        <button
                            type="submit"
                            className="btn btn-primary"
                            variant="contained"
                            onClick={handleLogin}
                        >
                            Iniciar sesion
                        </button>
                        {loading == true && (
                            <Box sx={{ width: '100%' }}>
                                <LinearProgress aria-label="Loading…" />
                            </Box>
                        )}
                    </form>

                </div>
            </div>
        </div>
    );
}

export default Login;