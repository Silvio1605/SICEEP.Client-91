import api from "./../../../api/api";

export const Login = async (usuario) => {
    try {
        return await api.post(`Auth/Login`, usuario);
    } catch (error) {
        console.log(error.response.data);
    }
};

export const Logout = async () => {
    try {
        return await api.post(`Auth/Logout`);
    } catch (error) {
        console.log(error.response.data);
    }
};

export const Me = async () => {
    try {
        return await api.get(`Auth/Me`);
    } catch (error) {
        console.log(error.response.data);
    }
};

export const Reestablecer = async (usuario) => {
    try {

        const response = await api.post(
            "Auth/ReestablecerContraseña",
            usuario
        );
        return {
            status: response.data.status,
            message: response.data.message
        };

    } catch (error) {

        return {
            status: error.response?.status || error.status,
            message:
                error.response?.data?.message ||
                error.message
        };
    }
};

