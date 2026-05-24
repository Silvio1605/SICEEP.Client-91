import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from "@mui/material";
import bgImage from './../../../assets/imagen_izquierda.png';
import logoImage from './../../../assets/Logo_p.png';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyIcon from '@mui/icons-material/Key';
import './../styles/StyleLogin.css';

function Login() {
    // Estados para almacenar lo que el usuario escribe en los campos de texto.
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Controla si la contraseña se muestra como texto plano o como puntos ocultos.
    const [showPassword, setShowPassword] = useState(false);

    // Almacena y controla la visibilidad de los mensajes de error en pantalla.
    const [errorMessage, ] = useState('');

    // Hook para redirigir al usuario a otras paginas tras un login exitoso.
    const navigate = useNavigate();

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
                                    // Vincula el valor del input al estado de React (Componente Controlado).
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* --- CAMPO DE CONTRASEÑA --- */}
                        <div className="input-group">
                            <label htmlFor="password" className="label-text">Contraseña</label>
                            <div className="input-container">
                                <KeyIcon sx={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 10 }} />
                                <input
                                    id="password"
                                    // Cambia el tipo de input dinamicamente para revelar u ocultar la clave.
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {/* Boton interactivo para alternar el estado visual de la contraseña */}
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
                                {errorMessage}
                            </div>
                        )}

                        {/* --- BOTONES DE ACCION --- */}
                        {/* Boton tipo submit que dispara el evento handleLogin del formulario. */}
                        <button
                            className="btn btn-primary"
                            variant="contained"
                            onClick={() => navigate("/home")}
                        >
                            Iniciar sesion
                        </button>
                        {/* Boton secundario estatico, listo para agregarle logica de recuperacion de clave a futuro. */}
                        <button className="btn btn-secondary">
                            Solicitar cambio de clave
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default Login;